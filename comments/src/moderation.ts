// Moderation v1 (issue #4). DID-gated: Fisher's Bluesky DID (env.ADMIN_DID) is
// the only admin. The gate is a single swappable chokepoint (requireAdmin) so it
// can move to Hydra OIDC later without touching the handlers.
//
// Actions: delete any comment, ban/unban a DID or IP, toggle comments per-post,
// toggle comments globally (kill switch).
import type { Env } from './env';
import { HttpError } from './http';
import { type Identity, getIdentity } from './identity';
import {
    type BanSubject,
    addBan,
    getComment,
    removeBan,
    setGlobalEnabled,
    setPostEnabled,
    softDeleteComment,
} from './db';

// The admin gate. Returns the admin identity or throws. Swap this body for a
// Hydra-session check when the admin SPA lands - callers are unaffected.
export async function requireAdmin(request: Request, env: Env): Promise<Identity> {
    const identity = await getIdentity(request, env);
    if (!identity) throw new HttpError(401, 'admin sign-in required');
    if (identity.did !== env.ADMIN_DID) throw new HttpError(403, 'not an admin');
    return identity;
}

interface BanBody {
    type?: BanSubject;
    subject?: string;
    reason?: string;
}

export async function handleBan(request: Request, env: Env, body: BanBody): Promise<unknown> {
    await requireAdmin(request, env);
    const type = body.type;
    const subject = (body.subject ?? '').trim();
    if (type !== 'did' && type !== 'ip') throw new HttpError(400, "type must be 'did' or 'ip'");
    if (!subject) throw new HttpError(400, 'subject required');
    await addBan(env.DB, type, subject, body.reason ?? null, Date.now());
    return { ok: true };
}

export async function handleUnban(request: Request, env: Env, body: BanBody): Promise<unknown> {
    await requireAdmin(request, env);
    const type = body.type;
    const subject = (body.subject ?? '').trim();
    if (type !== 'did' && type !== 'ip') throw new HttpError(400, "type must be 'did' or 'ip'");
    if (!subject) throw new HttpError(400, 'subject required');
    await removeBan(env.DB, type, subject);
    return { ok: true };
}

// Ban the IP behind a specific comment (admins never see raw IPs, only the
// salted hash on the comment). Optionally the comment is deleted too.
export async function handleBanCommentIp(
    request: Request,
    env: Env,
    commentId: string,
    body: { reason?: string; deleteComment?: boolean },
): Promise<unknown> {
    await requireAdmin(request, env);
    const row = await getComment(env.DB, commentId);
    if (!row) throw new HttpError(404, 'comment not found');
    if (!row.ip_hash) throw new HttpError(400, 'comment has no IP hash to ban');
    await addBan(env.DB, 'ip', row.ip_hash, body.reason ?? `ip behind comment ${commentId}`, Date.now());
    if (body.deleteComment) await softDeleteComment(env.DB, commentId, Date.now());
    return { ok: true, bannedIpHash: row.ip_hash };
}

export async function handleTogglePost(
    request: Request,
    env: Env,
    postId: string,
    body: { enabled?: boolean },
): Promise<unknown> {
    await requireAdmin(request, env);
    if (typeof body.enabled !== 'boolean') throw new HttpError(400, 'enabled (boolean) required');
    await setPostEnabled(env.DB, postId, body.enabled);
    return { ok: true, postId, enabled: body.enabled };
}

export async function handleToggleGlobal(request: Request, env: Env, body: { enabled?: boolean }): Promise<unknown> {
    await requireAdmin(request, env);
    if (typeof body.enabled !== 'boolean') throw new HttpError(400, 'enabled (boolean) required');
    await setGlobalEnabled(env.DB, body.enabled);
    return { ok: true, enabled: body.enabled };
}
