-- Initial schema for the log.fisher.sh comments backend.
--
-- Comments are keyed by post_id = the post's stable frontmatter `id` (see the
-- blog repo's src/content.config.ts), never the slug, so a thread survives a
-- rename/URL change. Times are epoch milliseconds (INTEGER). IPs are stored only
-- as a salted hash, never raw.

-- A single comment. parent_id threads replies (NULL = top level). A deleted
-- comment keeps its row (deleted_at set) so reply chains and rate/reputation
-- counts stay intact; the body is blanked on delete by the application.
CREATE TABLE comments (
    id                  TEXT PRIMARY KEY,        -- the comment's own id (minted)
    post_id             TEXT NOT NULL,           -- the post's stable frontmatter id
    parent_id           TEXT,                    -- parent comment id, or NULL
    author_did          TEXT NOT NULL,
    author_handle       TEXT,
    author_display_name TEXT,
    author_avatar       TEXT,
    body                TEXT NOT NULL,
    created_at          INTEGER NOT NULL,
    deleted_at          INTEGER,                 -- soft delete; NULL = live
    ip_hash             TEXT                     -- salted hash of the submitter IP
);

CREATE INDEX idx_comments_post ON comments (post_id, created_at);
CREATE INDEX idx_comments_did  ON comments (author_did, created_at);
CREATE INDEX idx_comments_ip   ON comments (ip_hash, created_at);

-- Ban list. subject_type is 'did' or 'ip'; subject is the DID or the salted
-- ip_hash. Checked on every create.
CREATE TABLE bans (
    subject_type TEXT NOT NULL,                  -- 'did' | 'ip'
    subject      TEXT NOT NULL,                  -- the DID or ip_hash
    reason       TEXT,
    created_at   INTEGER NOT NULL,
    PRIMARY KEY (subject_type, subject)
);

-- Per-post kill switch. Absent row = enabled (default). A row with
-- comments_enabled = 0 disables comments for that post.
CREATE TABLE post_settings (
    post_id          TEXT PRIMARY KEY,
    comments_enabled INTEGER NOT NULL DEFAULT 1
);

-- Global key/value settings. Holds the global kill switch under key
-- 'comments_enabled' ('1' | '0'); absent = enabled.
CREATE TABLE settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

-- Per-DID reputation, for progressive trust. first_seen_at is when the DID first
-- commented on the site; account_created_at is the Bluesky account age captured
-- at login (may be NULL if unavailable). Lifetime comment count is computed from
-- the comments table, not stored here, so deletes still count against flood caps.
CREATE TABLE did_reputation (
    author_did         TEXT PRIMARY KEY,
    first_seen_at      INTEGER NOT NULL,
    account_created_at INTEGER
);

-- Email subscribers (native intake form, issue #7). Buttondown deferred; this is
-- the interim own-store, exported manually later.
CREATE TABLE subscribers (
    email      TEXT PRIMARY KEY,
    created_at INTEGER NOT NULL,
    ip_hash    TEXT
);
