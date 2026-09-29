# 2026-09-29 - Bursts: folding runs of notes in the stream

## What changed

`/posts` folds a **burst** - four or more consecutive notes about the same thing,
each within 14 days of the last - into its newest two entries plus one card:
"12 more notes tagged disc-dyes, Nov 23 - Dec 14, 2021", with an in-place *Show all*
and a link to the tag page. Posts never fold and always break a run. Tag pages, the
home page, search and RSS are untouched - a note is still a note everywhere else.

Pagination now counts blocks, not items: a page is 20 blocks, and a burst is one
block however many notes it holds. The pager range still reports items ("1-45 of
100"). Leaving from inside an expanded burst and coming back re-opens it before the
scroll restore runs, so the entry you left from has a box to land on.

Rule and thresholds live in `src/lib/stream.ts` (`groupBursts`, `BURST_MIN`,
`BURST_LEAD`, `BURST_GAP_DAYS`); the card and its script are in `Stream.astro`.

## Why

Backporting is about to add hundreds of notes in tight runs - 58 dyes landed today,
53 Primortal devlog beats and the Facebook-era projects are next. Interleaved one per
row they drown the posts around them, and the whole point of the notes rollout was
that a note is *smaller* than a post. Folding keeps every note in the stream (it is
there, expandable, at its real date) without letting a productive month become
three pages of the same tag.

## Decisions

- **The tag that folds a run is the project tag if there is one, otherwise the first
  tag.** That is the "what is this about" tag by convention on this site, and it means
  `project:primortal` beats will fold as Primortal even though they also carry `gamedev`.
- **Two lead entries, not one.** One reads as "a note, then a summary"; two reads as a
  run that continues below.
- **Fold at four.** Folding three saves one row and hides two, which is not a trade.
- **The tag page never folds.** It is the answer to "show me the whole run"; folding
  there would be a loop.
