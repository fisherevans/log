-- Bluesky OAuth + Worker sessions (issue #3).

-- A logged-in commenter's Worker session, keyed by an opaque token held in an
-- httpOnly cookie. Holds the captured Bluesky identity so comment create doesn't
-- need to re-resolve it. Expires; expired rows are ignored and swept lazily.
CREATE TABLE sessions (
    token              TEXT PRIMARY KEY,
    did                TEXT NOT NULL,
    handle             TEXT,
    display_name       TEXT,
    avatar             TEXT,
    account_created_at INTEGER,            -- Bluesky account age, for progressive trust
    created_at         INTEGER NOT NULL,
    expires_at         INTEGER NOT NULL
);

CREATE INDEX idx_sessions_expires ON sessions (expires_at);

-- Backing stores for @atproto/oauth-client-node. Generic key/value: the OAuth
-- state store (keyed by the PKCE/PAR state) and the OAuth session store (keyed by
-- DID, holding DPoP-bound tokens). value is opaque JSON managed by the library.
CREATE TABLE oauth_state (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    created_at INTEGER NOT NULL
);

CREATE TABLE oauth_session (
    key        TEXT PRIMARY KEY,
    value      TEXT NOT NULL,
    created_at INTEGER NOT NULL
);
