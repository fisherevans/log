import { visit } from 'unist-util-visit';

// Replace YouTube <iframe> embeds with a static facade: a poster frame and a
// play button. The real iframe is only created when someone actually presses
// play (see the click handler that ships with whatever renders these).
//
// Why this exists: a YouTube iframe fetches ~1MB of player JS on page load
// whether or not it is ever watched, and `display: none` does not stop it. On
// the notes stream that measured 806 requests / 54MB / 23.7s to load, versus
// 79 requests / 0.97s with the embeds removed. Facades give back essentially
// all of it, and as a side effect nothing touches YouTube (or sets a cookie)
// until the reader opts in.
const YT = /(?:youtube(?:-nocookie)?\.com\/embed\/|youtu\.be\/)([\w-]{6,})/;

const esc = (v) => String(v).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

// The markup, as a string. Raw HTML in markdown never becomes hast elements -
// it arrives as `raw` nodes - so the same facade has to be buildable both ways.
export function facadeHtml(id, title) {
    const t = esc(title);
    return (
        `<div class="yt-facade" data-yt="${id}" data-yt-title="${t}" style="aspect-ratio:16/9">` +
        `<img class="yt-poster" src="https://i.ytimg.com/vi/${id}/hqdefault.jpg" ` +
        `srcset="https://i.ytimg.com/vi/${id}/mqdefault.jpg 320w, https://i.ytimg.com/vi/${id}/hqdefault.jpg 480w" ` +
        `sizes="(max-width: 40rem) 100vw, 44rem" alt="" loading="lazy" decoding="async" ` +
        `>` +
        `<button type="button" class="yt-play" aria-label="Play: ${t}">` +
        `<svg viewBox="0 0 68 48" width="68" height="48" aria-hidden="true">` +
        `<path class="yt-play-bg" d="M66.52 7.74a8 8 0 0 0-5.63-5.66C55.79.99 34 1 34 1s-21.8-.01-26.89 1.06a8 8 0 0 0-5.63 5.68C.42 12.82.4 23.98.4 23.98s-.02 11.16 1.07 16.24a8 8 0 0 0 5.63 5.66C12.2 47 34 47 34 47s21.79.01 26.89-1.06a8 8 0 0 0 5.63-5.66c1.09-5.08 1.07-16.24 1.07-16.24s.02-11.16-1.07-16.3Z"/>` +
        `<path class="yt-play-tri" d="M45 24 27 14v20"/></svg></button>` +
        `<span class="yt-title">${t}</span></div>`
    );
}

const RAW_IFRAME = /<iframe\b[^>]*><\/iframe>|<iframe\b[^>]*\/>/gi;

export default function rehypeYoutubeFacade() {
    return (tree) => {
        // raw HTML blocks (how every embed in this repo is actually written)
        visit(tree, 'raw', (node) => {
            if (typeof node.value !== 'string' || !node.value.includes('<iframe')) return;
            node.value = node.value.replace(RAW_IFRAME, (tag) => {
                const src = (tag.match(/src=["']([^"']+)["']/i) || [])[1] || '';
                const m = src.match(YT);
                if (!m) return tag;
                const title = (tag.match(/title=["']([^"']*)["']/i) || [])[1] || 'Play video';
                return facadeHtml(m[1], title);
            });
        });

        visit(tree, 'element', (node, index, parent) => {
            if (node.tagName !== 'iframe' || !parent || index === null) return;
            const src = String(node.properties?.src ?? '');
            const m = src.match(YT);
            if (!m) return;
            const id = m[1];
            const title = String(node.properties?.title ?? 'Play video');

            parent.children[index] = {
                type: 'element',
                tagName: 'div',
                properties: {
                    className: ['yt-facade'],
                    'data-yt': id,
                    'data-yt-title': title,
                    style: 'aspect-ratio:16/9',
                },
                children: [
                    {
                        type: 'element',
                        tagName: 'img',
                        properties: {
                            // Deliberately no maxresdefault: when a video has
                            // none, YouTube serves a grey placeholder rather
                            // than a 404, so onerror never fires and the poster
                            // silently becomes a blank grey frame.
                            src: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
                            srcset: [
                                `https://i.ytimg.com/vi/${id}/mqdefault.jpg 320w`,
                                `https://i.ytimg.com/vi/${id}/hqdefault.jpg 480w`,
                            ].join(', '),
                            sizes: '(max-width: 40rem) 100vw, 44rem',
                            alt: '',
                            loading: 'lazy',
                            decoding: 'async',
                            className: ['yt-poster'],
                        },
                        children: [],
                    },
                    {
                        type: 'element',
                        tagName: 'button',
                        properties: { type: 'button', className: ['yt-play'], 'aria-label': `Play: ${title}` },
                        children: [
                            {
                                type: 'element',
                                tagName: 'svg',
                                properties: { viewBox: '0 0 68 48', width: 68, height: 48, 'aria-hidden': 'true' },
                                children: [
                                    {
                                        type: 'element',
                                        tagName: 'path',
                                        properties: {
                                            className: ['yt-play-bg'],
                                            d: 'M66.52 7.74a8 8 0 0 0-5.63-5.66C55.79.99 34 1 34 1s-21.8-.01-26.89 1.06a8 8 0 0 0-5.63 5.68C.42 12.82.4 23.98.4 23.98s-.02 11.16 1.07 16.24a8 8 0 0 0 5.63 5.66C12.2 47 34 47 34 47s21.79.01 26.89-1.06a8 8 0 0 0 5.63-5.66c1.09-5.08 1.07-16.24 1.07-16.24s.02-11.16-1.07-16.3Z',
                                        },
                                        children: [],
                                    },
                                    {
                                        type: 'element',
                                        tagName: 'path',
                                        properties: { className: ['yt-play-tri'], d: 'M45 24 27 14v20' },
                                        children: [],
                                    },
                                ],
                            },
                        ],
                    },
                    {
                        type: 'element',
                        tagName: 'span',
                        properties: { className: ['yt-title'] },
                        children: [{ type: 'text', value: title }],
                    },
                ],
            };
        });
    };
}
