# tools

## `theme-editor.html` — blog theme playground

A self-contained page for tuning the blog's look. **Open it in a browser**
(double-click / `file://`) — no server, no internet: the fonts, the markdown
renderer ([marked](https://marked.js.org/)), and a copy of the blog's prose
styles are all embedded.

- **left** — a markdown kitchen-sink (headings, quotes, lists, a GFM table,
  code, rules, links). Edit it to test your own content.
- **middle** — live preview, rendered and styled exactly like a blog post
  (it's an `<iframe>` carrying the blog's `global.css`, so the tool's own UI
  can't leak in).
- **right** — a control for every `:root` token in `global.css` (colors,
  sizes, weights, optical sizes, bullets). Changes apply to the preview live.
- the **site** section (top of the controls) edits `SITE_TITLE` and
  `SITE_DESCRIPTION` (the italic tagline/headline on the homepage); they
  preview live at the top of the post.
- **Export :root** copies the tuned `:root` block — paste it over the `:root`
  block in `src/styles/global.css`. **Export site text** copies the
  `SITE_TITLE` / `SITE_DESCRIPTION` lines — paste them into `src/consts.ts`.

Nothing is saved automatically; the page is a sandbox.

### Regenerating

`theme-editor.html` is generated from `src/styles/global.css` + `public/fonts/`.
After you change the prose styles or add a token, re-sync it:

```sh
python3 tools/build-theme-editor.py
```
