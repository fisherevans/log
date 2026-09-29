import { getCollection } from 'astro:content';

// One rule for how a tag is written on the page: the metadata name if there is
// one, otherwise the slug made readable. Slugs are for URLs; nothing a reader
// sees should be `disc-golf` next to "Disc Dyes". A project tag (`project:x`)
// shows as the project's name - the prefix is structure, not a word.
const ACRONYMS: Record<string, string> = {
    ui: 'UI', ux: 'UX', gba: 'GBA', lrk: 'LRK', '3d': '3D', '2d': '2D', ai: 'AI', api: 'API', css: 'CSS', js: 'JS',
    rpg: 'RPG', gif: 'GIF', gfx: 'GFX', opengl: 'OpenGL', github: 'GitHub', youtube: 'YouTube',
};

export function humanize(tag: string): string {
    const slug = tag.includes(':') ? tag.slice(tag.indexOf(':') + 1) : tag;
    return slug
        .split('-')
        .filter(Boolean)
        .map((w) => ACRONYMS[w] ?? w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
}

export type TagLink = { label: string; url: string };
export type TagMeta = { name: string; description?: string; links: TagLink[] };

// Metadata files cannot carry a colon in their name, so `project:lrk` lives in
// `project-lrk.yaml`; index by both spellings.
let cache: Map<string, TagMeta> | null = null;
export async function tagMeta(): Promise<Map<string, TagMeta>> {
    if (cache) return cache;
    const all = await getCollection('tags');
    cache = new Map();
    for (const t of all) {
        const meta: TagMeta = { name: t.data.name, description: t.data.description, links: t.data.links ?? [] };
        cache.set(t.id, meta);
        cache.set(t.id.replace(/^project-/, 'project:'), meta);
    }
    return cache;
}

export function tagName(tag: string, meta?: Map<string, TagMeta>): string {
    const m = meta?.get(tag);
    if (m?.name) return m.name.replace(/^Project:\s*/i, '');
    return humanize(tag);
}

export const isProjectTag = (tag: string) => tag.startsWith('project:');
