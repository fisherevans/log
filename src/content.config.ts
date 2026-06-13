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

// Tags collection. YAML files in src/content/tags/.
// Each file provides optional name + description metadata for a tag slug.
// Content Layer: the glob loader determines the collection kind - do NOT also
// set `type` (that's the legacy API and fails the build under Astro 6).
const tags = defineCollection({
    loader: glob({ base: './src/content/tags', pattern: '**/*.yaml' }),
    schema: z.object({
        name: z.string(),
        description: z.string().optional(),
    }),
});

export const collections = { posts, tags };
