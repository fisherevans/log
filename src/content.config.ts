import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Posts collection. Markdown + MDX files in src/content/posts/.
//
// Required: title, date.
// Optional: description, project (for /projects/<project>/), tags
// (for /tags/<tag>/), hasVideo (for /videos/), heroImage, updatedDate.
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
            project: z.string().optional(),
            tags: z.array(z.string()).default([]),
            hasVideo: z.boolean().default(false),
            draft: z.boolean().default(false),
        }),
});

export const collections = { posts };
