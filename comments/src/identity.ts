// Commenter identity. The verified identity attached to a comment.
//
// In production this comes from a Worker session cookie minted by the Bluesky
// OAuth flow (issue #3 - see atproto.ts + session.ts). For local testing,
// DEV_AUTH=1 lets a caller inject an identity via X-Dev-Did / X-Dev-Handle
// headers. That path is gated on the env flag and is never enabled in production.
import type { Env } from './env';
import { getSessionIdentity } from './session';

export interface Identity {
    did: string;
    handle: string | null;
    displayName: string | null;
    avatar: string | null;
    // Bluesky account creation time (epoch ms), captured at login when available.
    // Feeds progressive trust (an old account skips the new-account cap).
    accountCreatedAt?: number | null;
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
    // Production path: the Worker session cookie minted by the Bluesky OAuth flow.
    return await getSessionIdentity(env, request);
}
