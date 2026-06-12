import { SELF, env } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';

function subscribe(body: Record<string, unknown>): Promise<Response> {
    return SELF.fetch('https://comments.fisher.sh/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
}

beforeEach(async () => {
    await env.DB.exec('DELETE FROM subscribers');
});

describe('email subscribe', () => {
    it('accepts a valid email and stores it once', async () => {
        const res = await subscribe({ email: 'Reader@Example.com' });
        expect(res.status).toBe(201);
        expect(await res.json()).toEqual({ ok: true, alreadySubscribed: false });

        const row = await env.DB.prepare('SELECT email FROM subscribers').first<{ email: string }>();
        expect(row?.email).toBe('reader@example.com'); // normalized to lowercase

        // Re-subscribing is idempotent, not an error.
        const again = await subscribe({ email: 'reader@example.com' });
        expect(again.status).toBe(201);
        expect(await again.json()).toEqual({ ok: true, alreadySubscribed: true });

        const { count } = (await env.DB.prepare('SELECT COUNT(*) AS count FROM subscribers').first<{
            count: number;
        }>())!;
        expect(count).toBe(1);
    });

    it('rejects malformed addresses', async () => {
        for (const email of ['', 'nope', 'a@b', 'a b@c.com', 'x'.repeat(260) + '@y.com']) {
            expect((await subscribe({ email })).status).toBe(400);
        }
    });
});
