// New-comment Discord ping. A novelty for low volume: fire a webhook whenever a
// comment lands so Fisher sees it in Discord. Best-effort (ctx.waitUntil, errors
// swallowed) and a no-op unless DISCORD_WEBHOOK_URL is set.
//
// Two safety properties matter because comment bodies are attacker-controlled and
// the source is public:
//   1. allowed_mentions disables @everyone/@here/role pings - a comment can never
//      make the webhook notify the whole server.
//   2. above NOTIFY_CAP_PER_HOUR recent comments we stop pinging, so a spam burst
//      can't flood the channel; the DataDog spike monitor covers that case.
import type { Env } from './env';

const NOTIFY_CAP_PER_HOUR = 20;
const SNIPPET_MAX = 280;
const EMBED_COLOR = 0xe89b4b; // the blog accent

export interface NewCommentNotice {
    handle: string | null;
    displayName: string | null;
    body: string;
    pageUrl: string | null; // already validated same-origin by the caller
    postId: string;
}

export function notifyNewComment(env: Env, ctx: ExecutionContext, c: NewCommentNotice, recentCount: number): void {
    if (!env.DISCORD_WEBHOOK_URL) return;
    if (recentCount > NOTIFY_CAP_PER_HOUR) return;

    const who = c.displayName || (c.handle ? `@${c.handle}` : 'someone');
    const snippet = c.body.length > SNIPPET_MAX ? `${c.body.slice(0, SNIPPET_MAX)}…` : c.body;
    const payload = {
        username: 'log.fisher.sh comments',
        allowed_mentions: { parse: [] as string[] },
        embeds: [
            {
                title: `New comment from ${who}`,
                description: snippet,
                url: c.pageUrl ?? undefined,
                color: EMBED_COLOR,
                footer: { text: `post ${c.postId}` },
            },
        ],
    };
    ctx.waitUntil(
        fetch(env.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        })
            .then(() => undefined)
            .catch(() => undefined),
    );
}
