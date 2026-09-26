# The notes rollout: one stream, and an archive recovered

**Date:** 2026-09-26
**Status:** shipped on `notes-rollout`

Notes existed since 2026-08-26 but were effectively invisible: they had their own
`/notes` index and never appeared on the home page or `/posts`, which is where
readers land. This makes the stream the site's only listing and moves most of the
archive into it.

## The shape

| Surface | What it is now |
| --- | --- |
| `/posts` | The only listing. Posts and notes interleaved, 20 per page. |
| `/posts/page/N` | Pagination. |
| `/posts/YYYY/` | One year. The year rail links here. |
| `/notes/...` | Permalinks only - **no index**. Comments live on these pages, so the routes stay. |
| `/` | Hero, the latest post, the last three notes. Not a shorter copy of `/posts`. |
| `/rss.xml` | One feed over the whole stream; entries carry their tags plus a `kind` category. |

A **post** is a framed card: title, a 2-3 block excerpt, and one contained CTA. It is
a door you go through. A **note** is unframed, titleless and complete where it stands -
its whole body, nothing to continue to. That asymmetry is honest rather than
decorative, and it is what makes a note read as lighter without reading as *deprecated*,
which is what shrinking and greying it would have done.

Both hang off a timeline: a filled dot per note, an open ring per post, with a fading
stub into the card.

## The content migration

15 posts became notes. The corpus is bimodal - nothing sits between 240 and 445 body
words - so the split needed no case-by-case judgement. Titles were dropped; a note
does not have one.

Seven of the batched entries became **one note per video**. In the LRK ones those
headings were sequential devlog beats that had only ever been batched because a post
was the smallest unit available - exactly the problem notes exist to solve, showing up
retroactively in the archive.

**Each split note is dated by its video's real YouTube upload date.** 14 of the 30
videos differ from the post that carried them. `project:lrk` now spans 2013-05-16 to
2013-08-16 as fourteen beats, where it was four posts on four dates; its first
adventure demo went up seven weeks before the post it appeared in. Dates are in note
URLs, so this had to be settled before anything was published.

`pool-simulation` is the exception the data found: its two videos went up the same day
as an early/final pair, so splitting them would have broken a before-and-after rather
than recovered a timeline. It stays one note.

Old post URLs 301 via `public/_redirects`; a split post points at its earliest note.

## Performance, which turned out to be the real risk

The stream as first built took **23.7s to load, 1,020 requests, 85.7MB**. `/posts`
now loads in **232ms / 23 requests / 1.82MB**. Four build-time changes did it, and
all four apply site-wide, not just to the stream:

- **`rehype-youtube-facade`** - embeds become a poster and a play button; the player
  is created on click. A YouTube iframe fetches ~1MB of player JS on load whether or
  not it is watched, and `display: none` does not stop it. 806 of those 1,020 requests
  were YouTube. Nothing touches YouTube, or sets a cookie, until the reader presses play.
- **`rehype-lazy-media`** - markdown images carry no `loading` attribute, so the browser
  eagerly fetched every one *including images the excerpt had hidden*. One post pulled
  ~20 full-resolution photos (29MB) to render three paragraphs of teaser.
- **`rehype-media-srcset`** - Cloudflare image transformations are enabled on the
  `fisher.sh` zone, so every `media.fisher.sh` image gets a width ladder derived from
  its URL. Measured: 1,465,091B original -> 69,243B at `width=800,format=auto` (AVIF).
  No upload changes, no derivative objects, no backfill.
- **`content-visibility: auto`** on each entry.

A Cache Rule on `media.fisher.sh` (edge 14 days, browser 1 day, ignore cache-control -
R2 custom domains send none) backs this up.

## Three traps worth not rediscovering

1. **`:global(.foo::before)` does not compile.** The pseudo-element has to sit outside
   the parens: `:global(.foo)::before`. It emits a plausible-looking stylesheet and
   simply never matches.
2. **`content-visibility: auto` applies paint containment**, which clips anything drawn
   outside the element's box. The timeline nodes live in the gutter, so the gutter is
   `padding` on the entry rather than `margin`.
3. **No `maxresdefault` in a YouTube poster srcset.** For videos without one, YouTube
   serves a grey placeholder image rather than a 404, so `onerror` never fires and the
   poster silently goes blank.

## Still open

- **Scribe cannot author a note.** It only mints stable `id`s for the collection named
  in `settings.primary`, and its frontmatter writer would corrupt a list-of-objects
  `images` field on first save. Until that is fixed, notes are hand-edited in git -
  which is the opposite of the point.
- Content backport (Instagram dye photos, the Tumblr Primortal devlog, the Facebook and
  Drive archives) - nottingham-cloud#579.
- `sizes` is one global default; per-context values would squeeze image bytes further.
