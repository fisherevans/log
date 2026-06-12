// Stable id generation. Same alphabet/shape as the blog repo's
// tools/backfill-post-ids.mjs (letter-led, 10 alphanumeric chars) so post ids and
// comment ids look uniform. Uses the Workers crypto global (Web Crypto).
const FIRST = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const REST = FIRST + '0123456789';
const LEN = 10;

export function mintId(): string {
    const bytes = new Uint8Array(LEN);
    crypto.getRandomValues(bytes);
    let out = FIRST[bytes[0] % FIRST.length];
    for (let i = 1; i < LEN; i++) {
        out += REST[bytes[i] % REST.length];
    }
    return out;
}
