#!/usr/bin/env python3
"""Generate a self-contained blog theme playground -> tools/theme-editor.html.

Reads src/styles/global.css (theme tokens + prose styles) and public/fonts/*,
embeds them (fonts as base64, so the file opens straight from file://), vendors
marked for markdown rendering, and emits one HTML page:

  - left:   a markdown kitchen-sink you can edit
  - middle: a live preview rendered + styled exactly like a blog post (iframe,
            so the blog's global styles can't leak into the tool chrome)
  - right:  controls for every :root theme token; changes apply live

Re-run after editing global.css to re-sync the prose styles + token list:

    python3 tools/build-theme-editor.py
    open tools/theme-editor.html        # or drag into a browser
"""
import base64
import json
import re
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
CSS = (ROOT / "src/styles/global.css").read_text()
FONTS = ROOT / "public/fonts"
MARKED = (ROOT / "tools/marked.min.js").read_text()
CONSTS = (ROOT / "src/consts.ts").read_text()

def const_val(name: str) -> str:
    m = re.search(rf'export const {name}\s*=\s*"([^"]*)"', CONSTS)
    return m.group(1) if m else ""

SITE = {"title": const_val("SITE_TITLE"), "description": const_val("SITE_DESCRIPTION")}

# --- inline fonts: /fonts/X.woff2 -> base64 data URL (portable, no server) ---
def data_url(fname: str) -> str:
    b = (FONTS / fname).read_bytes()
    return "data:font/woff2;base64," + base64.b64encode(b).decode()

blog_css = re.sub(r"url\('/fonts/([^']+)'\)",
                  lambda m: f"url('{data_url(m.group(1))}')", CSS)

# homepage bits that live in index.astro / Header.astro, not global.css
blog_css += """
.site-title { font-family: 'Marauder', serif; font-weight: 800; font-variation-settings: 'opsz' 14; font-size: 1.4rem; color: var(--fg); margin: 0 0 1.5rem; }
.intro { margin: 0 0 2.5rem; color: var(--muted); font-style: italic; font-size: 1.05em; }
"""

# --- parse the first :root block into a token control spec ---
root_block = re.search(r":root \{(.*?)\}", CSS, re.S).group(1)
tokens = []
for name, value in re.findall(r"--([a-z0-9-]+):\s*([^;]+);", root_block):
    v = value.strip()
    if re.fullmatch(r"#[0-9a-fA-F]{3,8}", v):
        kind = "color"
    elif v.startswith("rgb"):
        kind = "colortext"
    elif re.fullmatch(r"-?\d*\.?\d+(px|rem|em)", v):
        kind = "size"
    elif re.fullmatch(r"-?\d*\.?\d+", v):
        kind = "number"
    else:
        kind = "text"
    tokens.append({"name": name, "value": v, "kind": kind})

SAMPLE_MD = r"""# The quick brown fox

A paragraph of body text to check **measure**, _rhythm_, and color. It mixes
**bold**, _italic_, `inline code`, and a [link to log.fisher.sh](https://log.fisher.sh)
so you can see how each sits in a line. The fox jumps over the lazy dog while
the typesetter frets about line-height and the optical size of the body face.

## A second-level heading

Lead paragraph after an h2. Notice the spacing above and the weight contrast.

### A third-level heading

> A blockquote, for when the fox has something quotable to say.
> It runs to a second line to test the left rule and inset.
>
> > And a nested quote within, one level deeper.

Some text, then an unordered list:

- first item with a `--bullet-glyph`
- second item, a little longer so it wraps onto a second line and you can see
  how the hanging indent behaves under the bullet
  - a nested item
  - another nested item
- third item

And an ordered list:

1. step one
2. step two
3. step three

| feature   | supported | notes                    |
| --------- | :-------: | ------------------------ |
| headings  |    yes    | h1-h6                    |
| tables    |    yes    | GFM, with alignment      |
| code      |    yes    | inline + fenced          |
| footnotes |    no     | not enabled in the blog  |

A fenced code block:

```js
function greet(name) {
  // does the mono font + code background read well?
  return `hello, ${name}`;
}
```

---

Text after a horizontal rule. And a final paragraph with a trailing
[link](https://fisher.sh) to close things out.
"""

UI = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>blog theme editor</title>
<style>
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, system-ui, "Segoe UI", sans-serif;
    background: #1a1a1a; color: #ddd; }
  .topbar { display: flex; align-items: center; gap: .75rem; padding: .4rem .75rem;
    background: #2c2825; color: #f4ecd8; font-size: 13px; }
  .topbar .title { font-weight: 600; }
  .topbar .hint { opacity: .5; font-size: 11px; }
  .topbar .actions { margin-left: auto; display: flex; gap: .4rem; }
  .topbar button { padding: .25rem .8rem; background: #3a352f;
    color: #cbb29a; border: 1px solid #4a443c; border-radius: 4px; font: inherit;
    font-size: 11px; text-transform: uppercase; letter-spacing: .06em; cursor: pointer; }
  .topbar button:hover { background: #4a443c; color: #f4ecd8; }
  .cols { display: flex; height: calc(100% - 33px); }
  .pane { display: flex; flex-direction: column; min-width: 0; }
  .pane > h2 { margin: 0; padding: .3rem .75rem; background: #232020; color: #888;
    font-size: 11px; text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
  #editor { flex: 0 0 30%; border-right: 1px solid #333; }
  #editor.collapsed { flex: 0 0 auto; }
  #editor.collapsed textarea { display: none; }
  .pane > h2.toggle { cursor: pointer; user-select: none; }
  .pane > h2 .arrow { color: #6a635c; }
  #editor textarea { flex: 1; width: 100%; resize: none; border: none; outline: none;
    padding: .8rem; background: #1e1c1a; color: #e8dec8;
    font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 13px; line-height: 1.5; }
  #preview { flex: 1; }
  #preview iframe { flex: 1; width: 100%; border: none; background: #1c1a17; }
  #controls { flex: 0 0 300px; border-left: 1px solid #333; overflow-y: auto; background: #201e1b; }
  .group { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: #6a635c;
    padding: .8rem .75rem .25rem; }
  .row { display: flex; align-items: center; gap: .5rem; padding: .15rem .75rem; }
  .row label { flex: 1; font-size: 12px; color: #bdb4a8; font-family: ui-monospace, monospace; }
  .row input[type=color] { width: 28px; height: 22px; padding: 0; border: 1px solid #444;
    border-radius: 3px; background: none; cursor: pointer; }
  .row input[type=text], .row input[type=number] { width: 92px; background: #1a1816; color: #e8dec8;
    border: 1px solid #3a352f; border-radius: 3px; padding: .15rem .35rem; font: inherit; font-size: 12px;
    font-family: ui-monospace, monospace; }
  .row .unit { width: 96px; display: flex; gap: .25rem; }
  .row .unit input { width: 100%; }
</style>
</head>
<body>
  <div class="topbar">
    <span class="title">blog theme editor</span>
    <span class="hint">edits are live; nothing is saved &mdash; use Export :root, then paste into global.css</span>
    <span class="actions">
      <button id="reset">Reset</button>
      <button id="export-site">Export site text</button>
      <button id="export">Export :root</button>
    </span>
  </div>
  <div class="cols">
    <div class="pane" id="editor"><h2 id="md-head" class="toggle" title="collapse / expand the editor">markdown <span class="arrow" id="md-arrow">&#9662;</span></h2><textarea id="md" spellcheck="false"></textarea></div>
    <div class="pane" id="preview"><h2>preview &mdash; rendered as a blog post</h2><iframe id="frame"></iframe></div>
    <div class="pane" id="controls"><h2>theme tokens</h2><div id="control-list"></div></div>
  </div>

<script>__MARKED__</script>
<script>
const BLOG_CSS = __BLOG_CSS__;
const TOKENS = __TOKENS__;
const SAMPLE = __SAMPLE__;
const SITE = __SITE__;
const DEFAULTS = Object.fromEntries(TOKENS.map(t => [t.name, t.value]));
const current = {...DEFAULTS};

const frame = document.getElementById('frame');
const mdEl = document.getElementById('md');
mdEl.value = SAMPLE;

function frameDoc() { return frame.contentDocument; }

function applyToken(name, value) {
  current[name] = value;
  const d = frameDoc();
  if (d && d.documentElement) d.documentElement.style.setProperty('--' + name, value);
}
function applyAll() { for (const t of TOKENS) applyToken(t.name, current[t.name]); }

function applySite() {
  const d = frameDoc(); if (!d) return;
  const t = d.getElementById('site-title'); if (t) t.textContent = SITE.title;
  const i = d.getElementById('intro'); if (i) i.textContent = SITE.description;
}

function renderMd() {
  const d = frameDoc();
  if (!d) return;
  const prose = d.getElementById('prose');
  if (prose) prose.innerHTML = marked.parse(mdEl.value, { gfm: true, breaks: false });
}

function buildFrame() {
  frame.srcdoc = '<!DOCTYPE html><html><head><meta charset="utf-8"><style>' + BLOG_CSS +
    '</style></head><body><main><div class="site-title" id="site-title"></div><p class="intro" id="intro"></p><div id="prose"></div></main></body></html>';
  frame.onload = () => { applyAll(); applySite(); renderMd(); };
}

// --- controls ---
const groupOf = (t) => (t.kind === 'color' || t.kind === 'colortext') ? 'colors'
  : (t.kind === 'size' ? 'sizes' : (t.kind === 'number' ? 'numbers' : 'other'));
const GROUP_LABEL = { colors: 'colors', sizes: 'sizes', numbers: 'weights / optical size', other: 'other' };

function buildControls() {
  const list = document.getElementById('control-list');
  for (const g of ['colors', 'sizes', 'numbers', 'other']) {
    const ts = TOKENS.filter(t => groupOf(t) === g);
    if (!ts.length) continue;
    const h = document.createElement('div'); h.className = 'group'; h.textContent = GROUP_LABEL[g]; list.appendChild(h);
    for (const t of ts) list.appendChild(controlRow(t));
  }
}

function buildSiteControls() {
  const list = document.getElementById('control-list');
  const h = document.createElement('div'); h.className = 'group'; h.textContent = 'site'; list.appendChild(h);
  for (const [key, label] of [['title', 'SITE_TITLE'], ['description', 'SITE_DESCRIPTION (tagline)']]) {
    const row = document.createElement('div'); row.className = 'row'; row.style.flexWrap = 'wrap';
    const lab = document.createElement('label'); lab.textContent = label; lab.style.cssText = 'flex:1 0 100%; margin-bottom:.25rem';
    const tx = document.createElement('input'); tx.type = 'text'; tx.value = SITE[key]; tx.style.cssText = 'flex:1 0 100%; width:100%';
    tx.addEventListener('input', () => { SITE[key] = tx.value; applySite(); });
    row.appendChild(lab); row.appendChild(tx); list.appendChild(row);
  }
}

function controlRow(t) {
  const row = document.createElement('div'); row.className = 'row';
  const lab = document.createElement('label'); lab.textContent = '--' + t.name; row.appendChild(lab);
  if (t.kind === 'color') {
    const c = document.createElement('input'); c.type = 'color'; c.value = t.value.length === 4
      ? '#' + t.value.slice(1).split('').map(x => x + x).join('') : t.value;
    const tx = document.createElement('input'); tx.type = 'text'; tx.value = t.value; tx.style.width = '78px';
    c.addEventListener('input', () => { tx.value = c.value; applyToken(t.name, c.value); });
    tx.addEventListener('input', () => { applyToken(t.name, tx.value); if (/^#[0-9a-fA-F]{6}$/.test(tx.value)) c.value = tx.value; });
    const wrap = document.createElement('div'); wrap.style.display='flex'; wrap.style.gap='.3rem';
    wrap.appendChild(c); wrap.appendChild(tx); row.appendChild(wrap);
  } else if (t.kind === 'size') {
    const m = t.value.match(/^(-?\d*\.?\d+)(px|rem|em)$/);
    const wrap = document.createElement('div'); wrap.className = 'unit';
    const n = document.createElement('input'); n.type = 'number'; n.step = m[2] === 'px' ? '1' : '0.05'; n.value = m[1];
    const u = document.createElement('span'); u.textContent = m[2]; u.style.cssText='align-self:center;color:#6a635c;font-size:11px';
    n.addEventListener('input', () => applyToken(t.name, n.value + m[2]));
    wrap.appendChild(n); wrap.appendChild(u); row.appendChild(wrap);
  } else if (t.kind === 'number') {
    const n = document.createElement('input'); n.type = 'number'; n.step = '1'; n.value = t.value;
    n.addEventListener('input', () => applyToken(t.name, n.value)); row.appendChild(n);
  } else {
    const tx = document.createElement('input'); tx.type = 'text'; tx.value = t.value;
    tx.addEventListener('input', () => applyToken(t.name, tx.value)); row.appendChild(tx);
  }
  return row;
}

document.getElementById('export').addEventListener('click', () => {
  const lines = TOKENS.map(t => '    --' + t.name + ': ' + current[t.name] + ';');
  const css = ':root {\n' + lines.join('\n') + '\n}';
  navigator.clipboard && navigator.clipboard.writeText(css);
  alert('Copied :root to clipboard.\n\nPaste it over the :root block in src/styles/global.css.\n\n' + css);
});
document.getElementById('reset').addEventListener('click', () => {
  Object.assign(current, DEFAULTS);
  document.getElementById('control-list').innerHTML = '';
  buildSiteControls(); buildControls(); applyAll();
});
document.getElementById('export-site').addEventListener('click', () => {
  const esc = (s) => s.replace(/"/g, '\\"');
  const out = 'export const SITE_TITLE = "' + esc(SITE.title) + '";\n' +
              'export const SITE_DESCRIPTION = "' + esc(SITE.description) + '";';
  if (navigator.clipboard) navigator.clipboard.writeText(out);
  alert('Copied site text. Paste over SITE_TITLE / SITE_DESCRIPTION in src/consts.ts.\n\n' + out);
});

mdEl.addEventListener('input', renderMd);
document.getElementById('md-head').addEventListener('click', () => {
  const e = document.getElementById('editor');
  const collapsed = e.classList.toggle('collapsed');
  document.getElementById('md-arrow').innerHTML = collapsed ? '&#9656;' : '&#9662;';
});
buildSiteControls();
buildControls();
buildFrame();
</script>
</body>
</html>
"""

out = (UI
       .replace("__MARKED__", MARKED)
       .replace("__BLOG_CSS__", json.dumps(blog_css))
       .replace("__TOKENS__", json.dumps(tokens))
       .replace("__SAMPLE__", json.dumps(SAMPLE_MD))
       .replace("__SITE__", json.dumps(SITE)))

(ROOT / "tools/theme-editor.html").write_text(out)
print(f"wrote tools/theme-editor.html ({len(out)//1024} KB, {len(tokens)} tokens, "
      f"{len(re.findall(r'data:font', out))} embedded fonts)")
