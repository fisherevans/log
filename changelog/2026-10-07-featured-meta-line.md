# 2026-10-07 - The featured list gets the stream's meta line

## What changed

- **`src/scripts/reltime.ts` is new, and is the one implementation of a relative
  date.** It exports `relative(iso)` ("19 hours ago", "last week", "10 years ago",
  via `Intl.RelativeTimeFormat` with `numeric: 'auto'`) and `upgradeRelTimes(root)`,
  which rewrites every `time.rel` under `root` and wires the tap-to-absolute toggle.
  Both came out of `Stream.astro`'s inline script unchanged; the module adds a
  `data-rel-ready` guard so overlapping roots cannot double-register the toggle.
- **The home page's featured rows carry a meta line.** Under the title, the same
  row the stream card draws: mono muted relative date, then the post's tag chips,
  `.chip.project` for `project:` tags. The `<time>` ships the absolute date as its
  text, so no-JS readers and crawlers still see one; `index.astro` calls
  `upgradeRelTimes` on the `.featured` root after load.
- **`.meta`, `.chips`, `.date.rel` and `.chip.project` moved from `Stream.astro`'s
  `:global(.stream ...)` block to `global.css`.** One definition now serves the
  stream and the featured list. `BlogPost.astro`'s chips row, which was also called
  `.meta` but is chips alone, is renamed `.tagrow` so the shared rule does not reach
  it.
- **The featured rows borrow the stream's left rhythm.** Same `--spine-x` (0.75rem)
  and `--item-indent` (1.9rem), so a featured title sits on the same column as the
  Latest card and the hairline in the gutter lands on the timeline's spine.

## Why

The featured list was bare serif titles and a muted description, sitting under a
Latest card that has a date, a chip, a timeline node and a frame. It read as a
different page. The relative date was the specific ask; the styling gap was the
reason the ask came up.

The relative-date script was the blocker. It lived inside `Stream.astro`'s module
script and ran over `time.rel` elements under the stream root, so anything outside
that root - the featured rows - would keep its server-rendered absolute date
forever. Copying the function into `index.astro` would have worked and been wrong:
two copies drift into two vocabularies, which is the one thing a relative date
cannot afford.

## Decisions

- **A hairline per row, not a spine with nodes, and no card.** The section's own
  comment calls it "a pointer, not a second helping of the stream", and that still
  holds. It takes the stream's geometry and its meta row, which is what makes the
  page read as one column, and refuses the parts that would make it a second
  timeline.
- **Hover is unchanged.** The title keeps its highlighter swipe; nothing new
  lights up on a row.
- **The featured `<time>` holds the formatted date directly** rather than wrapping
  `FormattedDate.astro` the way `StreamEntry.astro` does. Same rendered text, and
  it avoids a nested `<time>` element in new markup.
- **`.meta .chip.project`, not a bare `.chip.project`.** Project chips get the
  accent border inside an entry meta line, which is where they had it before. A
  global rule would also have given it to the chips in a post's header, which
  nobody asked for.

## Verification

Built with Node 22. `/`, `/posts/`, a post page and `/tags/` shot full-page at
iPhone 13 and desktop widths in both themes. `/posts/`, the post page and the tags
hub are pixel-identical to `origin/main` (one animated thumbnail aside), so moving
the CSS and renaming `.tagrow` changed nothing outside the home page. Driven with
`uidrive`: a featured row reads "12 years ago", one tap gives "Tuesday, May 20,
2014", a second gives it back - and the stream's own date still does the same after
the refactor.
