// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// Octicon "link" icon, as a hast node appended inside each heading. Styled and
// wired up to copy-the-link in src/styles/global.css + src/layouts/BlogPost.astro.
const linkIcon = {
    type: 'element',
    tagName: 'svg',
    properties: { viewBox: '0 0 16 16', width: 16, height: 16, 'aria-hidden': 'true', fill: 'currentColor' },
    children: [
        {
            type: 'element',
            tagName: 'path',
            properties: {
                d: 'M7.775 3.275a.75.75 0 0 0 1.06 1.06l1.25-1.25a2 2 0 1 1 2.83 2.83l-2.5 2.5a2 2 0 0 1-2.83 0 .75.75 0 0 0-1.06 1.06 3.5 3.5 0 0 0 4.95 0l2.5-2.5a3.5 3.5 0 0 0-4.95-4.95l-1.25 1.25Zm-4.69 9.64a2 2 0 0 1 0-2.83l2.5-2.5a2 2 0 0 1 2.83 0 .75.75 0 0 0 1.06-1.06 3.5 3.5 0 0 0-4.95 0l-2.5 2.5a3.5 3.5 0 0 0 4.95 4.95l1.25-1.25a.75.75 0 0 0-1.06-1.06l-1.25 1.25a2 2 0 0 1-2.83 0Z',
            },
            children: [],
        },
    ],
};

// https://astro.build/config
export default defineConfig({
    site: 'https://log.fisher.sh',
    integrations: [mdx(), sitemap()],
    markdown: {
        // Shiki theme tuned for the warm dark palette in src/styles/global.css.
        // Background is overridden in CSS so only the token colors matter.
        shikiConfig: {
            theme: 'vitesse-dark',
            wrap: false,
        },
        // Slug ids on headings (so #anchor links resolve on load), plus an
        // appended anchor the reader can click to copy a deep link.
        rehypePlugins: [
            rehypeSlug,
            [
                rehypeAutolinkHeadings,
                {
                    behavior: 'append',
                    properties: { className: ['heading-anchor'], 'aria-label': 'Copy link to this section' },
                    content: linkIcon,
                },
            ],
        ],
    },
});
