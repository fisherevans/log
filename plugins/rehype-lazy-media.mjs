import { visit } from 'unist-util-visit';

// Mark every image in a post or note body as lazy. Without this the browser
// eagerly fetches all of them, including ones the excerpt has hidden - the
// glow-disc-box post alone pulled ~20 full-resolution R2 photos (29MB) into
// the stream to render three paragraphs of teaser.
//
// Raw-HTML images get the same treatment; markdown in this repo mixes both.
const RAW_IMG = /<img\b((?:[^>]|"[^"]*"|'[^']*')*)>/gi;

function lazify(attrs) {
    let out = attrs;
    if (!/\bloading=/i.test(out)) out += ' loading="lazy"';
    if (!/\bdecoding=/i.test(out)) out += ' decoding="async"';
    return out;
}

export default function rehypeLazyMedia() {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName !== 'img') return;
            node.properties ??= {};
            node.properties.loading ??= 'lazy';
            node.properties.decoding ??= 'async';
        });
        visit(tree, 'raw', (node) => {
            if (typeof node.value !== 'string' || !node.value.includes('<img')) return;
            node.value = node.value.replace(RAW_IMG, (_m, attrs) => `<img${lazify(attrs)}>`);
        });
    };
}
