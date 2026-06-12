// One-time backfill: stamp a stable `id` into the frontmatter of every post that
// lacks one. The id is what comments key on (see comments-architecture), so it
// must be immutable - generate once, never regenerate. Idempotent: posts that
// already have an `id` are left untouched. Safe to re-run.
//
//   node tools/backfill-post-ids.mjs
//
// Going forward, Scribe mints the id on save; this script only covers the
// existing corpus.

import { randomInt } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const POSTS_DIR = 'src/content/posts';

// URL-safe, unambiguous alphabet. First char is forced to a letter so YAML never
// parses the value as a number and it always round-trips as a string unquoted.
const FIRST = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const REST = FIRST + '0123456789';
const LEN = 10;

function mintId() {
    let out = FIRST[randomInt(FIRST.length)];
    for (let i = 1; i < LEN; i++) out += REST[randomInt(REST.length)];
    return out;
}

function hasId(front) {
    return /^id:\s/m.test(front);
}

let changed = 0;
let skipped = 0;
for (const name of readdirSync(POSTS_DIR)) {
    if (!name.endsWith('.md') && !name.endsWith('.mdx')) continue;
    const path = join(POSTS_DIR, name);
    const raw = readFileSync(path, 'utf8');
    if (!raw.startsWith('---\n')) {
        console.warn(`!! ${name}: no frontmatter, skipped`);
        continue;
    }
    const end = raw.indexOf('\n---', 4);
    const front = raw.slice(4, end + 1);
    if (hasId(front)) {
        skipped++;
        continue;
    }
    const id = mintId();
    // Insert as the first frontmatter line so it reads as the post's identity.
    const next = '---\n' + `id: ${id}\n` + raw.slice(4);
    writeFileSync(path, next);
    console.log(`+  ${name}  ->  ${id}`);
    changed++;
}
console.log(`\n${changed} stamped, ${skipped} already had an id.`);
