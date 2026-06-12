// Worker sessions for logged-in commenters. After the Bluesky OAuth flow
// (atproto.ts) verifies an identity, we mint an opaque session token, store the
// captured profile in D1, and hand the browser an httpOnly cookie. Comment
// create then reads the cookie - no re-resolution per request.
//
// The blog (log.fisher.sh) and this Worker (comments.fisher.sh) are different
// hosts, so the cookie is cross-site: SameSite=None; Secure. The blog must fetch
// with credentials: 'include'.
import type { Env } from './env';
import type { Identity } from './identity';

const COOKIE_NAME = 'cmt_session';
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface SessionProfile {
    did: string;
    handle: string | null;
    displayName: string | null;
    avatar: string | null;
    accountCreatedAt: number | null;
}

function token(): string {
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function readCookie(request: Request, name: string): string | null {
    const header = request.headers.get('Cookie');
    if (!header) return null;
    for (const part of header.split(';')) {
        const [k, ...v] = part.trim().split('=');
        if (k === name) return decodeURIComponent(v.join('='));
    }
    return null;
}

function setCookie(value: string, maxAgeSec: number): string {
    // HttpOnly so JS can't read it; Secure + SameSite=None for the cross-site
    // call from the blog; Path=/ so it's sent to every API route.
    return `${COOKIE_NAME}=${value}; HttpOnly; Secure; SameSite=None; Path=/; Max-Age=${maxAgeSec}`;
}

// Create a session for a verified identity. Returns the Set-Cookie header value.
export async function createSession(env: Env, p: SessionProfile): Promise<string> {
    const tok = token();
    const now = Date.now();
    const expires = now + SESSION_TTL_MS;
    await env.DB.prepare(
        `INSERT INTO sessions (token, did, handle, display_name, avatar, account_created_at, created_at, expires_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
        .bind(tok, p.did, p.handle, p.displayName, p.avatar, p.accountCreatedAt, now, expires)
        .run();
    return setCookie(tok, Math.floor(SESSION_TTL_MS / 1000));
}

// Resolve the current session cookie to an identity, or null if absent/expired.
export async function getSessionIdentity(env: Env, request: Request): Promise<Identity | null> {
    const tok = readCookie(request, COOKIE_NAME);
    if (!tok) return null;
    const row = await env.DB.prepare(
        `SELECT did, handle, display_name, avatar, account_created_at
         FROM sessions WHERE token = ? AND expires_at > ?`,
    )
        .bind(tok, Date.now())
        .first<{
            did: string;
            handle: string | null;
            display_name: string | null;
            avatar: string | null;
            account_created_at: number | null;
        }>();
    if (!row) return null;
    return {
        did: row.did,
        handle: row.handle,
        displayName: row.display_name,
        avatar: row.avatar,
        accountCreatedAt: row.account_created_at,
    };
}

// Clear the current session (delete the row) and return a cookie that expires it.
export async function destroySession(env: Env, request: Request): Promise<string> {
    const tok = readCookie(request, COOKIE_NAME);
    if (tok) {
        await env.DB.prepare(`DELETE FROM sessions WHERE token = ?`).bind(tok).run();
    }
    return setCookie('', 0);
}
