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
    'every-blog-has-a-first-post',
    'lrk-notifications',
    'lrk-early-progress',
    'lrk-lighting',
    'opengl-coursework',
    'giflooper',
    'ian-lesperance-disc-jockey',
    'listr',
]);

// Two entries where word count and character disagree, called out in the
// specimen rather than silently decided.
export const JUDGMENT_CALLS = new Set(['ian-lesperance-disc-jockey', 'every-blog-has-a-first-post']);
