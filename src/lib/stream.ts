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

export const PAGE_SIZE = 20;
