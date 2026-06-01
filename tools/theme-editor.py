#!/usr/bin/env python3
"""Local save-as-you-go theme editor for the blog.

    python3 tools/theme-editor.py [port]      # default 4175

Opens http://localhost:<port>. Left: a markdown kitchen-sink (collapsible).
Middle: live preview, styled by the blog's *actual* src/styles/global.css.
Right: a control for every :root token + the site title/tagline.

Every change is written to disk as you make it - token edits rewrite the first
:root block in src/styles/global.css, the title/tagline rewrite src/consts.ts.
There's no copy/paste and no separate save step; just commit when you're happy.
The markdown sample is preview-only and is never saved.
"""
import http.server
import json
import os
import re
import socketserver
import sys
import tempfile
import threading
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GLOBAL_CSS = ROOT / "src/styles/global.css"
CONSTS = ROOT / "src/consts.ts"
FONTS = ROOT / "public/fonts"
MARKED = ROOT / "tools/marked.min.js"
DEFAULT_PORT = 4175

# Serialize disk writes: the server is threaded, and a save is a read-modify-
# write of a whole file, so two overlapping saves could otherwise lose an edit.
_SAVE_LOCK = threading.Lock()


def atomic_write(path: Path, data: str) -> None:
    fd, tmp = tempfile.mkstemp(dir=str(path.parent), prefix="." + path.name + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(data)
        os.replace(tmp, path)
    except BaseException:
        try:
            os.unlink(tmp)
        except OSError:
            pass
        raise


def classify(v: str) -> str:
    v = v.strip()
    if re.fullmatch(r"#[0-9a-fA-F]{3,8}", v):
        return "color"
    if v.startswith("rgb"):
        return "colortext"
    if re.fullmatch(r"-?\d*\.?\d+(px|rem|em)", v):
        return "size"
    if re.fullmatch(r"-?\d*\.?\d+", v):
        return "number"
    return "text"


def read_tokens():
    block = re.search(r":root \{(.*?)\}", GLOBAL_CSS.read_text(), re.S).group(1)
    return [{"name": n, "value": v.strip(), "kind": classify(v)}
            for n, v in re.findall(r"--([a-z0-9-]+):\s*([^;]+);", block)]


def read_site():
    ts = CONSTS.read_text()
    def g(name):
        m = re.search(rf'export const {name}\s*=\s*"([^"]*)"', ts)
        return m.group(1) if m else ""
    return {"title": g("SITE_TITLE"), "description": g("SITE_DESCRIPTION")}


def save_token(name: str, value: str) -> bool:
    with _SAVE_LOCK:
        css = GLOBAL_CSS.read_text()
        m = re.search(r":root \{.*?\}", css, re.S)        # the first :root block only
        if not m:
            return False
        new_block, n = re.subn(rf"(--{re.escape(name)}:\s*)[^;]+;",
                               lambda mm: mm.group(1) + value + ";", m.group(0), count=1)
        if not n:
            return False
        atomic_write(GLOBAL_CSS, css[:m.start()] + new_block + css[m.end():])
        return True


def save_site(key: str, value: str) -> bool:
    const = {"title": "SITE_TITLE", "description": "SITE_DESCRIPTION"}.get(key)
    if not const:
        return False
    with _SAVE_LOCK:
        ts = CONSTS.read_text()
        new, n = re.subn(rf'(export const {const}\s*=\s*")[^"]*(")',
                         lambda mm: mm.group(1) + value.replace('"', '\\"') + mm.group(2), ts, count=1)
        if n:
            atomic_write(CONSTS, new)
        return bool(n)


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
  // does the mono font + code size read well now?
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
  .topbar .status { margin-left: auto; opacity: .65; font-size: 12px; }
  .cols { display: flex; height: calc(100% - 33px); }
  .pane { display: flex; flex-direction: column; min-width: 0; }
  .pane > h2 { margin: 0; padding: .3rem .75rem; background: #232020; color: #888;
    font-size: 11px; text-transform: uppercase; letter-spacing: .06em; font-weight: 600; }
  .pane > h2.toggle { cursor: pointer; user-select: none; }
  .pane > h2 .arrow { color: #6a635c; }
  #editor { flex: 0 0 30%; border-right: 1px solid #333; }
  #editor.collapsed { flex: 0 0 auto; }
  #editor.collapsed textarea { display: none; }
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
  .row input[type=text], .row input[type=number] { background: #1a1816; color: #e8dec8;
    border: 1px solid #3a352f; border-radius: 3px; padding: .15rem .35rem; font: inherit; font-size: 12px;
    font-family: ui-monospace, monospace; }
  .row .unit { display: flex; gap: .25rem; align-items: center; }
  .row .unit input { width: 72px; }
</style>
</head>
<body>
  <div class="topbar">
    <span class="title">blog theme editor</span>
    <span class="hint">saves to global.css + consts.ts as you edit</span>
    <span class="status" id="status">loading...</span>
  </div>
  <div class="cols">
    <div class="pane" id="editor"><h2 id="md-head" class="toggle" title="collapse / expand the editor">markdown <span class="arrow" id="md-arrow">&#9662;</span></h2><textarea id="md" spellcheck="false"></textarea></div>
    <div class="pane" id="preview"><h2>preview &mdash; rendered as a blog post</h2><iframe id="frame"></iframe></div>
    <div class="pane" id="controls"><h2>theme tokens</h2><div id="control-list"></div></div>
  </div>

<script src="/marked.js"></script>
<script>
const SAMPLE = __SAMPLE__;
let TOKENS = [], SITE = {};
const frame = document.getElementById('frame');
const mdEl = document.getElementById('md');
const statusEl = document.getElementById('status');
mdEl.value = SAMPLE;
const setStatus = (t) => statusEl.textContent = t;
const frameDoc = () => frame.contentDocument;

// ---- live apply (instant preview) ----
function applyToken(name, value) {
  const d = frameDoc(); if (d && d.documentElement) d.documentElement.style.setProperty('--' + name, value);
}
function applySite() {
  const d = frameDoc(); if (!d) return;
  const t = d.getElementById('site-title'); if (t) t.textContent = SITE.title;
  const i = d.getElementById('intro'); if (i) i.textContent = SITE.description;
}
function renderMd() {
  const d = frameDoc(); if (!d) return;
  const prose = d.getElementById('prose'); if (prose) prose.innerHTML = marked.parse(mdEl.value, { gfm: true });
}

// ---- save to disk (debounced) ----
const pending = {}; let saveTimer = null;
function queueToken(name, value) {
  pending['t:' + name] = { url: '/save/token', body: { name, value } };
  scheduleFlush();
}
function queueSite(key, value) {
  pending['s:' + key] = { url: '/save/site', body: { key, value } };
  scheduleFlush();
}
function scheduleFlush() { setStatus('saving...'); clearTimeout(saveTimer); saveTimer = setTimeout(flush, 350); }
async function flush() {
  const jobs = Object.values(pending);
  for (const k in pending) delete pending[k];
  try {
    for (const j of jobs)
      await fetch(j.url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(j.body) });
    setStatus('saved ' + new Date().toLocaleTimeString());
  } catch (e) { setStatus('save failed: ' + e.message); }
}

// ---- preview iframe (links the live global.css) ----
function buildFrame() {
  frame.srcdoc =
    '<!DOCTYPE html><html><head><meta charset="utf-8">' +
    '<link rel="stylesheet" href="/global.css">' +
    '<style>.site-title{font-family:\'Marauder\',serif;font-weight:800;font-variation-settings:\'opsz\' 14;font-size:1.4rem;color:var(--fg);margin:0 0 1.5rem}' +
    '.intro{margin:0 0 2.5rem;color:var(--muted);font-style:italic;font-size:1.05em}</style>' +
    '</head><body><main><div class="site-title" id="site-title"></div><p class="intro" id="intro"></p><div id="prose"></div></main></body></html>';
  frame.onload = () => { for (const t of TOKENS) applyToken(t.name, t.value); applySite(); renderMd(); };
}

// ---- controls ----
const groupOf = (t) => (t.kind === 'color' || t.kind === 'colortext') ? 'colors'
  : (t.kind === 'size' ? 'sizes' : (t.kind === 'number' ? 'numbers' : 'other'));
const GROUP_LABEL = { colors: 'colors', sizes: 'sizes', numbers: 'weights / optical size', other: 'other' };

function controlRow(t) {
  const row = document.createElement('div'); row.className = 'row';
  const lab = document.createElement('label'); lab.textContent = '--' + t.name; row.appendChild(lab);
  const change = (v) => { t.value = v; applyToken(t.name, v); queueToken(t.name, v); };
  if (t.kind === 'color') {
    const c = document.createElement('input'); c.type = 'color';
    c.value = t.value.length === 4 ? '#' + t.value.slice(1).split('').map(x => x + x).join('') : t.value;
    const tx = document.createElement('input'); tx.type = 'text'; tx.value = t.value; tx.style.width = '78px';
    c.addEventListener('input', () => { tx.value = c.value; change(c.value); });
    tx.addEventListener('input', () => { change(tx.value); if (/^#[0-9a-fA-F]{6}$/.test(tx.value)) c.value = tx.value; });
    const w = document.createElement('div'); w.style.display = 'flex'; w.style.gap = '.3rem'; w.appendChild(c); w.appendChild(tx); row.appendChild(w);
  } else if (t.kind === 'size') {
    const m = t.value.match(/^(-?\d*\.?\d+)(px|rem|em)$/);
    const w = document.createElement('div'); w.className = 'unit';
    const n = document.createElement('input'); n.type = 'number'; n.step = m[2] === 'px' ? '1' : '0.05'; n.value = m[1];
    const u = document.createElement('span'); u.textContent = m[2]; u.style.cssText = 'color:#6a635c;font-size:11px';
    n.addEventListener('input', () => change(n.value + m[2]));
    w.appendChild(n); w.appendChild(u); row.appendChild(w);
  } else if (t.kind === 'number') {
    const n = document.createElement('input'); n.type = 'number'; n.step = '1'; n.value = t.value; n.style.width = '72px';
    n.addEventListener('input', () => change(n.value)); row.appendChild(n);
  } else {
    const tx = document.createElement('input'); tx.type = 'text'; tx.value = t.value; tx.style.width = '92px';
    tx.addEventListener('input', () => change(tx.value)); row.appendChild(tx);
  }
  return row;
}

function buildSiteControls(list) {
  const h = document.createElement('div'); h.className = 'group'; h.textContent = 'site'; list.appendChild(h);
  for (const [key, label] of [['title', 'SITE_TITLE'], ['description', 'SITE_DESCRIPTION (tagline)']]) {
    const row = document.createElement('div'); row.className = 'row'; row.style.flexWrap = 'wrap';
    const lab = document.createElement('label'); lab.textContent = label; lab.style.cssText = 'flex:1 0 100%;margin-bottom:.25rem';
    const tx = document.createElement('input'); tx.type = 'text'; tx.value = SITE[key]; tx.style.cssText = 'flex:1 0 100%;width:100%';
    tx.addEventListener('input', () => { SITE[key] = tx.value; applySite(); queueSite(key, tx.value); });
    row.appendChild(lab); row.appendChild(tx); list.appendChild(row);
  }
}

function buildControls() {
  const list = document.getElementById('control-list'); list.innerHTML = '';
  buildSiteControls(list);
  for (const g of ['colors', 'sizes', 'numbers', 'other']) {
    const ts = TOKENS.filter(t => groupOf(t) === g);
    if (!ts.length) continue;
    const h = document.createElement('div'); h.className = 'group'; h.textContent = GROUP_LABEL[g]; list.appendChild(h);
    for (const t of ts) list.appendChild(controlRow(t));
  }
}

document.getElementById('md-head').addEventListener('click', () => {
  const e = document.getElementById('editor');
  const c = e.classList.toggle('collapsed');
  document.getElementById('md-arrow').innerHTML = c ? '&#9656;' : '&#9662;';
});
mdEl.addEventListener('input', renderMd);

async function init() {
  [TOKENS, SITE] = await Promise.all([
    fetch('/tokens').then(r => r.json()),
    fetch('/site').then(r => r.json()),
  ]);
  buildControls();
  buildFrame();
  setStatus('ready');
}
init();
</script>
</body>
</html>
""".replace("__SAMPLE__", json.dumps(SAMPLE_MD))


class Server(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    daemon_threads = True


class Handler(http.server.BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def _send(self, body, ctype, status=200):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        p = self.path.split("?", 1)[0]
        if p in ("/", "/index.html"):
            return self._send(UI, "text/html; charset=utf-8")
        if p == "/global.css":
            return self._send(GLOBAL_CSS.read_text(), "text/css; charset=utf-8")
        if p == "/marked.js":
            return self._send(MARKED.read_text(), "application/javascript; charset=utf-8")
        if p == "/tokens":
            return self._send(json.dumps(read_tokens()), "application/json")
        if p == "/site":
            return self._send(json.dumps(read_site()), "application/json")
        if p.startswith("/fonts/"):
            f = FONTS / Path(p).name
            if f.exists() and f.suffix == ".woff2":
                return self._send(f.read_bytes(), "font/woff2")
            return self.send_error(404)
        return self.send_error(404)

    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0))
        body = json.loads(self.rfile.read(n) or b"{}")
        if self.path == "/save/token":
            return self._send(json.dumps({"ok": save_token(body["name"], body["value"])}), "application/json")
        if self.path == "/save/site":
            return self._send(json.dumps({"ok": save_site(body["key"], body["value"])}), "application/json")
        return self.send_error(404)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    url = f"http://localhost:{port}/"
    print(f"blog theme editor: {url}")
    print(f"editing {GLOBAL_CSS.relative_to(ROOT)} + {CONSTS.relative_to(ROOT)} (saves on every change)")
    try:
        webbrowser.open(url)
    except Exception:
        pass
    Server(("", port), Handler).serve_forever()


if __name__ == "__main__":
    main()
