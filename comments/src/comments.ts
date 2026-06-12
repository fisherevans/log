// Comment API handlers: list (public), create (auth), delete (author or admin).
// Abuse checks (Turnstile, bans, rate limit, progressive trust) and observability
// layer in around create via issues #4 and #6 - the seams are marked below.
import type { Env } from './env';
import { HttpError, clientIp } from './http';
import { getIdentity } from './identity';
import {
    type CommentRow,
    applyEdit,
    commentsEnabled,
    countChildren,
    getComment,
    hardDeleteComment,
    insertComment,
    listComments,
    softDeleteComment,
} from './db';
import { mintId } from './ids';
import { enforceAbuse } from './abuse';
import { hashIp } from './hash';
import { isAdminIdentity } from './moderation';
import type { Telemetry } from './datadog';

const MAX_BODY = 4000;

// Edits (issue #15): allowed only briefly after posting and a few times at most.
// After the window closes it's delete-only. The cap doubles as the per-day rate
// limit (<= MAX_EDITS inside a sub-day window). Delete is never gated by this.
const EDIT_WINDOW_MS = 24 * 60 * 60 * 1000; // 24h
const MAX_EDITS = 3;

// Added+removed char count between two strings via common prefix/suffix - a cheap
// magnitude for the "edited" indicator (no diff library, no content exposed).
function editMagnitude(oldB: string, newB: string): number {
    let p = 0;
    const max = Math.min(oldB.length, newB.length);
    while (p < max && oldB[p] === newB[p]) p++;
    let s = 0;
    while (s < oldB.length - p && s < newB.length - p && oldB[oldB.length - 1 - s] === newB[newB.length - 1 - s]) s++;
    return oldB.length - p - s + (newB.length - p - s);
}

// Server-side body hygiene. The client renders comment bodies through a vetted
// markdown parser + DOMPurify allowlist (src/scripts/markdown.ts), so stored
// text is never injected as HTML - but we still normalize what lands in the DB:
// strip control chars (except \n and \t), normalize CRLF, and collapse runs of
// 3+ blank lines so a comment can't be padded into a wall of whitespace. This is
// the back-end half of the "validate both ends" contract for issue #17.
function normalizeBody(raw: string): string {
    return raw
        .replace(/\r\n?/g, '\n')
        .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
}

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
    // Edit indicator (#15). The old text itself is never exposed - only that it
    // was edited, how many times, and the rough char magnitude.
    editedAt: number | null;
    editCount: number;
    charsChanged: number;
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
        editedAt: deleted ? null : row.edited_at,
        editCount: deleted ? 0 : row.edit_count,
        charsChanged: deleted ? 0 : row.chars_changed,
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
export async function handleCreate(
    request: Request,
    env: Env,
    body: CreateBody,
    telemetry: Telemetry,
): Promise<unknown> {
    const identity = await getIdentity(request, env);
    if (!identity) throw new HttpError(401, 'sign in to comment');

    const postId = (body.postId ?? '').trim();
    const text = normalizeBody(body.body ?? '');
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
    let abuse;
    try {
        abuse = await enforceAbuse(env, identity, ipHash, body.turnstileToken, ip);
    } catch (err) {
        // A rejected submission is still an observable event (the spike/anomaly
        // signal lives here as much as in successful creates).
        telemetry.commentCreated(postId, 'new', 'blocked');
        telemetry.event('block', {
            post_id: postId,
            did: identity.did,
            reason: err instanceof HttpError ? err.message : 'error',
        });
        throw err;
    }

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

    // Observability (#6): comment.created metric + an activity-log entry, both
    // non-blocking via ctx.waitUntil inside Telemetry.
    const trust = abuse.trusted ? 'trusted' : 'new';
    telemetry.commentCreated(postId, trust, 'allowed');
    telemetry.event('comment', { post_id: postId, comment_id: id, did: identity.did, parent_id: parentId });

    const row = await getComment(env.DB, id);
    return shape(row!);
}

interface EditBody {
    body?: string;
}

// PATCH /comments/:id  -> the updated comment. Author-only, within the edit
// window and under the edit cap. Prior versions are snapshotted to
// comment_revisions but never returned. Delete is the always-available escape
// hatch and is handled separately, so a closed window never traps content.
export async function handleEdit(
    request: Request,
    env: Env,
    id: string,
    body: EditBody,
    telemetry: Telemetry,
): Promise<unknown> {
    const identity = await getIdentity(request, env);
    if (!identity) throw new HttpError(401, 'sign in to edit');

    const row = await getComment(env.DB, id);
    if (!row || row.deleted_at != null) throw new HttpError(404, 'comment not found');
    if (identity.did !== row.author_did) throw new HttpError(403, 'you can only edit your own comment');

    const now = Date.now();
    if (now - row.created_at > EDIT_WINDOW_MS) throw new HttpError(403, 'the edit window for this comment has closed - you can still delete it');
    if (row.edit_count >= MAX_EDITS) throw new HttpError(429, `edit limit reached (${MAX_EDITS})`);

    const next = normalizeBody(body.body ?? '');
    if (!next) throw new HttpError(400, 'comment body required');
    if (next.length > MAX_BODY) throw new HttpError(400, `comment too long (max ${MAX_BODY} chars)`);
    if (next === row.body) return shape(row); // no-op, don't burn an edit

    await applyEdit(env.DB, id, row.body, next, row.edit_count, editMagnitude(row.body, next), now);
    telemetry.event('edit', { comment_id: id, post_id: row.post_id, did: identity.did, version: row.edit_count });

    const updated = await getComment(env.DB, id);
    return shape(updated!);
}

// DELETE /comments/:id[?hard=1]  ->  { ok }. Author or admin. Soft delete leaves
// a tombstone so reply chains survive; hard delete (?hard=1) removes the row
// entirely + its revisions, and is refused if the comment still has replies
// (that would orphan them). Hard delete also works on an existing tombstone.
export async function handleDelete(request: Request, env: Env, id: string, telemetry: Telemetry): Promise<unknown> {
    const identity = await getIdentity(request, env);
    if (!identity) throw new HttpError(401, 'sign in to delete');
    const hard = new URL(request.url).searchParams.get('hard') === '1';

    const row = await getComment(env.DB, id);
    if (!row) throw new HttpError(404, 'comment not found');
    if (!hard && row.deleted_at != null) throw new HttpError(404, 'comment not found');

    const isAuthor = identity.did === row.author_did;
    const isAdmin = await isAdminIdentity(env, identity);
    if (!isAuthor && !isAdmin) throw new HttpError(403, 'not allowed to delete this comment');

    if (hard) {
        if (await countChildren(env.DB, id)) {
            throw new HttpError(409, 'this comment has replies - it can only be deleted, not removed');
        }
        await hardDeleteComment(env.DB, id);
        telemetry.event('remove', { comment_id: id, post_id: row.post_id, by: identity.did });
        return { ok: true, removed: true };
    }

    await softDeleteComment(env.DB, id, Date.now());
    telemetry.event(isAdmin && !isAuthor ? 'admin_delete' : 'delete', {
        comment_id: id,
        post_id: row.post_id,
        by: identity.did,
    });
    return { ok: true };
}
