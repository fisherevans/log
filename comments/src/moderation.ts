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
    isGlobalEnabled,
    isGrant,
    isPostEnabled,
    removeBan,
    setGlobalEnabled,
    setPostEnabled,
    softDeleteComment,
} from './db';

// Is this identity an admin? Authorization reads the DID-keyed grant store (the
// `admin` group; see migrations/0003_grants.sql), the shared source of truth
// across the edge + the k3s admin apps. env.ADMIN_DID is kept as an intentional
// break-glass admin: the env-configured DID always passes, so a corrupted/empty
// grants table can't lock the operator out of moderation (parallel to the login
// app's ?recover=1 password break-glass; see auth.md). One chokepoint so the
// `/oauth/me` isAdmin flag, delete-any, and requireAdmin all agree.
export async function isAdminIdentity(env: Env, identity: Identity): Promise<boolean> {
    return (await isGrant(env.DB, identity.did, 'admin')) || (!!env.ADMIN_DID && identity.did === env.ADMIN_DID);
}

// The admin gate. Returns the admin identity or throws.
export async function requireAdmin(request: Request, env: Env): Promise<Identity> {
    const identity = await getIdentity(request, env);
    if (!identity) throw new HttpError(401, 'admin sign-in required');
    if (!(await isAdminIdentity(env, identity))) throw new HttpError(403, 'not an admin');
    return identity;
}

interface BanBody {
    type?: BanSubject;
    subject?: string;
    reason?: string;
    days?: number; // temp ban: expires this many days out. Omitted/0 = permanent.
}

export async function handleBan(request: Request, env: Env, body: BanBody, telemetry: Telemetry): Promise<unknown> {
    await requireAdmin(request, env);
    const type = body.type;
    const subject = (body.subject ?? '').trim();
    if (type !== 'did' && type !== 'ip') throw new HttpError(400, "type must be 'did' or 'ip'");
    if (!subject) throw new HttpError(400, 'subject required');
    const now = Date.now();
    const days = typeof body.days === 'number' && body.days > 0 ? body.days : null;
    if (body.days != null && (typeof body.days !== 'number' || body.days < 0 || !Number.isFinite(body.days))) {
        throw new HttpError(400, 'days must be a positive number');
    }
    const expiresAt = days ? now + days * 86_400_000 : null;
    await addBan(env.DB, type, subject, body.reason ?? null, now, expiresAt);
    telemetry.event('ban', { subject_type: type, subject, reason: body.reason ?? null, expires_at: expiresAt });
    return { ok: true, expiresAt };
}

// GET /admin/status?post_id= -> the two switch states, for the admin modal.
export async function handleStatus(request: Request, env: Env, postId: string): Promise<unknown> {
    await requireAdmin(request, env);
    const [global, post] = await Promise.all([isGlobalEnabled(env.DB), isPostEnabled(env.DB, postId)]);
    return { global, post };
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
