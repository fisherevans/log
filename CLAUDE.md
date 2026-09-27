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

## The stream

`/posts` is the site's **only** listing: posts and notes interleaved by date, 20 per
page, with a year rail down the side. There is no `/notes` index - notes keep their
permalinks because comments live there, but they have no separate stream. Home shows
the hero, the latest post and the last three notes.

A **post** is a framed card with a title, a 2-3 block excerpt and one contained CTA -
a door you go through. A **note** is unframed, titleless and complete where it stands.
Both hang off one timeline. Components: `Stream.astro` (spine, rail, pager, all the
client behaviour) and `StreamEntry.astro` (one entry of either kind). Shared data
helpers in `src/lib/stream.ts`.

Two CSS rules this depends on, both of which fail silently if broken:

- **`:global(.foo::before)` does not compile** - the pseudo-element goes outside the
  parens: `:global(.foo)::before`.
- **`content-visibility: auto` applies paint containment**, clipping anything drawn
  outside the element's box. The timeline nodes live in the gutter, so the gutter is
  `padding` on `.entry`, never `margin`.

## Media is optimised at build time, not by hand

Three rehype plugins in `plugins/` run over every post and note body. Do not undo
them, and do not hand-roll around them:

- `rehype-youtube-facade` - YouTube iframes become a poster + play button; the player
  is created on click. An iframe fetches ~1MB of player JS on load whether or not it
  is watched, and `display: none` does not stop it. **Never add `maxresdefault` to the
  poster srcset**: for videos without one YouTube serves a grey placeholder rather than
  a 404, so `onerror` never fires and the poster goes blank.
- `rehype-lazy-media` - markdown images carry no `loading` attribute otherwise, so the
  browser fetches even the ones an excerpt has hidden.
- `rehype-media-srcset` - every `media.fisher.sh` image gets a width ladder via
  Cloudflare image transformations (`/cdn-cgi/image/...`). Enabled on the `fisher.sh`
  zone; 5,000 unique transformations/month are free. **Keep pasting plain URLs** - the
  ladder is derived, there are no derivative objects in R2 and nothing to backfill.

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

## Notes

- Live in `src/content/notes/*.md`. **No `title`** - that is deliberate, see the schema
  comment in `content.config.ts`. Display text is derived from the body, falling back
  to an embed's `title` attribute for the notes that are one video and no prose.
- URL is `/notes/YYYY/MM/DD/<slug>/`, same shape as a post.
- `images` is a list of `{src, alt}` with plain string sources (media.fisher.sh URLs),
  not Astro `image()` assets.

## Images

Existing posts reference `https://media.fisher.sh/blog/YYYY/MM/DD/...` (external
CDN). Local assets also work from `public/` and ship with the site - e.g. the
calsync diagrams live in `public/posts/calsync/` and are referenced as
`/posts/calsync/<name>.svg`.

## Running locally

**Blog only** (no comments backend):

- `npm run dev` - Astro dev server, usually http://localhost:4321.
- `npm run build` - build + Pagefind search index into `dist/`.
- `npm run preview` - serve the built `dist/`.

**Blog + comments** (what you need to actually exercise the comment UI):

```
tools/dev.sh up --seed     # worker + blog, wired together, plus a demo thread
tools/dev.sh stop          # kill both
```

This starts the comments Cloudflare Worker (`comments/`, `wrangler dev` + local
D1) and the Astro dev server, and prints a login link + a demo post URL. Why
`npm run dev` alone isn't enough, and the gotchas the script handles for you:

- **One shared host.** The worker's dev CORS (`comments/.dev.vars`
  `ALLOWED_ORIGIN`) must match the exact origin the blog is served from, and the
  session cookie must be same-site between them. So both bind to a single host -
  your Tailscale IP by default, so it also works from your phone. **Open the blog
  via that host, not `localhost`**, or the browser silently blocks the comments
  fetch ("Comments are unavailable").
- **No-Bluesky login.** `comments/.dev.vars` `DEV_AUTH=1` unlocks a dev login:
  hit the printed `/oauth/dev-login` link to get a `@fisher.sh` admin session,
  then post/reply/edit/moderate. (OAuth to real Bluesky can't redirect to a
  local host, so this is the only way to be "logged in" locally.)
- **API URL.** The blog reads `PUBLIC_COMMENTS_API_URL` from a gitignored `.env`
  pointing at the local worker; the script writes it.

Deeper backend detail is in `comments/README.md`. Note: the blog is **not** an
image-tag app - it's a Cloudflare Pages site that builds from source, so a
`git push` to `main` IS the production deploy (no nottingham-cloud change, no
tag bump). Don't push UI changes before Fisher has reviewed them locally.
