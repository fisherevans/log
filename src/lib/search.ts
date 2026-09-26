import type { StreamItem } from './stream';
import { noteTitle } from './notes';

// Titles for search rows and the dev fallback. A note has no title, so its
// display text is derived from its body (or its embed's title, for the split
// notes that are one video and no prose).
export function itemTitle(item: StreamItem): string {
    return item.kind === 'post' ? item.entry.data.title : noteTitle(item.entry, 90);
}

export const fmtDate = (d: Date) =>
    d.toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' });

export function searchIndex(items: StreamItem[]) {
    return items.map((i) => ({
        title: itemTitle(i),
        href: i.href,
        date: fmtDate(i.date),
        tags: i.entry.data.tags ?? [],
        description: i.kind === 'post' ? (i.entry.data.description ?? '') : '',
    }));
}

export function dateMap(items: StreamItem[]) {
    return Object.fromEntries(items.map((i) => [i.href, fmtDate(i.date)]));
}
