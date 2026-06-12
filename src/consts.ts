// Global site constants. Imported anywhere site identity is needed.

export const SITE_TITLE = "log.fisher.sh";
export const SITE_DESCRIPTION = "Welcome to a public diary of Fisher's projects. Enjoy.";
export const SITE_URL = "https://log.fisher.sh";
export const MEDIA_URL = "https://media.fisher.sh";

// Author info used in RSS + per-post bylines if you want them.
export const AUTHOR_NAME = "Fisher Evans";
export const AUTHOR_EMAIL = "fisher@fisherevans.com";

// Bluesky identity. Domain handle (verified via DNS), used for the follow link
// and as the identity layer for comments.
export const BLUESKY_HANDLE = "fisher.sh";
export const BLUESKY_PROFILE_URL = `https://bsky.app/profile/${BLUESKY_HANDLE}`;

// Comments + subscribe backend (the Cloudflare Worker; source in /comments).
// The native UI calls this origin client-side. TURNSTILE_SITEKEY is the public
// Turnstile key - leave empty until it's minted; the widget is then omitted and
// the Worker (which only enforces when its secret is set) still accepts requests.
//
// Both are overridable via PUBLIC_* env at build/dev time, so a local sandbox can
// point at a `wrangler dev` Worker (PUBLIC_COMMENTS_API_URL=http://localhost:8787)
// and disable Turnstile (PUBLIC_TURNSTILE_SITEKEY=""). `??` only falls back when
// the var is unset, so an explicit empty string disables the widget.
export const COMMENTS_API_URL = import.meta.env.PUBLIC_COMMENTS_API_URL ?? "https://comments.fisher.sh";
export const TURNSTILE_SITEKEY = import.meta.env.PUBLIC_TURNSTILE_SITEKEY ?? "0x4AAAAAADjdWj1G2urGdLYq";

// External links surfaced in the footer (single source of truth - add/remove here).
export const SOCIAL_LINKS = [
    { label: "fisher.sh", href: "https://fisher.sh" },
    { label: "bluesky", href: BLUESKY_PROFILE_URL },
    { label: "github", href: "https://github.com/fisherevans" },
    { label: "rss", href: "/rss.xml" },
];
