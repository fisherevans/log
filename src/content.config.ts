import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Posts collection. Markdown + MDX files in src/content/posts/.
//
// Required: title, date.
// Optional: description, tags (for /tags/<tag>/), hasVideo, heroImage, updatedDate.
// draft: true keeps a post out of listings + RSS.
const posts = defineCollection({
    loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
    schema: ({ image }) =>
        z.object({
            title: z.string(),
            description: z.string().optional(),
            date: z.coerce.date(),
            updatedDate: z.coerce.date().optional(),
            heroImage: z.optional(image()),
            tags: z.array(z.string()).default([]),
            hasVideo: z.boolean().default(false),
            draft: z.boolean().default(false),
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
