import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { noteHref } from './notes';
import { postHref } from './posts';

// The stream is the site's only listing: posts and notes interleaved by date.
// /posts is it; there is no separate /notes index (notes keep their permalinks,
// because comments live there). See the notes-rollout changelog entry.

export type StreamItem =
    | { kind: 'post'; date: Date; year: number; href: string; entry: CollectionEntry<'posts'> }
    | { kind: 'note'; date: Date; year: number; href: string; entry: CollectionEntry<'notes'> };

export async function buildStream(): Promise<StreamItem[]> {
    const posts = await getCollection('posts', ({ data }) => !data.draft);
    const notes = await getCollection('notes', ({ data }) => !data.draft);
    const items: StreamItem[] = [
        ...posts.map((entry) => ({
            kind: 'post' as const,
            date: entry.data.date,
            year: entry.data.date.getUTCFullYear(),
            href: postHref(entry),
            entry,
        })),
        ...notes.map((entry) => ({
            kind: 'note' as const,
            date: entry.data.date,
            year: entry.data.date.getUTCFullYear(),
            href: noteHref(entry),
            entry,
        })),
    ];
    return items.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

// Years present in the stream, newest first - the rail's contents.
export function yearsOf(items: StreamItem[]): number[] {
    return [...new Set(items.map((i) => i.year))].sort((a, b) => b - a);
}

// A page is PAGE_SIZE *blocks*, not items: a burst counts once however many
// notes it folds, so a run of fifty dyes does not become three pages of dyes.
export const PAGE_SIZE = 20;

// ---- bursts --------------------------------------------------------------
// A run of notes about one thing in quick succession is a burst. The stream
// shows the newest BURST_LEAD of them as normal entries and folds the rest
// behind one card ("N more notes tagged disc-dyes"), so a backported devlog or
// a week of dye photos reads as one beat instead of drowning everything around
// it. Posts never fold and always break a run; the tag page never folds at all
// (that is where you go to see the whole run).
export const BURST_MIN = 4; // fewer than this and folding hides more than it saves
export const BURST_LEAD = 2;
export const BURST_GAP_DAYS = 14;

export type StreamBlock =
    | { kind: 'entry'; item: StreamItem }
    | { kind: 'burst'; tag: string; lead: StreamItem[]; rest: StreamItem[] };

// The tag a note is "about": a project tag wins, otherwise its first tag.
export function burstTag(item: StreamItem): string | undefined {
    if (item.kind !== 'note') return undefined;
    const tags = item.entry.data.tags ?? [];
    return tags.find((t) => t.startsWith('project:')) ?? tags[0];
}

export function groupBursts(items: StreamItem[]): StreamBlock[] {
    const gap = BURST_GAP_DAYS * 86_400_000;
    const blocks: StreamBlock[] = [];
    let i = 0;
    while (i < items.length) {
        const tag = burstTag(items[i]);
        let j = i + 1;
        if (tag) {
            while (j < items.length && burstTag(items[j]) === tag && items[j - 1].date.valueOf() - items[j].date.valueOf() <= gap) j++;
        }
        if (tag && j - i >= BURST_MIN) {
            const run = items.slice(i, j);
            blocks.push({ kind: 'burst', tag, lead: run.slice(0, BURST_LEAD), rest: run.slice(BURST_LEAD) });
        } else {
            blocks.push({ kind: 'entry', item: items[i] });
            j = i + 1;
        }
        i = j;
    }
    return blocks;
}

// The /posts page an entry is on, with its anchor - the fallback for a
// permalink's back link when there is no remembered stream to return to (a
// shared URL, a search hit). Page 1 is /posts/, the rest /posts/page/N/.
export function hrefInStream(blocks: StreamBlock[], entryId: string): string {
    const idx = blocks.findIndex((b) =>
        b.kind === 'entry' ? b.item.entry.id === entryId : [...b.lead, ...b.rest].some((i) => i.entry.id === entryId),
    );
    if (idx < 0) return '/posts/';
    const n = Math.floor(idx / PAGE_SIZE) + 1;
    return `${n === 1 ? '/posts/' : `/posts/page/${n}/`}#e-${entryId}`;
}

export function blockSize(b: StreamBlock): number {
    return b.kind === 'entry' ? 1 : b.lead.length + b.rest.length;
}

// Slice page n (1-based) out of the blocks, plus how many items precede it
// (for the pager's "21-40 of 96" range).
export function pageOf(blocks: StreamBlock[], n: number): { blocks: StreamBlock[]; offset: number; count: number } {
    const page = blocks.slice((n - 1) * PAGE_SIZE, n * PAGE_SIZE);
    const offset = blocks.slice(0, (n - 1) * PAGE_SIZE).reduce((s, b) => s + blockSize(b), 0);
    return { blocks: page, offset, count: page.reduce((s, b) => s + blockSize(b), 0) };
}
