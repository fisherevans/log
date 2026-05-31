// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

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
    },
});
