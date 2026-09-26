// Cloudflare image transformations for media.fisher.sh.
//
// media.fisher.sh is an R2 custom domain on the fisher.sh zone, and zone-level
// transformations are enabled, so any object can be resized and re-encoded by
// prefixing its key with /cdn-cgi/image/<options>/. Measured on a real post
// photo: 1,465,091 B original -> 69,243 B at width=800,format=auto (AVIF), and
// 22,136 B at width=400. Transformations are billed per unique variant with
// 5,000/month free; this library is ~100 images, so a few hundred one-off
// transforms that then serve from cache.
//
// Deliberately no upload-side changes and no derivative objects: the original
// stays the only thing in the bucket, and the URL does the work.
export const MEDIA_HOST = 'media.fisher.sh';
export const WIDTHS = [400, 800, 1200, 1600];
export const DEFAULT_SIZES = '(max-width: 40rem) 100vw, 44rem';

// GIFs would lose their animation unless anim=true, and SVG is already
// resolution-independent - neither belongs in a width ladder.
const SKIP = /\.(svg|gif)(\?|$)/i;

export function isMediaUrl(url) {
    if (typeof url !== 'string') return false;
    if (!url.includes(`//${MEDIA_HOST}/`)) return false;
    if (url.includes('/cdn-cgi/image/')) return false; // already transformed
    return !SKIP.test(url);
}

export function cfImage(url, width, { quality = 82 } = {}) {
    const i = url.indexOf(`//${MEDIA_HOST}/`);
    if (i < 0) return url;
    const origin = url.slice(0, i + MEDIA_HOST.length + 2);
    const key = url.slice(i + MEDIA_HOST.length + 3);
    return `${origin}/cdn-cgi/image/width=${width},format=auto,quality=${quality}/${key}`;
}

// The `src` is deliberately left pointing at the ORIGINAL: it is only the
// fallback for anything that cannot read srcset, and keeping it un-transformed
// means a transformation outage degrades to a big image rather than none.
export function mediaSrcSet(url) {
    if (!isMediaUrl(url)) return undefined;
    return WIDTHS.map((w) => `${cfImage(url, w)} ${w}w`).join(', ');
}
