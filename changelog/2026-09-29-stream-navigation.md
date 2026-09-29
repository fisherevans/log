# 2026-09-29 - Stream navigation: back links that know where you came from

Feedback from browsing the live site after the backports landed. All in one pass.

## What changed

- **Pager on top from page 2 on.** A page change lands you at the top with no way
  back but scrolling to the bottom. `Pager.astro` is its own component now, drawn
  above the list when `page.current > 1` and below it always.
- **Tag pages are the stream, filtered.** The `layout: grid` gallery is gone; a tag
  page is the same timeline the reader was just in, narrowed to one tag, unfolded
  (no bursts - the tag page is where a burst opens to).
- **Back links are context-aware.** `BackToStream` reads the memory the stream
  writes when you leave it (path, entry, a label: "everything", "#disc-dyes",
  "home") and points back there, labelled. With nothing remembered - a shared URL,
  a search hit - a permalink's back link falls back to the `/posts` page the entry
  actually sits on (`hrefInStream`), anchored `#e-<id>`; the stream unfolds the
  burst if one hides it, scrolls it into view and marks it. A tag page's "all tags"
  link does the same, so it returns you to the stream you clicked the tag from.
- **A Comment action on every stream entry**, notes and posts, linking to the
  permalink's `#comments`. The comments section scrolls into view and flashes so
  the eye knows where it was sent.
- **Lead media stays above the cut.** A condensed note lifts its first piece of body
  media above the clamped prose (Tumblr's rule); the clip grows to the media plus a
  few lines. Devlog beats that are "three paragraphs then the video" now show the
  video in the stream.
- On a phone the note head wraps so four actions no longer crush the date and tags.

## Why

Two of these were plain bugs (the pager, the gallery's "back" going to `/posts`).
The rest is one idea: the stream is the place, everything else is a detour from
it, and every detour should return you to the exact spot you left - on the right
page, highlighted - whether you left from `/posts`, a year, or a tag.
