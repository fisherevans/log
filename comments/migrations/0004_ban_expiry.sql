-- Temp bans (issue #14). A ban can now expire: expires_at is the epoch-ms after
-- which the ban no longer applies. NULL = permanent (the existing behavior, so
-- this is backward-compatible for every existing row). isBanned() filters on it.
ALTER TABLE bans ADD COLUMN expires_at INTEGER;
