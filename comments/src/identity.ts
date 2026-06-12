// Commenter identity. The verified identity attached to a comment.
//
// In production this comes from a Worker session cookie minted by the Bluesky
// OAuth flow (issue #3 - see auth.ts, which fills in resolveSessionIdentity).
// Until that lands, and for local testing, DEV_AUTH=1 lets a caller inject an
// identity via X-Dev-Did / X-Dev-Handle headers. That path is gated on the env
// flag and is never enabled in production.
import type { Env } from './env';

export interface Identity {
    did: string;
    handle: string | null;
    displayName: string | null;
    avatar: string | null;
}

export async function getIdentity(request: Request, env: Env): Promise<Identity | null> {
    if (env.DEV_AUTH === '1') {
        const did = request.headers.get('X-Dev-Did');
        if (did) {
            return {
                did,
                handle: request.headers.get('X-Dev-Handle'),
                displayName: request.headers.get('X-Dev-Handle'),
                avatar: null,
            };
        }
    }
    // Real session lookup is wired up in issue #3 (auth.ts). Until then, no
    // production identity is available.
    return await resolveSessionIdentity(request, env);
}

// Placeholder until the OAuth session store lands (#3). Returns null so create
// is unauthenticated-by-default rather than accidentally open.
async function resolveSessionIdentity(_request: Request, _env: Env): Promise<Identity | null> {
    return null;
}
