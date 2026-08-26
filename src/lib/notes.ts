import type { CollectionEntry } from 'astro:content';

// Notes are the small sibling of posts: dated, short, often photo-first, and
// deliberately TITLELESS (see the schema comment in content.config.ts). That
// one decision drives everything here - anything that would normally read
// `data.title` has to derive display text from the body instead.
//
// URL shape mirrors posts so the two read as one site:
//   /notes/2023/05/18/<slug>
// The slug is the content file id (filename); the date comes from frontmatter
// and is read in UTC so it never drifts a day under a local timezone.

function datePath(date: Date): string {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, '0');
    const d = String(date.getUTCDate()).padStart(2, '0');
    return `${y}/${m}/${d}`;
}

// Path after /notes/ : "YYYY/MM/DD/<slug>". Used as the catch-all route param.
export function noteSlug(note: CollectionEntry<'notes'>): string {
    return `${datePath(note.data.date)}/${note.id}`;
}

// Full site-relative href, trailing slash.
export function noteHref(note: CollectionEntry<'notes'>): string {
    return `/notes/${noteSlug(note)}/`;
}

// Strip the markdown that would look wrong in a plain-text context (a <title>,
// an RSS entry title, a list preview). Intentionally shallow - this is for
// short note bodies, not full posts, so it doesn't try to be a real parser.
function stripMarkdown(md: string): string {
    return md
        .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // images -> nothing
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> their text
        .replace(/^>\s*/gm, '') // blockquote markers
        .replace(/^[-*+]\s+/gm, '') // list bullets
        .replace(/^#{1,6}\s+/gm, '') // headings
        .replace(/[*_`~]/g, '') // emphasis / code marks
        .replace(/\s+/g, ' ')
        .trim();
}

// Notes have no title, but the browser tab, the RSS entry and the tag listing
// all need SOME text. Derive it from the first sentence-ish of the body and cap
// it, falling back to the date when a note is pure media.
export function noteTitle(note: CollectionEntry<'notes'>, max = 72): string {
    const text = stripMarkdown(note.body ?? '');
    if (!text) {
        return `Note · ${note.data.date.toISOString().slice(0, 10)}`;
    }
    // Prefer cutting at a sentence end, else at the last whole word.
    const sentence = text.match(/^.{20,}?[.!?](\s|$)/);
    const candidate = sentence ? sentence[0].trim() : text;
    if (candidate.length <= max) return candidate;
    const cut = candidate.slice(0, max);
    const lastSpace = cut.lastIndexOf(' ');
    return `${(lastSpace > 20 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`;
}

// The image a grid/gallery view should show for this note, if any.
export function noteCover(note: CollectionEntry<'notes'>) {
    return note.data.images[0] ?? null;
}

// Posts and notes interleaved, newest first. This is the shared timeline that
// /tags/<tag>/ and a project's page both render. The `kind` discriminator is
// what the client-side All/Posts/Notes filter keys off.
export type TimelineEntry =
    | { kind: 'post'; date: Date; entry: CollectionEntry<'posts'> }
    | { kind: 'note'; date: Date; entry: CollectionEntry<'notes'> };

export function buildTimeline(
    posts: CollectionEntry<'posts'>[],
    notes: CollectionEntry<'notes'>[],
): TimelineEntry[] {
    const entries: TimelineEntry[] = [
        ...posts.map((p) => ({ kind: 'post' as const, date: p.data.date, entry: p })),
        ...notes.map((n) => ({ kind: 'note' as const, date: n.data.date, entry: n })),
    ];
    return entries.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}
