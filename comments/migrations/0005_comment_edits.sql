-- Windowed edits + revision history (issue #15).
--
-- Editing is allowed only briefly after posting and a few times at most; every
-- prior version is kept. Per the resolved redaction concern, old versions are
-- NOT publicly viewable - the API exposes only a change-magnitude indicator
-- (edit_count + chars_changed). The full history lives here for the author/admin
-- and audit, never surfaced to readers.
ALTER TABLE comments ADD COLUMN edited_at INTEGER;
ALTER TABLE comments ADD COLUMN edit_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE comments ADD COLUMN chars_changed INTEGER NOT NULL DEFAULT 0;

-- One row per superseded version. version 0 = the original body, 1 = the text
-- after the first edit, etc. The current body always lives on comments.body, so
-- the complete history is these rows plus the live row.
CREATE TABLE comment_revisions (
    comment_id TEXT NOT NULL,
    version    INTEGER NOT NULL,
    body       TEXT NOT NULL,
    created_at INTEGER NOT NULL, -- when this version was superseded
    PRIMARY KEY (comment_id, version)
);
