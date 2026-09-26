// SPECIMEN ONLY. Twenty ways to join a post card to its node on the timeline.
// CSS per option lives in src/pages/specimen/connectors/index.astro, keyed by n.
export type ConnOption = { n: number; name: string; why: string };

export const CONNECTORS: ConnOption[] = [
    { n: 1, name: 'Nothing', why: 'Ring on the spine, card floating beside it. The control - see if it even needs solving.' },
    { n: 2, name: 'Straight stub', why: 'One hairline across the gap. Reads as docked; says nothing else.' },
    { n: 3, name: 'Quarter-arc elbow', why: 'The line leaves the spine and curves in. A branch off a trunk.' },
    { n: 4, name: 'Long sweep', why: 'A wider, lazier arc starting further up the spine. More gesture, more room.' },
    { n: 5, name: 'S-curve', why: 'Leaves the spine, crosses back. The most drawn, least mechanical.' },
    { n: 6, name: 'Filled tail', why: 'A speech-bubble wedge. Familiar, but borrows an idiom about messages.' },
    { n: 7, name: 'Outlined tail', why: 'The same wedge in line only, so it belongs to the card edge.' },
    { n: 8, name: 'Tapered stem', why: 'A stroke that thickens toward the card. Organic, like a leaf stalk.' },
    { n: 9, name: 'Dotted stub', why: "The site's dotted-link idiom applied to the join." },
    { n: 10, name: 'Dashed stub', why: 'A provisional, sketched connection. Lighter than a solid rule.' },
    { n: 11, name: 'Heavy accent bar', why: 'Short and thick in accent. Confident, a little brash.' },
    { n: 12, name: 'Fading stub', why: 'Accent at the node, transparent at the card. Implies without drawing.' },
    { n: 13, name: 'Ring on the edge', why: 'No connector: the node straddles the card border. Attachment by position.' },
    { n: 14, name: 'Ring inside', why: 'The node sits in the card, the spine stops short. The card owns its marker.' },
    { n: 15, name: 'Spine gap', why: 'The thread breaks for the card and the ring caps the break. Absence as the join.' },
    { n: 16, name: 'Accent left edge', why: 'The card grows an accent border down its whole left side. No connector at all.' },
    { n: 17, name: 'Corner hook', why: 'The top-left corner reaches out and hooks the spine.' },
    { n: 18, name: 'Bracket ticks', why: 'Short ticks at the card’s top and bottom left, node on the top one.' },
    { n: 19, name: 'Notch', why: 'A bite taken out of the card’s left edge where the node sits.' },
    { n: 20, name: 'Double rule', why: 'Two thin parallel lines. Reads as a track rather than a wire.' },
];
