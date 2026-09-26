#!/usr/bin/env python3
"""One-off: reclassify short posts as notes, splitting video batches.

Run once, from the repo root, with a YouTube Data API key in $YT_KEY.

What it does, and why each part:

* The 15 posts listed in RECLASS are notes by weight - the corpus is bimodal
  and nothing sits between 240 and 445 body words. They lose their titles: a
  note has none by design (see content.config.ts).
* A post that is a batch of videos under headings becomes one note per video,
  because in the LRK entries those headings are sequential devlog beats that
  were only ever batched together because a post was the smallest unit
  available.
* Each split note is dated by its video's real YouTube upload date, not the
  post's. 14 of the 30 videos differ, and LRK's first adventure demo turns out
  to predate its post by seven weeks. Dates are in note URLs, so this has to
  be right before anything is published.
* KEEP_WHOLE holds the exception the data found: pool-simulation's two videos
  went up the same day as an early/final pair, so splitting them would break a
  before-and-after rather than recover a timeline.
"""
import json, os, re, subprocess, sys, unicodedata
from pathlib import Path
from urllib.request import urlopen

POSTS = Path('src/content/posts')
NOTES = Path('src/content/notes')

RECLASS = [
    'trianglizer', 'smash-bash', 'smartshift', 'fizzics', 'the-wayward-crown',
    'pool-simulation', 'lrk-music', 'zsprite', 'lrk-notifications',
    'lrk-early-progress', 'lrk-lighting', 'opengl-coursework', 'giflooper',
    'ian-lesperance-disc-jockey', 'listr',
]
KEEP_WHOLE = {'pool-simulation'}

ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'


def mint_id(n=10):
    return ''.join(ALPHABET[b % len(ALPHABET)] for b in os.urandom(n))


def slugify(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode()
    s = re.sub(r"[^\w\s-]", '', s.lower())
    return re.sub(r'[-\s]+', '-', s).strip('-')


def split_front(text):
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', text, re.S)
    if not m:
        raise SystemExit('no frontmatter')
    return m.group(1), m.group(2).lstrip('\n')


def get(front, key):
    m = re.search(rf'^{key}:\s*(.+)$', front, re.M)
    return m.group(1).strip() if m else None


def tags_of(front):
    m = re.search(r'^tags:\n((?:\s+-\s+.+\n)+)', front, re.M)
    if not m:
        return []
    return [l.strip()[2:].strip() for l in m.group(1).splitlines()]


def yt_dates(ids, key):
    out = {}
    for i in range(0, len(ids), 50):
        url = ('https://www.googleapis.com/youtube/v3/videos?part=snippet&id='
               + ','.join(ids[i:i + 50]) + '&key=' + key)
        for it in json.load(urlopen(url)).get('items', []):
            out[it['id']] = it['snippet']['publishedAt'][:10]
    return out


IFRAME = re.compile(r'<iframe\b[^>]*></iframe>', re.I | re.S)
VID = re.compile(r'youtube\.com/embed/([\w-]+)')
HEADING = re.compile(r'^#{2,6}\s+(.+)$', re.M)


def segments(body):
    """Split a body into (heading, block) pairs at each embed, plus a preamble.

    A segment is the video with the heading that introduces it; everything
    before the first of those is preamble and belongs to the earliest note.
    """
    parts = re.split(r'\n\n+', body.strip())
    segs, preamble, cur = [], [], None
    for p in parts:
        is_head = bool(HEADING.match(p))
        has_vid = bool(IFRAME.search(p) and VID.search(p))
        if is_head:
            if cur:
                segs.append(cur)
            cur = {'heading': HEADING.match(p).group(1).strip(), 'blocks': []}
        elif has_vid:
            if cur is None:
                cur = {'heading': None, 'blocks': []}
            cur['blocks'].append(p)
        elif cur is not None:
            cur['blocks'].append(p)
        else:
            preamble.append(p)
    if cur:
        segs.append(cur)
    segs = [s for s in segs if any(VID.search(b) for b in s['blocks'])]
    return preamble, segs


def norm(t):
    return re.sub(r'[^a-z0-9]', '', t.lower())


SEEN = set()


def write_note(slug, date, tags, body, extra_id=None):
    # A silent overwrite loses a note. zsprite and the-wayward-crown both
    # carried headings "Update #1"/"Update #2", which is how this was found.
    if slug in SEEN or NOTES.joinpath(f'{slug}.md').exists():
        raise SystemExit(f'slug collision: {slug}')
    SEEN.add(slug)
    nid = extra_id or mint_id()
    front = [f'id: {nid}', f'date: {date}']
    if tags:
        front.append('tags:')
        front += [f'  - {t}' for t in tags]
    front.append('draft: false')
    NOTES.joinpath(f'{slug}.md').write_text(
        '---\n' + '\n'.join(front) + '\n---\n' + body.strip() + '\n')
    return slug, date


def main():
    key = os.environ.get('YT_KEY')
    if not key:
        raise SystemExit('set YT_KEY')

    all_ids = []
    for slug in RECLASS:
        all_ids += VID.findall(POSTS.joinpath(f'{slug}.md').read_text())
    pub = yt_dates(list(dict.fromkeys(all_ids)), key)

    redirects = []
    made = []
    for slug in RECLASS:
        path = POSTS.joinpath(f'{slug}.md')
        front, body = split_front(path.read_text())
        date = get(front, 'date')
        tags = tags_of(front)
        old_url = f"/posts/{date.replace('-', '/')}/{slug}/"

        preamble, segs = segments(body)
        vids = VID.findall(body)

        if len(segs) > 1 and slug not in KEEP_WHOLE:
            written = []
            for n, seg in enumerate(segs):
                vid = next((VID.search(b).group(1) for b in seg['blocks'] if VID.search(b)), None)
                d = pub.get(vid, date)
                # The heading is dropped when the embed's own title already
                # says it - which, for these, it almost always does.
                title = seg['heading']
                keep_head = title and not norm(title) in norm(
                    next((re.search(r'title="([^"]*)"', b).group(1)
                          for b in seg['blocks'] if 'title="' in b), ''))
                blocks = ([f'### {title}'] if keep_head else []) + seg['blocks']
                if n == 0 and preamble:
                    blocks = preamble + blocks
                # The video's own title is unique across the corpus and reads
                # better than the post heading, which is often just "Update #1".
                ytt = next((re.search(r'title="([^"]*)"', b).group(1)
                            for b in seg['blocks'] if 'title="' in b), None)
                sub = slugify(ytt or title or f'{slug}-{n + 1}')
                written.append(write_note(sub, d, tags, '\n\n'.join(blocks)))
            written.sort(key=lambda w: w[1])
            first = written[0]
            redirects.append((old_url, f"/notes/{first[1].replace('-', '/')}/{first[0]}/"))
            made += [w[0] for w in written]
        else:
            # A single-video note is that moment, so it takes the video's date.
            d = pub.get(vids[0], date) if len(set(vids)) == 1 and vids else date
            write_note(slug, d, tags, body)
            redirects.append((old_url, f"/notes/{d.replace('-', '/')}/{slug}/"))
            made.append(slug)

        path.unlink()

    Path('public/_redirects').write_text(
        '# Generated by tools/migrate-notes.py - posts reclassified as notes.\n'
        '# A split post redirects to its earliest resulting note; the rest of\n'
        '# the batch is one tag-page click away.\n'
        + '\n'.join(f'{a}  {b}  301' for a, b in sorted(redirects)) + '\n')

    print(f'notes written: {len(made)}')
    print(f'posts removed: {len(RECLASS)}')
    print(f'redirects:     {len(redirects)}')


if __name__ == '__main__':
    main()
