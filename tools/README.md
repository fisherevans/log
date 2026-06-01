# tools

## `theme-editor.py` — blog theme editor (saves as you go)

A local editor for the blog's look. Run it from the repo root:

```sh
python3 tools/theme-editor.py        # opens http://localhost:4175
```

- **left** — a markdown kitchen-sink (collapsible: click the `markdown` header).
- **middle** — live preview, styled by the blog's *actual* `src/styles/global.css`
  (it links the file live, so the preview always matches the blog).
- **right** — a control for every `:root` token (colors, sizes, weights, optical
  sizes, the code font size, bullets), plus a **site** section for `SITE_TITLE`
  and `SITE_DESCRIPTION` (the italic homepage tagline).

**Every change is written to disk as you make it** — token edits rewrite the
first `:root` block in `src/styles/global.css`, the title/tagline rewrite
`src/consts.ts`. No copy/paste, no separate save step; just `git commit` when
you're happy. The markdown sample is preview-only and is never saved.

`marked.min.js` is vendored here and served to the preview for markdown rendering.
