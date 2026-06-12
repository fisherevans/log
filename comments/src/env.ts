// Worker bindings + config. Non-secret vars come from wrangler.toml [vars];
// secrets are pushed via `wrangler secret put` from the nottingham-cloud deploy
// target and are optional at the type level so the Worker boots without them in
// local dev. See README.md for the full secret list.
export interface Env {
    DB: D1Database;

    // Non-secret config (wrangler.toml).
    ALLOWED_ORIGIN: string; // blog origin allowed to call this API
    PUBLIC_URL: string; // this Worker's public base URL
    ADMIN_DID: string; // Fisher's DID - the v1 admin

    // Secrets (wrangler secret put). Optional so dev runs without them.
    IP_HASH_SALT?: string; // salt for hashing submitter IPs
    TURNSTILE_SECRET?: string; // Cloudflare Turnstile secret key
    DATADOG_API_KEY?: string; // DataDog HTTP intake key
    DATADOG_SITE?: string; // DataDog site (default us5.datadoghq.com)
    OAUTH_PRIVATE_KEY?: string; // ATProto OAuth client private JWK (JSON)

    // Local-dev only. When "1", identity can be injected via headers (see
    // identity.ts). Never set in production.
    DEV_AUTH?: string;
}
