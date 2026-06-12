// D1 data access for comments. Thin typed wrappers over prepared statements -
// no ORM. Each function takes the D1Database binding directly.

export interface CommentRow {
    id: string;
    post_id: string;
    parent_id: string | null;
    author_did: string;
    author_handle: string | null;
    author_display_name: string | null;
    author_avatar: string | null;
    body: string;
    created_at: number;
    deleted_at: number | null;
    ip_hash: string | null;
}

export interface NewComment {
    id: string;
    postId: string;
    parentId: string | null;
    authorDid: string;
    authorHandle: string | null;
    authorDisplayName: string | null;
    authorAvatar: string | null;
    body: string;
    createdAt: number;
    ipHash: string | null;
}

// List a post's comments oldest-first. Deleted rows are included (the UI renders
// a tombstone) so reply chains don't lose their parents.
export async function listComments(db: D1Database, postId: string): Promise<CommentRow[]> {
    const { results } = await db
        .prepare(
            `SELECT id, post_id, parent_id, author_did, author_handle, author_display_name,
                    author_avatar, body, created_at, deleted_at, ip_hash
             FROM comments WHERE post_id = ? ORDER BY created_at ASC`,
        )
        .bind(postId)
        .all<CommentRow>();
    return results ?? [];
}

export async function getComment(db: D1Database, id: string): Promise<CommentRow | null> {
    return await db
        .prepare(`SELECT * FROM comments WHERE id = ?`)
        .bind(id)
        .first<CommentRow>();
}

export async function insertComment(db: D1Database, c: NewComment): Promise<void> {
    await db
        .prepare(
            `INSERT INTO comments
                (id, post_id, parent_id, author_did, author_handle, author_display_name,
                 author_avatar, body, created_at, deleted_at, ip_hash)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?)`,
        )
        .bind(
            c.id,
            c.postId,
            c.parentId,
            c.authorDid,
            c.authorHandle,
            c.authorDisplayName,
            c.authorAvatar,
            c.body,
            c.createdAt,
            c.ipHash,
        )
        .run();
}

// Soft delete: blank the body and stamp deleted_at, keeping the row so reply
// chains and rate/reputation counts are preserved.
export async function softDeleteComment(db: D1Database, id: string, when: number): Promise<void> {
    await db
        .prepare(`UPDATE comments SET deleted_at = ?, body = '' WHERE id = ? AND deleted_at IS NULL`)
        .bind(when, id)
        .run();
}

// ---- kill switches ----------------------------------------------------------

// Comments are enabled unless the global switch or the per-post switch is off.
export async function commentsEnabled(db: D1Database, postId: string): Promise<boolean> {
    const global = await db
        .prepare(`SELECT value FROM settings WHERE key = 'comments_enabled'`)
        .first<{ value: string }>();
    if (global && global.value === '0') return false;

    const post = await db
        .prepare(`SELECT comments_enabled FROM post_settings WHERE post_id = ?`)
        .bind(postId)
        .first<{ comments_enabled: number }>();
    if (post && post.comments_enabled === 0) return false;

    return true;
}

export async function setGlobalEnabled(db: D1Database, enabled: boolean): Promise<void> {
    await db
        .prepare(
            `INSERT INTO settings (key, value) VALUES ('comments_enabled', ?)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        )
        .bind(enabled ? '1' : '0')
        .run();
}

export async function setPostEnabled(db: D1Database, postId: string, enabled: boolean): Promise<void> {
    await db
        .prepare(
            `INSERT INTO post_settings (post_id, comments_enabled) VALUES (?, ?)
             ON CONFLICT(post_id) DO UPDATE SET comments_enabled = excluded.comments_enabled`,
        )
        .bind(postId, enabled ? 1 : 0)
        .run();
}
