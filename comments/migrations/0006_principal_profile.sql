-- Make the grant store authoritative for the identity claims the login app puts
-- into an ID token (email, name, groups) - #214.
--
-- Until now `groups` was resolved from here, decoded by the login app, and then
-- thrown away: the actual claims came from a `users.json` file baked into the
-- login pod's Secret, which contains exactly one user. The consequence was not
-- obvious and was undocumented - provisioning a second person with
-- `POST /admin/grants` produced a working *login* but a token with no groups, so
-- every downstream app rejected them. Adding a person meant editing a file,
-- rebuilding a Secret, and redeploying the login pod.
--
-- principals gains the two profile fields so a single store answers "who is this
-- and what may they do". users.json keeps exactly one job after this: the
-- argon2id hash for the ?recover=1 break-glass path, which must keep working when
-- this Worker is unreachable.

ALTER TABLE principals ADD COLUMN email TEXT;
ALTER TABLE principals ADD COLUMN name  TEXT;

-- The login app resolves claims by SUBJECT at consent time (it does not have the
-- DID there), so subject needs to be searchable. Not UNIQUE: two identities
-- mapping to one subject is the account-linking case, which is a deliberate
-- future direction rather than something to forbid now.
CREATE INDEX IF NOT EXISTS idx_principals_subject ON principals (subject);

-- Seed the existing admin's profile from what users.json has today, so the switch
-- to grant-store claims is a no-op for Fisher rather than a silent loss of his
-- email/name claims.
UPDATE principals
   SET email = 'fisher@fisherevans.com',
       name  = 'Fisher Evans'
 WHERE subject = 'fisher';
