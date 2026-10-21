# Astro 7, wrangler 4 and vitest 4 for Dependabot alerts

**Date:** 2026-10-21
**Type:** deps
**Issue:** fisherevans/nottingham-cloud#800

## What changed

Blog (`/`): `astro` 6.4 -> 7.4.2, `@astrojs/mdx` -> 8.1, `@astrojs/rss`/`@astrojs/sitemap` patch bumps, `sharp` 0.34 -> 0.35.5, `dompurify` 3.4.10 -> 3.4.17, `marked` -> 18.1. Astro 7 made Sätteri the default Markdown processor, and our `rehypePlugins` need the unified pipeline, so `@astrojs/markdown-remark` is now an explicit dependency. Astro 7 refuses to run below Node 22.23.4; `engines` moves to match.

Comments Worker (`comments/`): the declared runtime dependency is now `@atproto/oauth-client` (the code only ever imported that core; `@atproto/oauth-client-node` was declared but cannot run on Workers and dragged undici into the tree). Dev tooling: `wrangler` 3 -> 4, `vitest` 2 -> 4, and `@cloudflare/vitest-pool-workers` (deprecated) -> `@cloudflare/vitest-plugin`, which moved the pool config into a `cloudflareTest()` Vite plugin and the test env typing onto the global `Cloudflare.Env`.

## Why

Dependabot flagged 4 critical and 35 high alerts across the two lockfiles: astro (AVIF image-optimization RCE, plus an older high), devalue, sharp, svgo, js-yaml, nanoid, postcss, smol-toml, vite, source-map-js and http-cache-semantics in the blog; tinypool, vitest, vite, wrangler, ws, undici, sharp, node-forge, postcss and devalue in `comments/`. `npm audit` is now clean in both.

None were reachable from the public sites. The blog is fully static (no adapter), so astro, vite, sharp and friends only run at build time on content in this repo. The Worker bundle contains only the atproto core, jose, zod, multiformats and lru-cache; undici was never bundled, and everything else flagged is wrangler/vitest/miniflare dev tooling. dompurify (moderate, runs in readers' browsers on comment markdown) is the one shipped fix.

## Validation

- Blog: the Astro 7 build emits the same 207 pages with identical visible text on every page; article bodies are byte-identical, the only markup changes are whitespace trimmed inside template elements. Desktop screenshots of home, the posts index and a post are pixel-identical to the Astro 6 build. All internal references resolve (the two pre-existing broken links are unchanged).
- Comments: `tsc --noEmit` clean, 67/67 tests pass under vitest 4, and `wrangler deploy --dry-run` bundles the same set of runtime libraries at the same versions as before.
