// Relative timestamps for entry meta lines ("19 hours ago", "last week",
// "10 years ago").
//
// The server renders the absolute date, so a no-JS reader, a crawler and the
// RSS feed still see a real date; this rewrites it after load and lets a tap
// put the absolute date back, because phones have no hover.
//
// It lives here rather than inside Stream.astro because the home page's
// featured list draws the same meta line outside the stream root. Two copies
// would drift into two vocabularies, which is the one thing a relative date
// cannot afford.

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
const UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 365 * 24 * 3600], ['month', 30 * 24 * 3600], ['week', 7 * 24 * 3600],
    ['day', 24 * 3600], ['hour', 3600], ['minute', 60],
];

export function relative(iso: string): string {
    const secs = (Date.parse(iso) - Date.now()) / 1000;
    const abs = Math.abs(secs);
    if (abs < 60) return 'just now';
    for (const [unit, size] of UNITS) if (abs >= size) return rtf.format(Math.round(secs / size), unit);
    return 'just now';
}

// Upgrades every `time.rel` under `root`. Safe to call on overlapping roots:
// an element already upgraded is skipped, so it never collects two toggles.
export function upgradeRelTimes(root: ParentNode): void {
    root.querySelectorAll<HTMLTimeElement>('time.rel').forEach((t) => {
        if (t.dataset.relReady) return;
        t.dataset.relReady = '1';
        const abs = t.dataset.abs!;
        const rel = relative(t.dateTime);
        t.textContent = rel;
        t.addEventListener('click', () => { t.textContent = t.textContent === rel ? abs : rel; });
    });
}
