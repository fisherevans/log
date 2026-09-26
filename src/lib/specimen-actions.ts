// SPECIMEN ONLY. Twenty ways to render the action row under a stream entry,
// each with the one-line argument for it. The CSS per option lives in
// src/pages/specimen/actions/index.astro, keyed by `n`.
export type ActionOption = { n: number; name: string; why: string };

export const OPTIONS: ActionOption[] = [
    { n: 1, name: 'Bare text', why: 'No affordance at all beyond colour. Quietest thing that still works.' },
    { n: 2, name: 'Underline on hover', why: 'Nothing at rest, a rule on hover. The web default, unfussy.' },
    { n: 3, name: 'Arrow nudge', why: 'The arrow slides on hover - motion instead of a colour change.' },
    { n: 4, name: 'Outlined pill', why: 'Reads as a button. Loudest option; earns attention but spends it.' },
    { n: 5, name: 'Filled pill', why: 'A real call to action. Probably too much for a personal log.' },
    { n: 6, name: 'Ghost tint', why: 'A wash of background on hover. Soft target, no border noise.' },
    { n: 7, name: 'Bracketed', why: '[ read post ] - terminal idiom, sits well with the mono face.' },
    { n: 8, name: 'Leading chevron', why: 'The mark leads rather than trails; scans as a list item.' },
    { n: 9, name: 'Dotted underline', why: "The site's own link idiom, solid on hover. Consistent by construction." },
    { n: 10, name: 'Micro caps', why: 'Tiny letterspaced sans. Reads as UI, deliberately not as prose.' },
    { n: 11, name: 'Serif italic', why: 'Editorial voice - the action as part of the writing, not chrome.' },
    { n: 12, name: 'Icon in a circle', why: 'Icon gets a ring; label beside it. Clear target, more furniture.' },
    { n: 13, name: 'Icon only', why: 'Just the marks. Cleanest row, worst for anyone who has to guess.' },
    { n: 14, name: 'Rule to the edge', why: 'Label then a hairline running out. Anchors the row to the entry.' },
    { n: 15, name: 'Underline slides in', why: 'A rule grows from the left. Motion without moving the text.' },
    { n: 16, name: 'Thick accent underline', why: 'Marker-pen underline appears below on hover. Warm, handmade.' },
    { n: 17, name: 'Two-tier weight', why: 'Primary in accent, secondary muted. Hierarchy without a box.' },
    { n: 18, name: 'Corner tab', why: 'Docked to the entry’s bottom-right rather than sitting in the flow.' },
    { n: 19, name: 'Arrow only', why: 'No label on the primary - one arrow after the excerpt.' },
    { n: 20, name: 'Arrow slides in', why: 'Label at rest; the arrow appears from the left on hover.' },
];
