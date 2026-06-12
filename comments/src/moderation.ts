// Moderation v1 (issue #4). DID-gated: Fisher's Bluesky DID (env.ADMIN_DID) is
// the only admin. The gate is a single swappable chokepoint (requireAdmin) so it
// can move to Hydra OIDC later without touching the handlers.
//
// Actions: delete any comment, ban/unban a DID or IP, toggle comments per-post,
// toggle comments globally (kill switch).
import type { Env } from './env';
import type { Telemetry } from './datadog';
import { HttpError } from './http';
import { type Identity, getIdentity } from './identity';
import {
    type BanSubject,
    addBan,
    getComment,
    isGrant,
    removeBan,
    setGlobalEnabled,
    setPostEnabled,
    softDeleteComment,
} from './db';

// The admin gate. Returns the admin identity or throws. Authorization now reads
// the DID-keyed grant store (the `admin` group; see migrations/0003_grants.sql),
// which is the shared source of truth across the edge + the k3s admin apps.
// env.ADMIN_DID is kept as a transitional fallback for one deploy and dropped in
// Phase 3 once the grant is seeded.
export async function requireAdmin(request: Request, env: Env): Promise<Identity> {
    const identity = await getIdentity(request, env);
    if (!identity) throw new HttpError(401, 'admin sign-in required');
    const ok = (await isGrant(env.DB, identity.did, 'admin')) || (!!env.ADMIN_DID && identity.did === env.ADMIN_DID);
    if (!ok) throw new HttpError(403, 'not an admin');
    return identity;
}

interface BanBody {
    type?: BanSubject;
    subject?: string;
    reason?: string;
}

export async function handleBan(request: Request, env: Env, body: BanBody, telemetry: Telemetry): Promise<unknown> {
    await requireAdmin(request, env);
    const type = body.type;
    const subject = (body.subject ?? '').trim();
    if (type !== 'did' && type !== 'ip') throw new HttpError(400, "type must be 'did' or 'ip'");
    if (!subject) throw new HttpError(400, 'subject required');
    await addBan(env.DB, type, subject, body.reason ?? null, Date.now());
    telemetry.event('ban', { subject_type: type, subject, reason: body.reason ?? null });
    return { ok: true };
}

export async function handleUnban(request: Request, env: Env, body: BanBody, telemetry: Telemetry): Promise<unknown> {
    await requireAdmin(request, env);
    const type = body.type;
    const subject = (body.subject ?? '').trim();
    if (type !== 'did' && type !== 'ip') throw new HttpError(400, "type must be 'did' or 'ip'");
    if (!subject) throw new HttpError(400, 'subject required');
    await removeBan(env.DB, type, subject);
    telemetry.event('unban', { subject_type: type, subject });
    return { ok: true };
}

// Ban the IP behind a specific comment (admins never see raw IPs, only the
// salted hash on the comment). Optionally the comment is deleted too.
export async function handleBanCommentIp(
    request: Request,
    env: Env,
    commentId: string,
    body: { reason?: string; deleteComment?: boolean },
    telemetry: Telemetry,
): Promise<unknown> {
    await requireAdmin(request, env);
    const row = await getComment(env.DB, commentId);
    if (!row) throw new HttpError(404, 'comment not found');
    if (!row.ip_hash) throw new HttpError(400, 'comment has no IP hash to ban');
    await addBan(env.DB, 'ip', row.ip_hash, body.reason ?? `ip behind comment ${commentId}`, Date.now());
    if (body.deleteComment) await softDeleteComment(env.DB, commentId, Date.now());
    telemetry.event('ban', { subject_type: 'ip', subject: row.ip_hash, via_comment: commentId });
    return { ok: true, bannedIpHash: row.ip_hash };
}

export async function handleTogglePost(
    request: Request,
    env: Env,
    postId: string,
    body: { enabled?: boolean },
    telemetry: Telemetry,
): Promise<unknown> {
    await requireAdmin(request, env);
    if (typeof body.enabled !== 'boolean') throw new HttpError(400, 'enabled (boolean) required');
    await setPostEnabled(env.DB, postId, body.enabled);
    telemetry.event('toggle_post', { post_id: postId, enabled: body.enabled });
    return { ok: true, postId, enabled: body.enabled };
}

export async function handleToggleGlobal(
    request: Request,
    env: Env,
    body: { enabled?: boolean },
    telemetry: Telemetry,
): Promise<unknown> {
    await requireAdmin(request, env);
    if (typeof body.enabled !== 'boolean') throw new HttpError(400, 'enabled (boolean) required');
    await setGlobalEnabled(env.DB, body.enabled);
    telemetry.event('toggle_global', { enabled: body.enabled });
    return { ok: true, enabled: body.enabled };
}
