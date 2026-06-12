// Bluesky (ATProto) OAuth - identity only, no posting (issue #3).
//
// Flow: the blog sends the reader to GET /oauth/login?handle=..., we run the
// ATProto OAuth dance (handle resolution -> PDS discovery -> PAR -> DPoP-bound
// tokens) via the runtime-agnostic @atproto/oauth-client core (NOT the -node
// wrapper, which pulls in undici and breaks on Workers - see getClient), capture
// the verified DID + profile on the callback, mint a Worker session (session.ts),
// and redirect back to the blog. We never request write scope.
//
// The heavy library is loaded with a dynamic import inside getClient so it only
// runs when an /oauth/* route is actually hit - the rest of the Worker (and the
// test suite) never pulls it in.
//
// NOTE: this dance can't be exercised without a public callback URL + a real
// Bluesky login, so it is unverified by the local test suite. The session layer
// it feeds (session.ts) and everything downstream ARE tested. Verify end to end
// after the first deploy; the ATProto-on-Workers runtime (nodejs_compat) is the
// most likely place to need adjustment.
import type { OAuthClient } from '@atproto/oauth-client';
import type { Env } from './env';
import { errorChain, HttpError } from './http';
import { createSession, destroySession } from './session';
import { getIdentity } from './identity';
import { isAdminIdentity } from './moderation';

// ---- Workers runtime shim ---------------------------------------------------
//
// The atproto resolver libs (@atproto-labs/fetch) construct Requests with two
// fields the Workers runtime rejects at construction time:
//  - `redirect: 'error'`  -> "Invalid redirect value" (Workers allows only
//    'follow'/'manual'). Coerce to 'manual'; these endpoints don't redirect on
//    success, so it's equivalent.
//  - `cache: 'no-store'`  -> "The 'cache' field ... is not implemented." Drop it;
//    Workers' fetch honors cache-control headers by default, which is fine here.
// Without this the OAuth dance dies before any fetch runs (jwks worked because it
// builds no requests; /oauth/login + /callback resolve PDS metadata and hit it).
// Patch the global Request constructor once (idempotent; harmless for every other
// Request). The edge-runtime analog of what @atproto/oauth-client-node gets free.
function sanitizeRequestInit<T extends RequestInit>(init?: T): T | undefined {
    if (!init || (init.redirect !== 'error' && !('cache' in init))) return init;
    const clone = { ...init };
    if (clone.redirect === 'error') clone.redirect = 'manual';
    delete (clone as { cache?: unknown }).cache;
    return clone;
}
{
    const BaseRequest = globalThis.Request;
    if (!(BaseRequest as { __atprotoPatched?: boolean }).__atprotoPatched) {
        class PatchedRequest extends BaseRequest {
            constructor(input: RequestInfo | URL, init?: RequestInit) {
                super(input, sanitizeRequestInit(init));
            }
        }
        (PatchedRequest as { __atprotoPatched?: boolean }).__atprotoPatched = true;
        globalThis.Request = PatchedRequest as unknown as typeof Request;
    }
}

// ---- D1-backed stores -------------------------------------------------------

// Generic key/value store over a D1 table, JSON-serializing the opaque values the
// OAuth client hands us (PKCE/PAR state; DPoP-bound session tokens).
function kvStore<T>(env: Env, table: 'oauth_state' | 'oauth_session') {
    return {
        async set(key: string, value: T): Promise<void> {
            await env.DB.prepare(
                `INSERT INTO ${table} (key, value, created_at) VALUES (?, ?, ?)
                 ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
            )
                .bind(key, JSON.stringify(value), Date.now())
                .run();
        },
        async get(key: string): Promise<T | undefined> {
            const row = await env.DB.prepare(`SELECT value FROM ${table} WHERE key = ?`)
                .bind(key)
                .first<{ value: string }>();
            return row ? (JSON.parse(row.value) as T) : undefined;
        },
        async del(key: string): Promise<void> {
            await env.DB.prepare(`DELETE FROM ${table} WHERE key = ?`).bind(key).run();
        },
    };
}

// ---- client construction ----------------------------------------------------

export function clientMetadata(env: Env): Record<string, unknown> {
    const base = env.PUBLIC_URL.replace(/\/+$/, '');
    return {
        client_id: `${base}/oauth/client-metadata.json`,
        client_name: 'log.fisher.sh comments',
        client_uri: base,
        redirect_uris: [`${base}/oauth/callback`],
        // Identity only. `atproto` is the base scope; no repo write scopes.
        scope: 'atproto',
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        application_type: 'web',
        token_endpoint_auth_method: 'private_key_jwt',
        token_endpoint_auth_signing_alg: 'ES256',
        dpop_bound_access_tokens: true,
        jwks_uri: `${base}/oauth/jwks.json`,
    };
}

let cached: OAuthClient | null = null;

// WebCrypto-backed runtime for the OAuth client. We can't use
// @atproto/oauth-client-node: it eagerly imports @atproto-labs/fetch-node ->
// undici (Node's HTTP stack) at module load, which throws on the Workers
// runtime. So we build on the runtime-agnostic core OAuthClient and supply a
// Workers-native runtime (WebCrypto + global fetch) + a string handleResolver
// (HTTP appview resolution, no node:dns). Mirrors NodeOAuthClient's defaults.
const DIGEST_NAMES: Record<string, string> = {
    sha256: 'SHA-256',
    sha384: 'SHA-384',
    sha512: 'SHA-512',
};

// Same sanitizing for the fetch() init form (the Request-construction form is
// handled by the global Request patch above): strip redirect:'error' / cache.
function workersFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return globalThis.fetch(input, sanitizeRequestInit(init));
}

async function getClient(env: Env): Promise<OAuthClient> {
    if (cached) return cached;
    if (!env.OAUTH_PRIVATE_KEY) throw new HttpError(503, 'OAuth is not configured');
    const { JoseKey } = await import('@atproto/jwk-jose');
    const { OAuthClient } = await import('@atproto/oauth-client');
    const key = await JoseKey.fromImportable(env.OAUTH_PRIVATE_KEY, 'key1');

    // The core client stores DPoP keys as Key instances; our D1 kvStore only
    // serializes JSON. Wrap it to (de)serialize the DPoP key as a JWK, exactly
    // like oauth-client-node's toDpopKeyStore (which we can't import).
    const toDpopKeyStore = (store: ReturnType<typeof kvStore<Record<string, unknown>>>) => ({
        async set(sub: string, { dpopKey, ...data }: Record<string, unknown> & { dpopKey: { privateJwk?: unknown } }) {
            const dpopJwk = dpopKey.privateJwk;
            if (!dpopJwk) throw new Error('Private DPoP JWK is missing.');
            await store.set(sub, { ...data, dpopJwk });
        },
        async get(sub: string) {
            const result = await store.get(sub);
            if (!result) return undefined;
            const { dpopJwk, ...data } = result as Record<string, unknown>;
            const dpopKey = await JoseKey.fromJWK(dpopJwk as never);
            return { ...data, dpopKey };
        },
        del: (sub: string) => store.del(sub),
    });

    cached = new OAuthClient({
        clientMetadata: clientMetadata(env) as never,
        keyset: [key],
        // String resolver -> HTTP appview resolution (no node:dns).
        handleResolver: 'https://bsky.social',
        responseMode: 'query',
        // Workers' fetch only accepts redirect: 'follow' | 'manual'. The atproto
        // handle + DID resolvers issue fetch with redirect: 'error' (unsupported
        // at the edge) and throw "Invalid redirect value". Normalize 'error' ->
        // 'manual' in both forms it arrives: an init option, or a Request object.
        // These endpoints don't redirect on success, so it's equivalent.
        fetch: workersFetch as typeof fetch,
        runtimeImplementation: {
            createKey: (algs: string[]) => JoseKey.generate(algs),
            getRandomValues: (length: number) => crypto.getRandomValues(new Uint8Array(length)),
            digest: async (data: Uint8Array, alg: { name: string }) => {
                const name = DIGEST_NAMES[alg.name];
                if (!name) throw new Error(`Unsupported digest algorithm: ${alg.name}`);
                return new Uint8Array(await crypto.subtle.digest(name, data));
            },
        },
        stateStore: toDpopKeyStore(kvStore(env, 'oauth_state')) as never,
        sessionStore: toDpopKeyStore(kvStore(env, 'oauth_session')) as never,
    });
    return cached;
}

// ---- route handlers ---------------------------------------------------------

export async function handleClientMetadata(env: Env): Promise<Response> {
    return Response.json(clientMetadata(env));
}

export async function handleJwks(env: Env): Promise<Response> {
    const client = await getClient(env);
    return Response.json(client.jwks);
}

// /oauth/login + /oauth/callback are full-page browser navigations, so on error
// they get a small styled HTML page with a link back to the blog - not the raw
// JSON the API routes return. The real error is logged for the operator.
function oauthErrorPage(env: Env, status: number, message: string): Response {
    const blog = env.ALLOWED_ORIGIN;
    const safe = message.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c] as string);
    const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Sign-in problem</title>
<style>
  :root { color-scheme: light dark; }
  body { font: 16px/1.6 system-ui, sans-serif; margin: 0; min-height: 100vh;
         display: grid; place-items: center; background: #faf9f7; color: #1a1a1a; }
  @media (prefers-color-scheme: dark) { body { background: #16140f; color: #ece8e0; } }
  main { max-width: 30rem; padding: 2rem; text-align: center; }
  h1 { font-size: 1.25rem; margin: 0 0 .5rem; }
  p { margin: .5rem 0; color: #6b6357; }
  a { color: inherit; }
</style></head>
<body><main>
  <h1>Couldn't finish signing in</h1>
  <p>${safe}</p>
  <p><a href="${blog}">&larr; Back to the blog</a></p>
</main></body></html>`;
    return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

// GET /oauth/login?handle=alice.bsky.social  -> 302 to the user's auth server.
export async function handleLogin(request: Request, env: Env): Promise<Response> {
    const handle = new URL(request.url).searchParams.get('handle')?.trim();
    if (!handle) return oauthErrorPage(env, 400, 'No Bluesky handle was provided.');
    try {
        const client = await getClient(env);
        const url = await client.authorize(handle, { scope: 'atproto' });
        return Response.redirect(url.toString(), 302);
    } catch (err) {
        console.error('oauth login failed', errorChain(err), (err as Error)?.stack);
        return oauthErrorPage(env, 502, `Couldn't start sign-in for "${handle}". Double-check the handle and try again.`);
    }
}

// GET /oauth/callback?...  -> verify, capture profile, mint session, back to blog.
export async function handleCallback(request: Request, env: Env): Promise<Response> {
    const params = new URL(request.url).searchParams;
    // The auth server can redirect back with an OAuth error (e.g. the user
    // declined consent: ?error=access_denied).
    const authError = params.get('error');
    if (authError) {
        return oauthErrorPage(env, 400, `Bluesky sign-in was cancelled or failed: ${params.get('error_description') || authError}`);
    }
    if (!params.get('code') || !params.get('state')) {
        return oauthErrorPage(env, 400, 'This sign-in link is missing required parameters.');
    }
    try {
        const client = await getClient(env);
        const { session } = await client.callback(params);
        const did = session.did;

        const profile = await fetchProfile(did);
        const setCookie = await createSession(env, {
            did,
            handle: profile.handle,
            displayName: profile.displayName,
            avatar: profile.avatar,
            accountCreatedAt: profile.accountCreatedAt,
        });

        // Back to the blog. The session cookie rides along on the redirect response.
        return new Response(null, {
            status: 302,
            headers: { Location: env.ALLOWED_ORIGIN, 'Set-Cookie': setCookie },
        });
    } catch (err) {
        console.error('oauth callback failed', errorChain(err), (err as Error)?.stack);
        return oauthErrorPage(env, 502, 'Something went wrong completing your Bluesky sign-in. Please try again.');
    }
}

// GET /oauth/me  -> who's logged in (for the UI to render sign-in state). The
// isAdmin flag lets the UI show moderation controls; it's advisory only - every
// /admin/* endpoint re-checks via requireAdmin, so a forged flag buys nothing.
export async function handleMe(request: Request, env: Env, cors: Record<string, string>): Promise<Response> {
    const identity = await getIdentity(request, env);
    if (!identity) return Response.json({ loggedIn: false }, { headers: cors });
    const isAdmin = await isAdminIdentity(env, identity);
    return Response.json({ loggedIn: true, isAdmin, ...identity }, { headers: cors });
}

// POST /oauth/logout  -> clear the session.
export async function handleLogout(request: Request, env: Env, cors: Record<string, string>): Promise<Response> {
    const setCookie = await destroySession(env, request);
    return Response.json({ ok: true }, { headers: { ...cors, 'Set-Cookie': setCookie } });
}

// GET /oauth/dev-login  -> DEV ONLY. Mints a real session cookie for a fixed
// identity (defaults to ADMIN_DID/fisher.sh) so the comment UX can be exercised
// in a browser locally without the Bluesky OAuth round-trip (which can't redirect
// to localhost). 404 unless DEV_AUTH=1; never reachable in production.
export async function handleDevLogin(request: Request, env: Env): Promise<Response> {
    if (env.DEV_AUTH !== '1') return new Response('not found', { status: 404 });
    const params = new URL(request.url).searchParams;
    const did = params.get('did') || env.ADMIN_DID || 'did:plc:devuser';
    const handle = params.get('handle') || 'fisher.sh';
    const setCookie = await createSession(env, {
        did,
        handle,
        displayName: handle,
        avatar: null,
        accountCreatedAt: null,
    });
    return new Response(null, {
        status: 302,
        headers: { Location: env.ALLOWED_ORIGIN, 'Set-Cookie': setCookie },
    });
}

// ---- profile ----------------------------------------------------------------

interface Profile {
    handle: string | null;
    displayName: string | null;
    avatar: string | null;
    accountCreatedAt: number | null;
}

// Public, unauthenticated profile lookup for handle/displayName/avatar/age. No
// auth needed - this is public data, and we only want identity display fields.
async function fetchProfile(did: string): Promise<Profile> {
    try {
        const res = await fetch(
            `https://public.api.bsky.app/xrpc/app.bsky.actor.getProfile?actor=${encodeURIComponent(did)}`,
        );
        if (!res.ok) return { handle: null, displayName: null, avatar: null, accountCreatedAt: null };
        const p = (await res.json()) as {
            handle?: string;
            displayName?: string;
            avatar?: string;
            createdAt?: string;
        };
        return {
            handle: p.handle ?? null,
            displayName: p.displayName ?? null,
            avatar: p.avatar ?? null,
            accountCreatedAt: p.createdAt ? Date.parse(p.createdAt) || null : null,
        };
    } catch {
        return { handle: null, displayName: null, avatar: null, accountCreatedAt: null };
    }
}
