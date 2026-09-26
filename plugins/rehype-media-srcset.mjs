import { visit } from 'unist-util-visit';
import { DEFAULT_SIZES, isMediaUrl, mediaSrcSet } from './media-urls.mjs';

// Give every media.fisher.sh image in a body a responsive srcset. Authors keep
// pasting the plain URL that scribe's uploader (or the boto3 helper) hands
// them; the width ladder is derived at build time and never has to be thought
// about. See media-urls.mjs for the measurements.
const RAW_IMG = /<img\b((?:[^>]|"[^"]*"|'[^']*')*)>/gi;

export default function rehypeMediaSrcset() {
    return (tree) => {
        visit(tree, 'element', (node) => {
            if (node.tagName !== 'img') return;
            const src = node.properties?.src;
            if (!isMediaUrl(src)) return;
            node.properties.srcset ??= mediaSrcSet(src);
            node.properties.sizes ??= DEFAULT_SIZES;
        });
        visit(tree, 'raw', (node) => {
            if (typeof node.value !== 'string' || !node.value.includes('<img')) return;
            node.value = node.value.replace(RAW_IMG, (tag, attrs) => {
                if (/\bsrcset=/i.test(attrs)) return tag;
                const src = (attrs.match(/\bsrc=["']([^"']+)["']/i) || [])[1];
                if (!isMediaUrl(src)) return tag;
                return `<img${attrs} srcset="${mediaSrcSet(src)}" sizes="${DEFAULT_SIZES}">`;
            });
        });
    };
}
