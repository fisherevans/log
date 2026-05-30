# log.fisher.sh

Fisher Evans' blog. Astro + Pages CMS, served by Cloudflare Pages, media on R2.

## Stack

| Layer | Tech |
|---|---|
| Site generator | [Astro](https://astro.build/) (blog starter, content collections) |
| Search | [Pagefind](https://pagefind.app/) (built post-build, lazy-loaded in browser) |
| Editing UI | [Pages CMS](https://pagescms.org/) at [app.pagescms.org](https://app.pagescms.org/) |
| Hosting | Cloudflare Pages, custom domain `log.fisher.sh` |
| Media | Cloudflare R2 at `media.fisher.sh` (zero egress); offsite mirror to Backblaze B2 |
| Authoring | Bot-driven `!upload` from Discord pushes media to R2, returns paste-ready URLs |

## Schema

Frontmatter for posts in `src/content/posts/`:

```yaml
title: string                  # required
date: date (YYYY-MM-DD)        # required
description: string?           # optional
project: string?               # optional, populates /projects/<project>/
tags: string[]                 # default [], populates /tags/<tag>/
hasVideo: boolean              # default false
heroImage: image?              # optional, served at the top of the post
updatedDate: date?             # optional, shown alongside the original date
draft: boolean                 # default false; drafts hidden from listings + RSS
```

Schema is enforced at build time via `astro:zod` in `src/content.config.ts`. Bad frontmatter fails the build.

## Routes

- `/` — recent posts
- `/posts/<slug>/` — individual post
- `/tags/` — tag index, `/tags/<tag>/` — posts by tag
- `/projects/` — project index, `/projects/<project>/` — posts by project
- `/search/` — Pagefind in-browser search
- `/rss.xml` — RSS feed
- `/sitemap-index.xml` — sitemap (auto)
- `/about/` — site colophon

## Develop locally

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # builds + runs pagefind into dist/
npm run preview    # serve dist/ locally
```

Build command for Cloudflare Pages: `npm run build` (which is `astro build && pagefind --site dist`).
Output dir: `dist`.

## Authoring flow

**Quick path (any browser, including phone):**

1. https://app.pagescms.org → open this repo.
2. Posts collection → new post → fill the frontmatter form, write the body in markdown.
3. Need media? Drop the image into `#ops` in Discord and `!upload <slug>`. Bot returns the `media.fisher.sh/…` URL, paste it into the post.
4. Save → Pages CMS commits → CF Pages builds → live within a couple of minutes.

**Local path:**

1. Edit markdown files under `src/content/posts/`.
2. `npm run dev` for live preview.
3. `git push` → CF Pages auto-deploys.

## Origin

Built as part of [`nottingham-cloud` milestone 4](https://github.com/fisherevans/nottingham-cloud/milestone/4)
— see issues #68 through #81 for the full setup pipeline.
