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

// ---- bans -------------------------------------------------------------------

export type BanSubject = 'did' | 'ip';

// True if either the DID or the ip_hash is on the ban list. ipHash may be null
// (no salt configured / no IP), in which case only the DID is checked.
export async function isBanned(db: D1Database, did: string, ipHash: string | null): Promise<boolean> {
    const row = await db
        .prepare(
            `SELECT 1 FROM bans
             WHERE (subject_type = 'did' AND subject = ?1)
                OR (subject_type = 'ip' AND ?2 IS NOT NULL AND subject = ?2)
             LIMIT 1`,
        )
        .bind(did, ipHash)
        .first<{ 1: number }>();
    return row != null;
}

export async function addBan(
    db: D1Database,
    type: BanSubject,
    subject: string,
    reason: string | null,
    when: number,
): Promise<void> {
    await db
        .prepare(
            `INSERT INTO bans (subject_type, subject, reason, created_at) VALUES (?, ?, ?, ?)
             ON CONFLICT(subject_type, subject) DO UPDATE SET reason = excluded.reason`,
        )
        .bind(type, subject, reason, when)
        .run();
}

export async function removeBan(db: D1Database, type: BanSubject, subject: string): Promise<void> {
    await db.prepare(`DELETE FROM bans WHERE subject_type = ? AND subject = ?`).bind(type, subject).run();
}

// ---- rate limiting + reputation --------------------------------------------

// Count a DID's comments since a cutoff (epoch ms). Includes deleted rows so
// delete-and-repost can't defeat the flood cap.
export async function countByDidSince(db: D1Database, did: string, since: number): Promise<number> {
    const row = await db
        .prepare(`SELECT COUNT(*) AS n FROM comments WHERE author_did = ? AND created_at >= ?`)
        .bind(did, since)
        .first<{ n: number }>();
    return row?.n ?? 0;
}

export async function countByIpSince(db: D1Database, ipHash: string, since: number): Promise<number> {
    const row = await db
        .prepare(`SELECT COUNT(*) AS n FROM comments WHERE ip_hash = ? AND created_at >= ?`)
        .bind(ipHash, since)
        .first<{ n: number }>();
    return row?.n ?? 0;
}

// A DID's lifetime comment count (including deleted), for progressive trust.
export async function lifetimeCountByDid(db: D1Database, did: string): Promise<number> {
    const row = await db
        .prepare(`SELECT COUNT(*) AS n FROM comments WHERE author_did = ?`)
        .bind(did)
        .first<{ n: number }>();
    return row?.n ?? 0;
}

export interface Reputation {
    author_did: string;
    first_seen_at: number;
    account_created_at: number | null;
}

export async function getReputation(db: D1Database, did: string): Promise<Reputation | null> {
    return await db.prepare(`SELECT * FROM did_reputation WHERE author_did = ?`).bind(did).first<Reputation>();
}

// Record a DID's first sighting (no-op if already present). accountCreatedAt is
// the Bluesky account age captured at login; backfilled if it arrives later.
export async function recordFirstSeen(
    db: D1Database,
    did: string,
    when: number,
    accountCreatedAt: number | null,
): Promise<void> {
    await db
        .prepare(
            `INSERT INTO did_reputation (author_did, first_seen_at, account_created_at) VALUES (?, ?, ?)
             ON CONFLICT(author_did) DO UPDATE SET
               account_created_at = COALESCE(excluded.account_created_at, did_reputation.account_created_at)`,
        )
        .bind(did, when, accountCreatedAt)
        .run();
}

// ---- subscribers (issue #7) -------------------------------------------------

// Add an email subscriber. Idempotent on the email (re-subscribing is a no-op).
// Returns true if a new row was inserted, false if the email was already present.
export async function addSubscriber(
    db: D1Database,
    email: string,
    when: number,
    ipHash: string | null,
): Promise<boolean> {
    const res = await db
        .prepare(
            `INSERT INTO subscribers (email, created_at, ip_hash) VALUES (?, ?, ?)
             ON CONFLICT(email) DO NOTHING`,
        )
        .bind(email, when, ipHash)
        .run();
    return (res.meta.changes ?? 0) > 0;
}
