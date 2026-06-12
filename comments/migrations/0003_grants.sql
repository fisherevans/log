-- Auth pivot (Bluesky-everywhere): the DID-keyed authorization store.
--
-- This is the single source of truth that unifies authorization across the two
-- front doors - the edge (this Worker, for comments/moderation/future private
-- content) and the k3s admin apps (bloom/scribe, which read it via the login
-- app's grants-resolve endpoint). It is also the identity-linking bridge: the
-- same person is the same Bluesky DID across both front doors.
--
-- Two concerns, two tables (different cardinality):
--   principals  DID -> stable OIDC subject. One per DID. So a Bluesky login maps
--               to an existing app account (e.g. did:plc:... -> 'fisher'); bloom
--               keys accounts on this subject, never the raw DID.
--   grants      DID -> group membership (authorization). Many per DID. The apps'
--               `groups` claim + this Worker's admin gate read it.

CREATE TABLE principals (
    did        TEXT PRIMARY KEY,
    subject    TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE grants (
    did        TEXT NOT NULL,
    group_name TEXT NOT NULL,
    created_at INTEGER NOT NULL,
    PRIMARY KEY (did, group_name)
);

CREATE INDEX idx_grants_did ON grants (did);

-- Seed the v1 admin (Fisher). Replaces the hardcoded ADMIN_DID gate; same groups
-- the login app's users.json grants today (admin, users).
INSERT INTO principals (did, subject, created_at)
VALUES ('did:plc:auevmn4wzowwhiuq6jo3ysl6', 'fisher', CAST(strftime('%s','now') AS INTEGER) * 1000);
INSERT INTO grants (did, group_name, created_at) VALUES
    ('did:plc:auevmn4wzowwhiuq6jo3ysl6', 'admin', CAST(strftime('%s','now') AS INTEGER) * 1000),
    ('did:plc:auevmn4wzowwhiuq6jo3ysl6', 'users', CAST(strftime('%s','now') AS INTEGER) * 1000);
