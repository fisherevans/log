import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Posts collection. Markdown + MDX files in src/content/posts/.
//
// Required: title, date.
// Optional: id, description, tags (for /tags/<tag>/), hasVideo, heroImage, updatedDate.
// draft: true keeps a post out of listings + RSS.
//
// `id` is a stable, immutable per-post identifier (nanoid-style, ~10 chars) that
// comments key on, so threads survive slug/URL/domain changes. It's invisible -
// frontmatter + comment-DB key only, never in the URL (the URL stays date/slug,
// see src/lib/posts.ts). Optional in the schema so an in-progress draft still
// builds; Scribe mints one on save and every published post is backfilled. NOTE:
// this is `data.id`, distinct from the glob loader's entry `id` (the filename
// slug used for the URL) - the loader keys the entry id off the file path / a
// `slug` field, not a `data.id` field, so adding this does not change any URL.
const posts = defineCollection({
    loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
    schema: ({ image }) =>
        z
            .object({
                id: z.string().optional(),
                title: z.string(),
                description: z.string().optional(),
                date: z.coerce.date(),
                updatedDate: z.coerce.date().optional(),
                heroImage: z.optional(image()),
                tags: z.array(z.string()).default([]),
                hasVideo: z.boolean().default(false),
                draft: z.boolean().default(false),
            })
            // A published post must carry a stable `id` - comments key on it, so a
            // post without one silently renders no comment section. Scribe mints one
            // on save (v0.3.1+); this fails the build if an id-less post ever ships
            // via any path (a draft is exempt - it isn't public yet).
            .refine((data) => data.draft || (typeof data.id === 'string' && data.id.trim().length > 0), {
                message: 'Published post is missing a stable `id` (comments key on it). Add an `id` or set draft: true.',
                path: ['id'],
            }),
});

// Notes collection. Short, dated entries in src/content/notes/.
//
// A note is deliberately SMALLER than a post: no title, no description, no
// hero. The whole point is a unit of writing with a low enough bar that it
// actually gets written - a dyed disc, a devlog beat, a build photo. Requiring
// a title is what turns "here's a thing I made" into "I must write an essay",
// so `title` is absent from this schema on purpose. Don't add it back.
//
// Display text (list previews, <title>, RSS) is DERIVED from the body - see
// src/lib/notes.ts noteTitle(). The URL comes from the filename + date, same
// shape as posts: /notes/YYYY/MM/DD/<slug>.
//
// `tags` is shared with posts, which is what makes /tags/<tag>/ able to show
// both interleaved. Namespaced `project:<slug>` tags are the join key across
// posts, notes, and projects.fisher.sh entries.
//
// `images` are media.fisher.sh URLs (the bot's `!upload` / scribe's External
// CDN path), NOT Astro image() assets - notes are photo-first and their media
// lives in R2, not the repo.
const notes = defineCollection({
    loader: glob({ base: './src/content/notes', pattern: '**/*.{md,mdx}' }),
    schema: z
        .object({
            id: z.string().optional(),
            date: z.coerce.date(),
            tags: z.array(z.string()).default([]),
            images: z
                .array(
                    z.object({
                        src: z.string(),
                        alt: z.string().optional(),
                    }),
                )
                .default([]),
            draft: z.boolean().default(false),
        })
        // Same contract as posts: a published entry needs a stable `id` because
        // comments key on it. Scribe mints one on save.
        .refine((data) => data.draft || (typeof data.id === 'string' && data.id.trim().length > 0), {
            message: 'Published note is missing a stable `id` (comments key on it). Add an `id` or set draft: true.',
            path: ['id'],
        }),
});

// Tags collection. YAML files in src/content/tags/.
// Each file provides optional name + description metadata for a tag slug.
// Content Layer: the glob loader determines the collection kind - do NOT also
// set `type` (that's the legacy API and fails the build under Astro 6).
const tags = defineCollection({
    loader: glob({ base: './src/content/tags', pattern: '**/*.yaml' }),
    schema: z.object({
        name: z.string(),
        description: z.string().optional(),
        // How /tags/<tag>/ renders its entries. 'list' is the default text
        // listing; 'grid' is an image-first gallery, for visual tags where the
        // pictures are the point (disc dyes, prints, builds). This is what lets
        // a tag page double as a portfolio without a bespoke collection.
        layout: z.enum(['list', 'grid']).default('list'),
    }),
});

export const collections = { posts, notes, tags };
