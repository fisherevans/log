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

// External links surfaced in the footer (single source of truth - add/remove here).
export const SOCIAL_LINKS = [
    { label: "fisher.sh", href: "https://fisher.sh" },
    { label: "bluesky", href: BLUESKY_PROFILE_URL },
    { label: "github", href: "https://github.com/fisherevans" },
    { label: "rss", href: "/rss.xml" },
];
