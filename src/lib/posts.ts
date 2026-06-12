import type { CollectionEntry } from 'astro:content';

// Post URLs embed the publish date as folders so the path is human-scannable:
//   /posts/2026/06/01/<slug>
// The slug is the content file id (filename). The date comes from frontmatter
// and is read in UTC so a `date: 2026-06-01` never drifts a day under a local
// timezone. Slug-rename / redirect handling is deliberately not solved here yet.

function datePath(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
}

// Path after /posts/ : "YYYY/MM/DD/<slug>". Used as the catch-all route param.
export function postSlug(post: CollectionEntry<'posts'>): string {
    return `${datePath(post.data.date)}/${post.id}`;
}

// Full site-relative href, trailing slash.
export function postHref(post: CollectionEntry<'posts'>): string {
    return `/posts/${postSlug(post)}/`;
}

// The landing page features the latest post's first EXCERPT_BLOCKS top-level
// content blocks, then "Continue reading" jumps into the next block. This count
// is shared by the landing CSS (which hides later blocks) and the post page
// (which flashes block index EXCERPT_BLOCKS on a #continue load) so the cut and
// the jump target line up. Keep them in sync if this changes.
export const EXCERPT_BLOCKS = 3;

// Rough check (markdown block count) for whether the excerpt actually truncates
// the post - used to decide whether to show "Continue reading".
export function hasMoreThanExcerpt(post: CollectionEntry<'posts'>): boolean {
    return post.body != null && post.body.trim().split(/\n{2,}/).filter(Boolean).length > EXCERPT_BLOCKS;
}
