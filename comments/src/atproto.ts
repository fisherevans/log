// Bluesky (ATProto) OAuth - identity only, no posting (issue #3).
//
// Flow: the blog sends the reader to GET /oauth/login?handle=..., we run the
// ATProto OAuth dance (handle resolution -> PDS discovery -> PAR -> DPoP-bound
// tokens) via @atproto/oauth-client-node, capture the verified DID + profile on
// the callback, mint a Worker session (session.ts), and redirect back to the
// blog. We never request write scope.
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
import type { NodeOAuthClient } from '@atproto/oauth-client-node';
import type { Env } from './env';
import { HttpError } from './http';
import { createSession, destroySession } from './session';
import { getIdentity } from './identity';

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

let cached: NodeOAuthClient | null = null;

async function getClient(env: Env): Promise<NodeOAuthClient> {
    if (cached) return cached;
    if (!env.OAUTH_PRIVATE_KEY) throw new HttpError(503, 'OAuth is not configured');
    const { NodeOAuthClient, JoseKey } = await import('@atproto/oauth-client-node');
    const key = await JoseKey.fromImportable(env.OAUTH_PRIVATE_KEY, 'key1');
    cached = new NodeOAuthClient({
        clientMetadata: clientMetadata(env) as never,
        keyset: [key],
        // bsky.social resolves handles + serves the auth metadata for bsky PDSs.
        handleResolver: 'https://bsky.social',
        stateStore: kvStore(env, 'oauth_state') as never,
        sessionStore: kvStore(env, 'oauth_session') as never,
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
    const client = await getClient(env);
    const params = new URL(request.url).searchParams;
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
