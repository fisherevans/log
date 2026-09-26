import rss from '@astrojs/rss';
import { buildStream } from '../lib/stream.ts';
import { itemTitle } from '../lib/search.ts';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

// One feed for the whole stream, posts and notes together - the site has one
// listing, so it has one feed. Every entry carries its tags plus a `kind`
// category (post / note), so a reader that supports category filters can
// subscribe to just the essays.
//
// Caveat worth knowing: category filtering is well supported in NetNewsWire,
// Reeder and Inoreader, but is a paid feature in Feedly and absent in some
// others. If splitting the feeds ever matters more than keeping one canonical
// URL, /posts/rss.xml is the place to add it.
export async function GET(context) {
    const items = await buildStream();
    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: items.map((i) => ({
            title: itemTitle(i),
            description: i.kind === 'post' ? (i.entry.data.description ?? '') : itemTitle(i),
            pubDate: i.date,
            link: i.href,
            categories: [...(i.entry.data.tags ?? []), i.kind],
        })),
    });
}
