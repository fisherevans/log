#!/usr/bin/env python3
"""Backport the fishwingdev Tumblr export (the Primortal devlog) into notes.

Reads the Tumblr data export at EXPORT (posts_x/html/<id>.html, one file per post,
media alongside), writes one note per post into src/content/notes/ tagged
project:primortal, and uploads the media to R2 under notes/YYYY/MM/DD/.

Videos become a <video> in the body with the export's poster frame and
preload="none", so a stream page with forty of them fetches forty posters and no
video bytes. Images go in frontmatter `images` like every other note.

Idempotent the same way as backport-instagram.py: existing slugs keep their id,
existing objects are not re-uploaded.

    tools/backport-tumblr.py --dry-run
    tools/backport-tumblr.py
"""
import argparse
import html
import json
import os
import random
import re
import string
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

EXPORT = Path('/home/dev/social-exports/tumblr')
NOTES = Path(__file__).resolve().parent.parent / 'src/content/notes'
PUBLIC = 'https://media.fisher.sh'
TZ = ZoneInfo('America/New_York')
TAGS = ['project:primortal', 'gamedev']
# Tumblr's per-post tags, where they name a topic a reader might browse. The
# broad ones (gamedev, adventure, game development, game design) are the project
# itself and are dropped in favour of the project tag.
TUMBLR_TAG_MAP = {
    'pixelart': 'pixel-art', 'combat': 'combat', 'menus': 'ui', 'ui': 'ui', 'lighting': 'lighting',
    'lights': 'lighting', 'shaders': 'shaders', 'audio': 'audio', 'sounds': 'audio', 'tooling': 'tools',
    'maps': 'level-design', 'game engine': 'game-engine', 'golang': 'go', 'godot': 'godot', 'astar': 'pathfinding',
}

# Reblogs of other people's posts are theirs, not devlog beats.
SKIP = {'807943430891323392'}

STOP = {'a', 'an', 'the', 'of', 'on', 'in', 'to', 'my', 'i', 'and', 'this', 'some', 'for', 'with', 'is', 'it', 'me',
        'ive', 'im', 'its', 'but', 'so', 'at', 'out', 'up', 'was', 'that', 'be', 'now', 'just', 'little', 'today'}


def to_markdown(frag: str) -> str:
    """The export bodies use p, br, b/strong, i, a, ul/ol/li and the odd div."""
    s = frag.replace('\n', ' ').replace('&nbsp;', ' ')
    s = re.sub(r'<h1>\s*</h1>', '', s)
    # "<b>H</b>ere" - Tumblr's editor bolds a stray first letter; that is noise
    s = re.sub(r'<(b|strong)>(\w)</\1>(?=\w)', r'\2', s)
    # "<b>Statuses:</b>I tried" - a closing ** glued to a letter never closes in
    # CommonMark, so emphasis gets a space on whichever side touches a word.
    def emph(mark):
        return lambda m: (m.group(1) + ' ' if m.group(1) else '') + f'{mark}{m.group(3).strip()}{mark}' + (' ' if m.group(4) else '')
    s = re.sub(r'(\w?)<(b|strong)>(.*?)</\2>(?=(\w?))', emph('**'), s, flags=re.S)
    s = re.sub(r'(\w?)<(i)>(.*?)</\2>(?=(\w?))', emph('_'), s, flags=re.S)
    s = re.sub(r'<a [^>]*href="([^"]+)"[^>]*>(.*?)</a>', lambda m: f'[{m.group(2)}]({m.group(1)})', s, flags=re.S)
    s = re.sub(r'<br\s*/?>', '  \n', s)

    def list_block(m):
        ordered = m.group(1) == 'ol'
        items = re.findall(r'<li>(.*?)</li>', m.group(2), flags=re.S)
        lines = [f'{i + 1}. {it.strip()}' if ordered else f'- {it.strip()}' for i, it in enumerate(items)]
        return '\n\n' + '\n'.join(lines) + '\n\n'

    s = re.sub(r'<(ul|ol)>(.*?)</\1>', list_block, s, flags=re.S)
    s = re.sub(r'<(p|div)[^>]*>', '\n\n', s)
    s = re.sub(r'</(p|div)>', '\n\n', s)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s)
    paras = []
    for p in re.split(r'\n\s*\n', s):
        lines = [' '.join(l.split()) for l in p.split('\n')]
        lines = [l for l in lines if l]
        if lines:
            if all(re.match(r'(-|\d+\.) ', l) for l in lines):
                paras.append('\n'.join(lines))  # a list: one item per line
            else:
                paras.append('  \n'.join(lines) if '  \n' in p else ' '.join(lines))
    return '\n\n'.join(paras).strip()


def slugify(text: str) -> str:
    plain = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', text)
    plain = re.sub(r'[*_]', '', plain).lower().replace("'", '').replace('’', '')
    plain = re.sub(r'[^a-z0-9]+', ' ', plain)
    words = [w for w in plain.split() if w not in STOP]
    if len(words) < 3:
        words = plain.split()
    return '-'.join(words[:5]) or 'note'


def mint_id() -> str:
    return 'nt' + ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(8))


def existing_id(path: Path) -> str | None:
    if not path.exists():
        return None
    m = re.search(r'^id:\s*(\S+)', path.read_text(), re.M)
    return m.group(1) if m else None


def frame_of(video: Path) -> str:
    """Poster frame at 1s, written next to the video; returns a path relative to the html dir."""
    out = video.with_name(video.stem + '_frame.jpg')
    if not out.exists():
        import subprocess
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', '1', '-i', str(video), '-frames:v', '1',
                        '-vf', 'scale=min(1200\\,iw):-2', '-q:v', '3', str(out)], check=True)
    return f'../../media/{out.name}'


def parse(path: Path):
    s = path.read_text(encoding='utf8', errors='ignore')
    body = s.split('<body>')[1].split('<div id="footer"')[0]
    stamp = re.search(r'id="timestamp">\s*(.*?)\s*<', s).group(1)
    stamp = re.sub(r'(\d+)(st|nd|rd|th)', r'\1', stamp)
    when = datetime.strptime(stamp, '%B %d, %Y %I:%M%p').replace(tzinfo=TZ)
    tags = re.findall(r'class="tag">([^<]*)<', s)
    media = []  # in document order
    for fig in re.finditer(r'<figure[^>]*>.*?</figure>', body, flags=re.S):
        f = fig.group(0)
        npf = re.search(r"data-npf='([^']*)'", f)
        npf = json.loads(html.unescape(npf.group(1))) if npf else {}
        if npf.get('type') == 'video':
            poster = (npf.get('poster') or [{}])[0].get('url')
            src = npf['media']['url']
            if not poster or poster.startswith('http'):
                # 14 posts point at a 64.media.tumblr.com poster the export did not
                # include; cut our own frame from the video so nothing depends on
                # Tumblr staying up.
                poster = frame_of(path.parent / src)
            media.append({'kind': 'video', 'src': src, 'poster': poster,
                          'w': npf['media'].get('width'), 'h': npf['media'].get('height')})
        else:
            img = re.search(r'<img [^>]*src="([^"]+)"', f)
            if img:
                media.append({'kind': 'image', 'src': img.group(1)})
    text = to_markdown(re.sub(r'<figure.*?</figure>', '', body, flags=re.S))
    return {'id': path.stem, 'when': when, 'tags': tags, 'media': media, 'text': text}


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    client = None
    if not args.dry_run:
        import boto3
        client = boto3.client('s3', endpoint_url=os.environ['R2_ENDPOINT'],
                              aws_access_key_id=os.environ['R2_ACCESS_KEY_ID'],
                              aws_secret_access_key=os.environ['R2_SECRET_ACCESS_KEY'], region_name='auto')
    bucket = os.environ.get('R2_BUCKET', 'media-fisher-sh')

    posts = sorted((parse(p) for p in (EXPORT / 'posts_x/html').glob('*.html') if p.stem not in SKIP),
                   key=lambda p: p['when'])
    seen = set()
    uploads = 0
    for p in posts:
        when = p['when']
        slug = slugify(p['text'].split('\n')[0] if p['text'] else f'devlog-{p["id"]}')
        base, n = slug, 2
        while slug in seen:
            slug = f'{base}-{n}'
            n += 1
        seen.add(slug)
        path = NOTES / f'{slug}.md'
        nid = existing_id(path) or mint_id()

        tags = list(TAGS)
        for t in p['tags']:
            mapped = TUMBLR_TAG_MAP.get(t)
            if mapped and mapped not in tags:
                tags.append(mapped)
        alt = re.sub(r'[*_]|\[([^\]]*)\]\([^)]*\)', r'\1', p['text'].split('\n')[0])[:120] if p['text'] else 'Primortal devlog'

        def put(rel: str, suffix: str) -> str:
            src = (EXPORT / 'posts_x/html' / rel).resolve()
            ext = src.suffix.lower().lstrip('.')
            key = f'notes/{when:%Y/%m/%d}/{slug}{suffix}.{ext}'
            ctype = {'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'gif': 'image/gif',
                     'webp': 'image/webp', 'mp4': 'video/mp4'}[ext]
            if client is not None:
                try:
                    client.head_object(Bucket=bucket, Key=key)
                except client.exceptions.ClientError:
                    client.put_object(Bucket=bucket, Key=key, Body=src.read_bytes(), ContentType=ctype)
                    nonlocal_uploads[0] += 1
            else:
                if not src.exists():
                    print(f'  MISSING {src}', file=sys.stderr)
                print(f'  upload {rel} -> {key}')
            return f'{PUBLIC}/{key}'

        nonlocal_uploads = [0]
        images, videos = [], []
        multi = len(p['media']) > 1
        for i, m in enumerate(p['media'], 1):
            suffix = f'-{i}' if multi else ''
            if m['kind'] == 'video':
                v = {'src': put(m['src'], suffix), 'w': m.get('w'), 'h': m.get('h')}
                if m.get('poster'):
                    v['poster'] = put(m['poster'], f'{suffix}-poster')
                videos.append(v)
            else:
                images.append({'src': put(m['src'], suffix), 'alt': alt})
        uploads += nonlocal_uploads[0]

        fm = [f'id: {nid}', f'date: {when.strftime("%Y-%m-%dT%H:%M:%S")}Z', 'tags:'] + [f'  - {t}' for t in tags]
        if images:
            fm.append('images:')
            for img in images:
                fm.append(f'  - src: {img["src"]}')
                # ensure_ascii=False: json.dumps would write emoji as \ud83d\ude05
                # surrogate escapes, which js-yaml tolerates but Go's yaml.v3 (scribe)
                # rejects outright - one such file takes the whole editor down.
                fm.append(f'    alt: {json.dumps(img["alt"], ensure_ascii=False)}')
        fm.append('draft: false')

        content = p['text']
        for v in videos:
            attrs = 'controls playsinline preload="none"'
            if v.get('poster'):
                attrs += f' poster="{v["poster"]}"'
            if v.get('w') and v.get('h'):
                attrs += f' width="{v["w"]}" height="{v["h"]}"'
            content += f'\n\n<video {attrs} src="{v["src"]}"></video>'
        path.write_text('---\n' + '\n'.join(fm) + '\n---\n' + content.strip() + '\n')
        print(f'{when:%Y-%m-%d} {slug}  ({len(images)} img, {len(videos)} vid)')
    print(f'{len(posts)} posts, uploaded {uploads} objects', file=sys.stderr)


if __name__ == '__main__':
    main()
