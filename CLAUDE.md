# log.fisher.sh

Personal blog. Astro + content collections, deployed to https://log.fisher.sh.
Posts and tags are also editable through Pages CMS, so frontmatter shapes are
fixed by `src/content.config.ts` - don't add fields the schema doesn't define.

> **Authoring note:** Fisher now writes and publishes through **Scribe**, a
> separate app he built (checked out locally as a sibling repo) that replaces
> the Pages CMS single-page app for the way he likes to write and publish.
> Pages CMS still works against this repo, but Scribe is the primary authoring
> path. The frontmatter-schema constraint above still holds regardless of which
> tool writes the file.

## Posts

- Live in `src/content/posts/*.md`. The filename (minus `.md`) is the slug.
- URL is `/posts/YYYY/MM/DD/<slug>/`, where the date comes from frontmatter
  `date` read in UTC (`src/lib/posts.ts`). So `date: 2026-06-04` +
  `calsync.md` -> `/posts/2026/06/04/calsync/`.
- Raw HTML/SVG is allowed inline in the markdown (e.g. the iframe in
  `making-my-dream-weather-dashboard-irl.md`). If you inline an HTML block,
  keep blank lines out of the middle of it or CommonMark ends the block early.

### Draft posts

`draft: true` in frontmatter (default `false`, set in `content.config.ts`).

- A draft is **excluded from listings**: the homepage, the tag pages, and the
  RSS feed all filter with `!data.draft` (`src/pages/index.astro`,
  `tags/[tag].astro`, `tags/index.astro`, `rss.xml.js`).
- A draft is **still built as a page**: `src/pages/posts/[...slug].astro` calls
  `getCollection('posts')` with no draft filter, so the post gets its normal
  `/posts/YYYY/MM/DD/<slug>/` URL - it's just unlinked from anywhere on the
  site. Flip to `draft: false` to surface it in the listings.

So "push it as a draft" = it deploys and is viewable at its URL, but nobody
finds it unless you hand them the link.

## Images

Existing posts reference `https://media.fisher.sh/blog/YYYY/MM/DD/...` (external
CDN). Local assets also work from `public/` and ship with the site - e.g. the
calsync diagrams live in `public/posts/calsync/` and are referenced as
`/posts/calsync/<name>.svg`.

## Running locally

- `npm run dev` - Astro dev server, usually http://localhost:4321.
- `npm run build` - build + Pagefind search index into `dist/`.
- `npm run preview` - serve the built `dist/`.
