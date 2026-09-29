# 2026-09-29 - The burst card is a deck, and the fold rule lost its day count

## What changed

- **The fold card is a deck**: a bright orange front card with two fading cards
  offset behind it (55% and 25% orange, three explicit layers - with equal z the
  outer pseudo painted over the middle one). Ring node on the spine with the same
  fading stub into the card that a post has. Inside, three lines: `16 more notes` in
  display type, `in #tag · over 6 weeks` in mono, then a strip of up to four
  previews (first frontmatter image, else a self-hosted video's poster, else the
  YouTube poster; video previews carry a play badge) and a `+N` tile, then `Show all`
  as a filled primary and the tag-page link. A run with no pictures gets no strip.
- **Duration instead of a date range.** "over 6 weeks" is what a reader wants from
  the dates; the exact range is a click away (and in the tooltip).
- **The fold rule has no gap-in-days any more.** A run of same-tag notes breaks on a
  post or a year boundary, nothing else. Measured on the real notes: same-tag gaps
  are p50 2d / p75 7d / p90 25d / p95 88d - sessions and hiatuses with almost
  nothing between 30 and 90 days, so every threshold in that band is arbitrary. The
  14-day rule cut the Primortal devlog into five cards and the dyes into nine; now
  it is two and four (one per year), which is what "how much of this is there" wants.
- **Stream actions are icon + word**: a chat bubble for Comment, a chain for Link
  (copies the permalink), an arrow-out-of-tray for Share (the OS share sheet where
  there is one, a copy where there is not). Icons lead, per the UX guidelines.

## Why

Picked from a ten-option specimen and a six-variant follow-up
(`quiver.fisher.sh/static/reports/log/2026-09-29-burst-options/`, `-burst-deck-v2/`).
The first fold card was correct and invisible at scroll speed; the deck changes the
*shape* of the thing, which is what the eye catches, and the strip shows what is
folded instead of just counting it.
