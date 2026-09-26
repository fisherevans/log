// SPECIMEN ONLY - delete with src/pages/specimen/.
//
// The proposed reclassification of existing posts -> notes, derived from body
// word count. The split is bimodal with a clean gap: nothing in the corpus
// lands between 240 and 445 words, so this list is the <=240 side.
export const RECLASS_TO_NOTE = new Set([
    'trianglizer',
    'smash-bash',
    'smartshift',
    'fizzics',
    'the-wayward-crown',
    'pool-simulation',
    'lrk-music',
    'zsprite',
    'lrk-notifications',
    'lrk-early-progress',
    'lrk-lighting',
    'opengl-coursework',
    'giflooper',
    'ian-lesperance-disc-jockey',
    'listr',
]);

// Both settled by Fisher, 2026-09-26: Ian is a note (short, a moment), the
// inaugural post stays a post despite its 97 words (it is the site's opening
// statement, not a beat). Kept as a record of what was decided, not as a flag.
export const JUDGMENT_CALLS = new Set<string>();
