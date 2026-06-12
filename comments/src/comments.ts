// Comment API handlers: list (public), create (auth), delete (author or admin).
// Abuse checks (Turnstile, bans, rate limit, progressive trust) and observability
// layer in around create via issues #4 and #6 - the seams are marked below.
import type { Env } from './env';
import { HttpError, clientIp } from './http';
import { getIdentity } from './identity';
import {
    type CommentRow,
    commentsEnabled,
    getComment,
    insertComment,
    listComments,
    softDeleteComment,
} from './db';
import { mintId } from './ids';
import { enforceAbuse } from './abuse';
import { hashIp } from './hash';

const MAX_BODY = 4000;

// Public shape of a comment. ip_hash and other internals never leave the Worker.
// A deleted comment is returned as a tombstone (empty body, deleted: true) so the
// thread structure renders without exposing the original text.
interface PublicComment {
    id: string;
    postId: string;
    parentId: string | null;
    author: { did: string; handle: string | null; displayName: string | null; avatar: string | null };
    body: string;
    createdAt: number;
    deleted: boolean;
}

function shape(row: CommentRow): PublicComment {
    const deleted = row.deleted_at != null;
    return {
        id: row.id,
        postId: row.post_id,
        parentId: row.parent_id,
        author: {
            did: row.author_did,
            handle: row.author_handle,
            displayName: row.author_display_name,
            avatar: row.author_avatar,
        },
        body: deleted ? '' : row.body,
        createdAt: row.created_at,
        deleted,
    };
}

// GET /comments?post_id=...  -> { enabled, comments }
export async function handleList(request: Request, env: Env): Promise<unknown> {
    const postId = new URL(request.url).searchParams.get('post_id');
    if (!postId) throw new HttpError(400, 'post_id required');

    const [rows, enabled] = await Promise.all([listComments(env.DB, postId), commentsEnabled(env.DB, postId)]);
    return { enabled, comments: rows.map(shape) };
}

interface CreateBody {
    postId?: string;
    parentId?: string | null;
    body?: string;
    turnstileToken?: string;
}

// POST /comments  -> the created comment. Auth required.
export async function handleCreate(request: Request, env: Env, body: CreateBody): Promise<unknown> {
    const identity = await getIdentity(request, env);
    if (!identity) throw new HttpError(401, 'sign in to comment');

    const postId = (body.postId ?? '').trim();
    const text = (body.body ?? '').trim();
    const parentId = body.parentId ?? null;
    if (!postId) throw new HttpError(400, 'postId required');
    if (!text) throw new HttpError(400, 'comment body required');
    if (text.length > MAX_BODY) throw new HttpError(400, `comment too long (max ${MAX_BODY} chars)`);

    if (!(await commentsEnabled(env.DB, postId))) {
        throw new HttpError(403, 'comments are disabled for this post');
    }

    if (parentId) {
        const parent = await getComment(env.DB, parentId);
        if (!parent || parent.post_id !== postId) throw new HttpError(400, 'parent comment not found on this post');
    }

    // --- abuse checks (issue #4) ------------------------------------------
    // Turnstile, ban lists, per-IP/per-DID rate limiting, and progressive-trust
    // caps, cheapest-first. Throws 403/429 to reject before the insert.
    const ip = clientIp(request);
    const ipHash = await hashIp(env, ip);
    await enforceAbuse(env, identity, ipHash, body.turnstileToken, ip);

    const id = mintId();
    const createdAt = Date.now();
    await insertComment(env.DB, {
        id,
        postId,
        parentId,
        authorDid: identity.did,
        authorHandle: identity.handle,
        authorDisplayName: identity.displayName,
        authorAvatar: identity.avatar,
        body: text,
        createdAt,
        ipHash,
    });

    // --- observability (issue #6) -----------------------------------------
    // The comment.created metric + structured activity log ship here, via
    // ctx.waitUntil so they never block the response.

    const row = await getComment(env.DB, id);
    return shape(row!);
}

// DELETE /comments/:id  ->  { ok }. Allowed for the comment's author or the admin.
export async function handleDelete(request: Request, env: Env, id: string): Promise<unknown> {
    const identity = await getIdentity(request, env);
    if (!identity) throw new HttpError(401, 'sign in to delete');

    const row = await getComment(env.DB, id);
    if (!row || row.deleted_at != null) throw new HttpError(404, 'comment not found');

    const isAuthor = identity.did === row.author_did;
    const isAdmin = identity.did === env.ADMIN_DID;
    if (!isAuthor && !isAdmin) throw new HttpError(403, 'not allowed to delete this comment');

    await softDeleteComment(env.DB, id, Date.now());
    return { ok: true };
}
