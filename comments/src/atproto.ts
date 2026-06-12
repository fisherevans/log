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
import { HttpError } from './http';
import { createSession, destroySession } from './session';
import { getIdentity } from './identity';

// ---- Workers runtime shim ---------------------------------------------------
//
// The atproto resolver libs (@atproto-labs/fetch, used by the handle + DID
// resolvers) construct `new Request(url, { redirect: 'error' })`. The Workers
// runtime rejects 'error' at Request-construction time ("Invalid redirect
// value"), so the OAuth dance dies before any fetch runs. Patch the global
// Request constructor once to coerce 'error' -> 'manual' (these endpoints don't
// redirect on success, so it's equivalent). Idempotent; harmless for every other
// Request. This is the edge-runtime analog of what @atproto/oauth-client-node
// gets for free on Node.
{
    const BaseRequest = globalThis.Request;
    if (!(BaseRequest as { __redirectPatched?: boolean }).__redirectPatched) {
        class PatchedRequest extends BaseRequest {
            constructor(input: RequestInfo | URL, init?: RequestInit) {
                if (init?.redirect === 'error') {
                    super(input, { ...init, redirect: 'manual' });
                } else {
                    super(input, init);
                }
            }
        }
        (PatchedRequest as { __redirectPatched?: boolean }).__redirectPatched = true;
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

// Workers' fetch rejects redirect: 'error'. The atproto resolvers use it in two
// forms - as an init option and baked into a Request - so normalize both to
// 'manual' (the resolver endpoints don't redirect on success).
function workersFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    if (init?.redirect === 'error') {
        return globalThis.fetch(input, { ...init, redirect: 'manual' });
    }
    if (input instanceof Request && input.redirect === 'error') {
        return globalThis.fetch(new Request(input, { redirect: 'manual' }), init);
    }
    return globalThis.fetch(input, init);
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

// GET /oauth/login?handle=alice.bsky.social  -> 302 to the user's auth server.
export async function handleLogin(request: Request, env: Env): Promise<Response> {
    const handle = new URL(request.url).searchParams.get('handle')?.trim();
    if (!handle) throw new HttpError(400, 'handle required');
    const client = await getClient(env);
    const url = await client.authorize(handle, { scope: 'atproto' });
    return Response.redirect(url.toString(), 302);
}

// GET /oauth/callback?...  -> verify, capture profile, mint session, back to blog.
export async function handleCallback(request: Request, env: Env): Promise<Response> {
    const params = new URL(request.url).searchParams;
    // The auth server can redirect back with an OAuth error (e.g. the user
    // declined consent: ?error=access_denied). Surface it as a clean 400 rather
    // than letting client.callback throw an opaque 500.
    const authError = params.get('error');
    if (authError) {
        throw new HttpError(400, `Bluesky sign-in failed: ${params.get('error_description') || authError}`);
    }
    if (!params.get('code') || !params.get('state')) {
        throw new HttpError(400, 'Missing OAuth callback parameters (code/state)');
    }
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
}

// GET /oauth/me  -> who's logged in (for the UI to render sign-in state).
export async function handleMe(request: Request, env: Env, cors: Record<string, string>): Promise<Response> {
    const identity = await getIdentity(request, env);
    return Response.json(identity ? { loggedIn: true, ...identity } : { loggedIn: false }, { headers: cors });
}

// POST /oauth/logout  -> clear the session.
export async function handleLogout(request: Request, env: Env, cors: Record<string, string>): Promise<Response> {
    const setCookie = await destroySession(env, request);
    return Response.json({ ok: true }, { headers: { ...cors, 'Set-Cookie': setCookie } });
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
