import { afterEach, describe, expect, it, vi } from 'vitest';
import { notifyNewComment } from '../src/notify';
import type { Env } from '../src/env';

function fakeCtx() {
    const waited: Promise<unknown>[] = [];
    return { ctx: { waitUntil: (p: Promise<unknown>) => waited.push(p) } as unknown as ExecutionContext, waited };
}

const notice = {
    handle: 'alice.test',
    displayName: 'Alice',
    body: 'hi there',
    pageUrl: 'https://log.fisher.sh/posts/x/',
    postId: 'P1',
};

afterEach(() => vi.unstubAllGlobals());

describe('notifyNewComment', () => {
    it('is a no-op without a webhook', () => {
        const { ctx, waited } = fakeCtx();
        const f = vi.fn();
        vi.stubGlobal('fetch', f);
        notifyNewComment({} as Env, ctx, notice, 1);
        expect(f).not.toHaveBeenCalled();
        expect(waited).toHaveLength(0);
    });

    it('posts to the webhook with mentions disabled (a body can never @-ping the server)', async () => {
        const { ctx, waited } = fakeCtx();
        const f = vi.fn().mockResolvedValue(new Response(null));
        vi.stubGlobal('fetch', f);
        notifyNewComment({ DISCORD_WEBHOOK_URL: 'https://discord/hook' } as Env, ctx, { ...notice, body: '@everyone gotcha' }, 1);
        expect(f).toHaveBeenCalledOnce();
        const [url, init] = f.mock.calls[0] as [string, RequestInit];
        expect(url).toBe('https://discord/hook');
        const payload = JSON.parse(init.body as string);
        expect(payload.allowed_mentions).toEqual({ parse: [] });
        expect(payload.embeds[0].description).toContain('@everyone'); // shown as text, but inert
        expect(payload.embeds[0].url).toBe(notice.pageUrl);
        await Promise.all(waited);
    });

    it('stops pinging above the per-hour cap (a burst goes to the spike monitor, not Discord)', () => {
        const { ctx } = fakeCtx();
        const f = vi.fn();
        vi.stubGlobal('fetch', f);
        notifyNewComment({ DISCORD_WEBHOOK_URL: 'https://discord/hook' } as Env, ctx, notice, 999);
        expect(f).not.toHaveBeenCalled();
    });
});
