#!/usr/bin/env python3
"""Backport the Instagram data export into notes.

Reads the Meta export at EXPORT (posts_1.json is the clean per-post list; posts.json
is the same data wrapped in label_values and is ignored), writes one note per post
into src/content/notes/, and uploads the media to R2 under notes/YYYY/MM/DD/.

Idempotent: a note whose slug already exists is rewritten (so the four hand-seeded
dye notes keep their slug + id and gain the real date and full carousel), and an
object already in the bucket is not re-uploaded.

    tools/backport-instagram.py --dry-run     # write notes, print upload plan
    tools/backport-instagram.py               # write notes + upload

R2 creds come from the environment (R2_ENDPOINT, R2_ACCESS_KEY_ID,
R2_SECRET_ACCESS_KEY, R2_BUCKET) - see nottingham-cloud agent/conventions.md.
"""
import argparse
import json
import os
import random
import re
import string
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

EXPORT = Path('/home/dev/social-exports/instagram')
NOTES = Path(__file__).resolve().parent.parent / 'src/content/notes'
PUBLIC = 'https://media.fisher.sh'
TZ = ZoneInfo('America/New_York')
TAGS = ['disc-dyes', 'disc-golf']

# Hand-seeded notes (2026-08) that came from these posts: keep their slug and id.
# Keyed by a caption prefix. Their /seed/ images are replaced by the R2 originals.
SEEDED = {
    'Giving the @mvpdiscsports Axiom proxy': 'axiom-proxy-chameleon',
    'A glow eagle for a buddy': 'glow-eagle-for-a-buddy',
    '@streamlinediscs drift, with a cute black billy goat': 'streamline-drift-billy-goat',
    'Old staple in my bag that I never dyed': 'help-people-pronounce-it',
}

# Captions the generic cleanup gets wrong. Keyed by caption prefix.
OVERRIDES = {
    '#blacklivesmatter': 'Black lives matter. [@streamlinediscs](https://www.instagram.com/streamlinediscs/) Lift.',
}

STOP = {'a', 'an', 'the', 'of', 'on', 'in', 'to', 'my', 'i', 'and', 'this', 'some', 'for', 'with', 'is', 'it', 'me', 'ive', 'im', 'its', 'but', 'so', 'at', 'out', 'up', 'was', 'that', 'be'}


def fix_mojibake(s: str) -> str:
    # Meta exports UTF-8 bytes as if they were latin-1 code points.
    try:
        return s.encode('latin1').decode('utf8')
    except (UnicodeEncodeError, UnicodeDecodeError):
        return s


def clean_caption(raw: str) -> str:
    raw = fix_mojibake(raw).replace('\r', '').replace('throwbit', 'throw it')
    for prefix, text in OVERRIDES.items():
        if raw.startswith(prefix):
            return text
    # Drop the trailing run of hashtags (the "#discgolf #discdye ..." block).
    text = re.sub(r'(\s*#\w+)+\s*$', '', raw)
    # Inline hashtags mid-sentence (#discmania Link) become plain words.
    text = re.sub(r'(?<!\w)#(\w+)', r'\1', text)
    # @handles link to Instagram.
    text = re.sub(r'(?<!\w)@([\w.]+)', lambda m: f'[@{m.group(1)}](https://www.instagram.com/{m.group(1)}/)', text)
    # Collapse whitespace but keep paragraph breaks.
    # Single newlines inside a paragraph were IG line breaks - keep them as lines.
    out = []
    for p in re.split(r'\n\s*\n', text):
        lines = [' '.join(l.split()) for l in p.split('\n')]
        lines = [l for l in lines if l]
        if lines:
            out.append('  \n'.join(lines))
    return '\n\n'.join(out).strip()


def slugify(text: str) -> str:
    plain = re.sub(r'\[@([\w.]+)\]\([^)]*\)', r'\1', text)
    plain = plain.lower().replace("'", '').replace('’', '')
    plain = re.sub(r'[^a-z0-9]+', ' ', plain)
    words = [w for w in plain.split() if w not in STOP]
    if len(words) < 3:
        words = plain.split()
    return '-'.join(words[:5]) or 'note'


def mint_id() -> str:
    alphabet = string.ascii_letters + string.digits
    return 'nt' + ''.join(random.choice(alphabet) for _ in range(8))


def existing_id(path: Path) -> str | None:
    if not path.exists():
        return None
    m = re.search(r'^id:\s*(\S+)', path.read_text(), re.M)
    return m.group(1) if m else None


def load_posts():
    posts = json.load(open(EXPORT / 'your_instagram_activity/media/posts_1.json'))
    out = []
    for p in posts:
        media = p['media']
        ts = p.get('creation_timestamp') or media[0]['creation_timestamp']
        caption = p.get('title') or media[0].get('title') or ''
        out.append({'ts': ts, 'caption': caption, 'media': [m['uri'] for m in media]})
    return sorted(out, key=lambda p: p['ts'])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--dry-run', action='store_true')
    args = ap.parse_args()

    client = None
    if not args.dry_run:
        import boto3
        client = boto3.client(
            's3',
            endpoint_url=os.environ['R2_ENDPOINT'],
            aws_access_key_id=os.environ['R2_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['R2_SECRET_ACCESS_KEY'],
            region_name='auto',
        )
    bucket = os.environ.get('R2_BUCKET', 'media-fisher-sh')

    seen = set()
    uploads = 0
    for p in load_posts():
        when = datetime.fromtimestamp(p['ts'], TZ)
        body = clean_caption(p['caption'])
        slug = next((s for k, s in SEEDED.items() if fix_mojibake(p['caption']).startswith(k)), None) or slugify(body)
        base = slug
        n = 2
        while slug in seen:
            slug = f'{base}-{n}'
            n += 1
        seen.add(slug)
        path = NOTES / f'{slug}.md'
        nid = existing_id(path) or mint_id()

        # Disc line ("Neutron Runway - Streamline") doubles as alt text when present.
        disc = next((l for l in body.split('\n') if re.fullmatch(r'[\w\d .@()/-]+ - [\w\d .&()-]+', l.strip())), None)
        alt = disc.strip() if disc else re.sub(r'\[@([\w.]+)\]\([^)]*\)', r'@\1', body.split('\n')[0])[:120]

        images, videos = [], []
        for i, uri in enumerate(p['media'], 1):
            src = EXPORT / uri
            ext = src.suffix.lower().lstrip('.')
            key = f"notes/{when:%Y/%m/%d}/{slug}{'' if len(p['media']) == 1 else f'-{i}'}.{ext}"
            url = f'{PUBLIC}/{key}'
            ctype = {'webp': 'image/webp', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'png': 'image/png', 'mp4': 'video/mp4'}[ext]
            if ext == 'mp4':
                videos.append(url)
            else:
                images.append({'src': url, 'alt': alt})
            if client is not None:
                try:
                    client.head_object(Bucket=bucket, Key=key)
                except client.exceptions.ClientError:
                    client.put_object(Bucket=bucket, Key=key, Body=src.read_bytes(), ContentType=ctype)
                    uploads += 1
            else:
                print(f'  upload {uri} -> {key}')

        # Local wall-clock time written as UTC: the site treats dates as UTC, so this
        # keeps the URL day equal to the day it was posted while preserving order
        # within a day (fourteen of these landed on 2021-10-24).
        fm = [f'id: {nid}', f'date: {when.strftime("%Y-%m-%dT%H:%M:%S")}Z', 'tags:'] + [f'  - {t}' for t in TAGS]
        if images:
            fm.append('images:')
            for img in images:
                fm.append(f'  - src: {img["src"]}')
                fm.append(f'    alt: {json.dumps(img["alt"])}')
        fm.append('draft: false')
        content = body
        for v in videos:
            content += f'\n\n<video controls playsinline preload="metadata" src="{v}"></video>'
        path.write_text('---\n' + '\n'.join(fm) + '\n---\n' + content.strip() + '\n')
        print(f'{when:%Y-%m-%d} {slug}  ({len(images)} img, {len(videos)} vid)')
    print(f'uploaded {uploads} objects', file=sys.stderr)


if __name__ == '__main__':
    main()
