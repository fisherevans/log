# 2026-09-29 - Tags: backfilled from the sources, and an index that groups them

## What changed

- **The backported notes carry topic tags again.** The Tumblr export's own per-post
  tags map to site tags (`combat`, `ui`, `lighting`, `shaders`, `audio`, `tools`,
  `level-design`, `game-engine`, `go`, `godot`, `pathfinding`; `pixelart` was
  already `pixel-art`; the broad ones - gamedev, adventure, game design - collapse
  into the project tag). The Instagram captions yield technique tags by pattern:
  `stencil`, `cell-dye`, `glue-bed`, `spin-dye`, `shaving-cream`, `chameleon`,
  `rainbow`, `glow`, `resist` (packing tape, straws), `ink`, `3d-printing`. The
  mapping lives in the two `tools/backport-*.py` scripts, which were re-run; every
  note kept its id.
- **`/tags` counts notes.** It only counted posts, so `disc-dyes` showed 4 and
  `project:primortal` did not exist.
- **`/tags` groups by prefix and sorts by count.** Projects first (`project:*`,
  shown by their names), then Topics; any other prefix that appears becomes its own
  section. Counts read "N entries".

## Why

A tag page is now a real filtered timeline, which only pays off if the tags say
something a reader would browse for. "The stencil ones" and "the combat notes"
are browsable; "58 disc-dyes" alone is not.

## Follow-up, same day

- **The index is restyled.** Projects are cards in the deck's idiom - name, `52
  entries · 2025 - 2026`, description, a strip of the newest previews with play
  badges. Topics are a ruled two-column list with the count in the margin. Neither
  is a prose link any more: the old cards inherited the site's highlighter-swipe
  hover, whose text colour is meant for text *on* orange, so a hovered name went
  invisible on both themes.
- **A project's tag page says "project" and the project's name**, not
  `#Project: Primortal`. Metadata files cannot carry a colon, so `project:lrk`
  lives in `project-lrk.yaml`; both pages now look the tag up by either spelling.

## Later the same day: direction H

`/tags` is now hubs. A topic tag with five or more entries is a hub unless it is
nearly always inside a bigger one (`disc-dyes` never appears without `disc-golf`,
`pixel-art` never without `gamedev` - those are facets, not hubs, however many
entries they have); every smaller tag files under the hub it most often shares an
entry with; the few that share with none sit in an "elsewhere" row. Each hub card
shows a per-year sparkline, its span, its description and its facets as chips with
counts. Five hubs and two projects instead of 34 cards. All computed - a new tag
files itself. Chosen from `quiver.fisher.sh/static/reports/log/2026-09-29-tags-options/`.
