import { SELF, env } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';
import { setPostEnabled, setGlobalEnabled } from '../src/db';

const POST = 'TestPost01';
const USER = { did: 'did:plc:alice', handle: 'alice.test' };
const ADMIN = 'did:plc:admin';

// Helper: POST a comment as a dev-injected identity.
async function post(
    body: Record<string, unknown>,
    who: { did: string; handle?: string } = USER,
): Promise<Response> {
    return SELF.fetch('https://comments.fisher.sh/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Dev-Did': who.did,
            'X-Dev-Handle': who.handle ?? '',
        },
        body: JSON.stringify(body),
    });
}

async function list(postId: string): Promise<{ enabled: boolean; comments: any[] }> {
    const res = await SELF.fetch(`https://comments.fisher.sh/comments?post_id=${postId}`);
    expect(res.status).toBe(200);
    return res.json();
}

// Clean slate between tests - the D1 binding persists across the suite.
beforeEach(async () => {
    await env.DB.exec('DELETE FROM comments');
    await env.DB.exec('DELETE FROM post_settings');
    await env.DB.exec('DELETE FROM settings');
});

describe('comments CRUD', () => {
    it('creates and lists a comment', async () => {
        const res = await post({ postId: POST, body: 'hello world' });
        expect(res.status).toBe(201);
        const created = (await res.json()) as any;
        expect(created.author.did).toBe(USER.did);
        expect(created.body).toBe('hello world');
        expect(created.id).toMatch(/^[A-Za-z][A-Za-z0-9]{9}$/);

        const { enabled, comments } = await list(POST);
        expect(enabled).toBe(true);
        expect(comments).toHaveLength(1);
        expect(comments[0].id).toBe(created.id);
    });

    it('rejects an unauthenticated create', async () => {
        const res = await SELF.fetch('https://comments.fisher.sh/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: POST, body: 'no auth' }),
        });
        expect(res.status).toBe(401);
    });

    it('rejects empty and oversized bodies', async () => {
        expect((await post({ postId: POST, body: '   ' })).status).toBe(400);
        expect((await post({ postId: POST, body: 'x'.repeat(4001) })).status).toBe(400);
    });

    it('threads replies and validates the parent', async () => {
        const top = (await (await post({ postId: POST, body: 'parent' })).json()) as any;
        const reply = await post({ postId: POST, parentId: top.id, body: 'child' });
        expect(reply.status).toBe(201);
        expect(((await reply.json()) as any).parentId).toBe(top.id);

        // Parent on a different post is rejected.
        const bad = await post({ postId: 'OtherPost1', parentId: top.id, body: 'x' });
        expect(bad.status).toBe(400);
    });

    it('lets the author delete, but not a stranger', async () => {
        const c = (await (await post({ postId: POST, body: 'mine' })).json()) as any;

        const stranger = await SELF.fetch(`https://comments.fisher.sh/comments/${c.id}`, {
            method: 'DELETE',
            headers: { 'X-Dev-Did': 'did:plc:mallory' },
        });
        expect(stranger.status).toBe(403);

        const mine = await SELF.fetch(`https://comments.fisher.sh/comments/${c.id}`, {
            method: 'DELETE',
            headers: { 'X-Dev-Did': USER.did },
        });
        expect(mine.status).toBe(200);

        // Deleted comment is a tombstone in the listing.
        const { comments } = await list(POST);
        expect(comments).toHaveLength(1);
        expect(comments[0].deleted).toBe(true);
        expect(comments[0].body).toBe('');
    });

    it('lets the admin delete anyone', async () => {
        const c = (await (await post({ postId: POST, body: 'theirs' })).json()) as any;
        const res = await SELF.fetch(`https://comments.fisher.sh/comments/${c.id}`, {
            method: 'DELETE',
            headers: { 'X-Dev-Did': ADMIN },
        });
        expect(res.status).toBe(200);
    });

    it('honors the per-post and global kill switches', async () => {
        await setPostEnabled(env.DB, POST, false);
        expect((await post({ postId: POST, body: 'blocked' })).status).toBe(403);
        await setPostEnabled(env.DB, POST, true);
        expect((await post({ postId: POST, body: 'ok now' })).status).toBe(201);

        await setGlobalEnabled(env.DB, false);
        expect((await post({ postId: 'AnyPost001', body: 'global off' })).status).toBe(403);
    });
});

// Body hygiene (#17): the back-end half of "validate both ends". The stored text
// is what the client later renders through the markdown allowlist, so it must be
// clean going in - no control chars, normalized newlines, no whitespace padding.
describe('body normalization', () => {
    it('strips control chars but keeps newlines and tabs', async () => {
        const c = (await (await post({ postId: POST, body: 'a\x00b\x07c\td\ne' })).json()) as any;
        expect(c.body).toBe('a\x00b\x07c\td\ne'.replace(/[\x00\x07]/g, ''));
        expect(c.body).toBe('abc\td\ne');
    });

    it('normalizes CRLF and collapses 3+ blank lines to one', async () => {
        const c = (await (await post({ postId: POST, body: 'one\r\n\r\n\r\n\r\ntwo' })).json()) as any;
        expect(c.body).toBe('one\n\ntwo');
    });

    it('trims surrounding whitespace and rejects whitespace-only bodies', async () => {
        const c = (await (await post({ postId: POST, body: '  \n  hi  \n  ' })).json()) as any;
        expect(c.body).toBe('hi');
        expect((await post({ postId: POST, body: '\n\t  \r\n ' })).status).toBe(400);
    });

    it('preserves markdown source verbatim (rendering is the client\'s job)', async () => {
        const md = '**bold** and `code`\n\n- a\n- b\n\n> quote\n\n[x](https://e.test)';
        const c = (await (await post({ postId: POST, body: md })).json()) as any;
        expect(c.body).toBe(md);
    });
});
