# log-comments

The comments + email-subscribe backend for [log.fisher.sh](https://log.fisher.sh).
A single Cloudflare Worker over a D1 (SQLite) database.

- Comments are **owned here in D1**, not Bluesky-hosted. Bluesky OAuth is the
  identity layer only - no posting to Bluesky, no write scope.
- The blog renders a **native in-page** comments UI that calls this Worker's JSON
  API client-side. No iframe/embed.
- Comments key on each post's stable frontmatter `id` (see the blog's
  `src/content.config.ts`), never the slug, so a thread survives a rename or URL
  change.

This is the **source**. Deploy state (make targets, secrets, D1 provisioning,
DNS) lives in the sibling `nottingham-cloud` repo - see
`systems/cloudflare.md` there.

## Layout

```
comments/
  wrangler.toml      # non-secret config (D1 binding, vars, route)
  migrations/        # D1 schema migrations (wrangler d1 migrations)
  src/
    index.ts         # router (hand-rolled switch)
    comments.ts      # list / create / delete handlers
    db.ts            # typed D1 queries
    identity.ts      # commenter identity (Bluesky OAuth session; dev seam)
    http.ts          # JSON + CORS + error helpers
    ids.ts           # stable id minting
    env.ts           # Env bindings type
  test/              # vitest-pool-workers suite (runs against local D1)
```

## API surface

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/comments?post_id=...` | public | list a post's thread (incl. edit indicators) |
| POST | `/comments` | session | create a comment |
| PATCH | `/comments/:id` | author | edit, within 24h + 3-edit cap (#15) |
| DELETE | `/comments/:id` | author or admin | delete a comment (soft) |
| GET | `/oauth/me` | public | session + `isAdmin` flag |
| GET | `/admin/status?post_id=` | admin | per-post + global comment switches |
| POST | `/admin/ban` | admin | ban a DID/IP (`days` = temp ban) |
| POST | `/admin/unban` | admin | lift a ban |
| POST | `/admin/global` / `/admin/posts/:id` | admin | toggle comments |
| GET | `/health` | public | liveness |

Identity (Bluesky OAuth), abuse controls + moderation, DataDog observability, and
the email-subscribe endpoint mount additional routes here as their issues land
(#3, #4, #6, #7). The Comments UX v2 milestone added safe markdown rendering +
link-safety (client), a per-comment actions menu + permalinks, in-UI admin
moderation + temp bans, windowed edits with DB-only revision history (only a
change-magnitude indicator is exposed), and load-more + deep-nesting drill-in.

## Local development

`wrangler dev` runs the Worker against a local miniflare D1 - no Cloudflare
account or auth needed.

```
npm install
npm run migrate:local      # apply migrations/ to the local D1
npm run dev                # wrangler dev on http://localhost:8787
```

Put local secrets in `comments/.dev.vars` (gitignored). To exercise the
authenticated paths before the Bluesky OAuth flow exists, set `DEV_AUTH=1` there
and inject an identity via headers:

```
# .dev.vars
DEV_AUTH = "1"
IP_HASH_SALT = "local-dev-salt"
```

```
curl -X POST http://localhost:8787/comments \
  -H 'content-type: application/json' \
  -H 'x-dev-did: did:plc:alice' -H 'x-dev-handle: alice.test' \
  -d '{"postId":"InTq4USBbA","body":"hello"}'
```

`DEV_AUTH` is honored only when explicitly set; it is never enabled in
production.

## Tests

```
npm test          # vitest-pool-workers, against a fresh local D1 with migrations applied
npm run typecheck # tsc --noEmit
```

## Bluesky OAuth (identity only)

`atproto.ts` runs the ATProto OAuth dance (handle resolution -> PDS discovery ->
PAR -> DPoP-bound tokens) via `@atproto/oauth-client-node`, used purely for
identity - no posting, no write scope. On a successful callback it captures the
DID + profile, mints a Worker session (`session.ts`), and redirects back to the
blog. Comment create then reads the session cookie.

Endpoints:

| Path | Purpose |
| --- | --- |
| `GET /oauth/client-metadata.json` | OAuth client metadata (this is the `client_id`) |
| `GET /oauth/jwks.json` | public JWKS for `private_key_jwt` |
| `GET /oauth/login?handle=...` | start login; 302 to the user's auth server |
| `GET /oauth/callback` | finish login; mints the session, 302 back to the blog |
| `GET /oauth/me` | current identity, for the UI's signed-in state |
| `POST /oauth/logout` | clear the session |

Config: `OAUTH_PRIVATE_KEY` is an ES256 private JWK (JSON). Generate a keypair,
keep the private JWK in Bitwarden (`comments-oauth-private-key`), and the Worker
serves the matching public JWK at `/oauth/jwks.json`.

> **Unverified locally.** The OAuth dance needs a public callback URL and a real
> Bluesky login, so the local test suite does not exercise it (the library is
> dynamically imported so it never loads in tests). The session/identity layer it
> feeds *is* tested end to end. Verify the full flow after the first deploy; the
> ATProto-on-Workers runtime (`nodejs_compat`) is the most likely spot to need a
> tweak.

## Observability (DataDog)

The Worker ships to DataDog's HTTP intake via `ctx.waitUntil` (non-blocking,
best-effort, no-op when `DATADOG_API_KEY` is unset). The org is on **US5** -
override with the `DATADOG_SITE` var if that changes.

- **Metric** `comment.created` (count), tagged `post:<id>`, `trust:new|trusted`,
  `result:allowed|blocked`. Emitted on every create attempt, including blocked
  ones, so the rate is the spike/anomaly signal.
- **Logs** - one structured event per action (`comment`, `block`, `delete`,
  `admin_delete`, `ban`, `unban`, `toggle_post`, `toggle_global`) to the logs
  intake. This is the durable audit trail.

**DataDog-side (config, not code):** create a monitor on the `comment.created`
rate - an anomaly or threshold alert (e.g. sum > N over 5m) routed to the
existing Discord webhook. This is provisioned in the DataDog org (or
`nottingham-cloud terraform/datadog`), not from this repo.

## Deploy

Driven from `nottingham-cloud` (`make *-comments-worker`), not from here. See
`systems/cloudflare.md` in that repo for the runbook.

**Prep gate:** the shared `cloudflare-api-token` needs `Workers Scripts: Edit` +
`D1: Edit` scopes added before any `wrangler deploy` / `wrangler d1` call works.

Secrets (`IP_HASH_SALT`, `TURNSTILE_SECRET`, `DATADOG_API_KEY`,
`OAUTH_PRIVATE_KEY`, `LOGIN_GRANTS_TOKEN`, and the optional `DISCORD_WEBHOOK_URL`
for new-comment pings) are pushed via `wrangler secret put` from the deploy
target - never in `wrangler.toml` or git. After `wrangler d1 create log-comments`, paste
the printed `database_id` into `wrangler.toml`.

## Local UX sandbox

Play with the full comment UX in a browser without touching production or the
live blog. Bluesky OAuth can't redirect to localhost, so a DEV-only login shim
mints a session instead (gated on `DEV_AUTH=1`, 404 in prod).

```sh
# 1. Worker: local D1 + dev auth (comments/.dev.vars sets DEV_AUTH=1,
#    ALLOWED_ORIGIN=http://localhost:4321, IP_HASH_SALT)
cd comments && npx wrangler d1 migrations apply log-comments --local
npx wrangler dev --port 8787 --local

# 2. Blog: point it at the local Worker, disable Turnstile
cd .. && PUBLIC_COMMENTS_API_URL=http://localhost:8787 PUBLIC_TURNSTILE_SITEKEY= npm run dev

# 3. Log in (one-time, sets the session cookie as ADMIN_DID/fisher.sh):
#    open http://localhost:8787/oauth/dev-login   (redirects to the blog)
#    then visit any post and comment. ?did=&handle= override the dev identity.
```

The local D1 is ephemeral miniflare state; reset it by deleting `.wrangler/state`.
