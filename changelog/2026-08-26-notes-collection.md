# Notes: a smaller unit of writing than a post

**Date:** 2026-08-26
**Status:** blog side complete on branch `notes-collection`; Scribe support outstanding

## The problem

Of Fisher's 17 entries on projects.fisher.sh, only 6 carried a `blogTag` at all, and
three of those six pointed at `tools` - so quiver, metamorph and meatbag all linked to
the same page. Eleven projects had no writing attached to them whatsoever.

The cause wasn't a lack of things to say. It was that the only available unit of
writing was a full post: a title, a description, a hero image, and an implied thesis.
That's a high bar, so most things cleared nothing and went to Instagram instead, where
86 disc-dye photos with real process captions sat stranded on a platform he stopped
using in 2023.

## What changed

A third content type, `notes`, sitting between the projects catalog and long-form posts:

| Surface | Question it answers | Test |
| --- | --- | --- |
| projects.fisher.sh | What has Fisher built? | Is it a durable thing that exists? |
| log.fisher.sh/posts | What did Fisher learn? | Does it have a thesis? |
| log.fisher.sh/notes | What is Fisher doing? | Is it a moment? |

### `title` is deliberately absent from the schema

This is the load-bearing decision, and it will look like an oversight to anyone reading
the schema cold. Requiring a title is exactly what converts "here's a disc I dyed" into
"I must now write a blog post." Instagram has no titles and he posted 86 times; the blog
has titles and he posted 26 times in thirteen years.

Everything that would normally read `data.title` derives display text from the body
instead - see `noteTitle()` in `src/lib/notes.ts`, used for the `<title>`, meta
description, and compact list rows. **Do not add `title` back.**

### Tags are the join key, including `project:<slug>`

Notes and posts share the `tags` field, and `/tags/<tag>/` now renders both interleaved
in one reverse-chronological timeline with an All/Posts/Notes filter. The filter is a
`data-showing` attribute plus CSS, so there's no re-render, no URL change, and the back
button stays clean.

This generalizes the `project:lrk` convention that already existed but was only used by
five posts. A namespaced `project:<slug>` tag now makes a tag page function as a project
devlog: essays and small updates on one timeline. The projects.fisher.sh `blogTag` field
should be repointed at these instead of topical tags, which is what makes the
"Related on the blog" link precise rather than a page of unrelated posts.

### Tag pages can render as galleries

Tag YAML gained an optional `layout: grid`. `disc-dyes` uses it, so the tag page is the
dye portfolio. This was chosen over a bespoke `dyes` collection specifically so the
mechanism generalizes - any visual tag becomes a gallery by editing one YAML line, with
no new collection, route, or CMS config.

### `images` are media.fisher.sh URLs, not Astro assets

Notes are photo-first and their media lives in R2 (the bot's `!upload`, or Scribe's
External CDN path), so `images` is a list of `{src, alt}` objects with plain string
sources rather than `image()` assets.

## The trap in this change

**`images` is deliberately NOT declared in `.pages.yml`, and must not be declared in
`.scribe.yml` either, until a Scribe bug is fixed.**

Scribe's frontmatter writer (`internal/content/content.go`, `renderField`) renders a
*declared* list by stringifying each item. A declared list-of-objects therefore
round-trips to literal `- map[alt:... src:...]` and destroys the media on first save.
Undeclared fields pass through untouched via `renderUnknown`, so leaving `images` out of
both CMS configs is what currently keeps it safe to hand-edit.

Related: Scribe only mints stable ids for the collection named in `settings.primary`
(`posts`), so notes authored through Scribe get no `id` - and the schema's refine fails
the build for a published note without one, because comments key on it. Both need fixing
before notes can be authored from scribe.fisher.sh, which is where Fisher says he wants
to write them.

## Seeded, not empty

The branch ships five notes rather than launching the section blank: four real dye posts
recovered from Instagram (his captions, hashtag blocks stripped, `@` handles turned into
links) and one clearly-marked placeholder devlog note proving `project:lrk` interleaves.
The remaining 82 dye posts need Meta's "Download Your Information" export, since public
enumeration stops at 12 and caps resolution at 1080x1080.

Seed images currently live in `public/seed/` and should move to media.fisher.sh when the
real import runs.
