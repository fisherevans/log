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

// CSRF: the SameSite=None session cookie means a write must come from our origin.
describe('CSRF guard', () => {
    it('rejects a state-changing request from a foreign origin', async () => {
        const res = await SELF.fetch('https://comments.fisher.sh/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain', Origin: 'https://evil.example', 'X-Dev-Did': USER.did },
            body: JSON.stringify({ postId: POST, body: 'csrf attempt' }),
        });
        expect(res.status).toBe(403);
    });

    it('allows a write with no Origin (non-browser) or from the allowed origin', async () => {
        expect((await post({ postId: POST, body: 'no origin ok' })).status).toBe(201);
        const res = await SELF.fetch('https://comments.fisher.sh/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Origin: env.ALLOWED_ORIGIN, 'X-Dev-Did': USER.did },
            body: JSON.stringify({ postId: POST, body: 'allowed origin ok' }),
        });
        expect(res.status).toBe(201);
    });
});

function del(id: string, hard = false, who: { did: string } = USER): Promise<Response> {
    return SELF.fetch(`https://comments.fisher.sh/comments/${id}${hard ? '?hard=1' : ''}`, {
        method: 'DELETE',
        headers: { 'X-Dev-Did': who.did },
    });
}

// Hard delete (#?): soft leaves a tombstone; hard removes the row, but only on a
// leaf - a comment with replies can't be removed (it would orphan them).
describe('hard delete', () => {
    it('removes a leaf comment entirely (no tombstone)', async () => {
        const c = (await (await post({ postId: POST, body: 'gone soon' })).json()) as any;
        const res = await del(c.id, true);
        expect(res.status).toBe(200);
        expect(((await res.json()) as any).removed).toBe(true);
        const { comments } = await list(POST);
        expect(comments.find((x) => x.id === c.id)).toBeUndefined();
    });

    it('refuses to remove a comment that has replies, but soft delete works', async () => {
        const parent = (await (await post({ postId: POST, body: 'parent' })).json()) as any;
        await post({ postId: POST, parentId: parent.id, body: 'child' });
        expect((await del(parent.id, true)).status).toBe(409);
        expect((await del(parent.id, false)).status).toBe(200);
    });

    it('removes an existing tombstone leaf', async () => {
        const c = (await (await post({ postId: POST, body: 'x' })).json()) as any;
        await del(c.id, false); // soft -> tombstone
        expect((await del(c.id, true)).status).toBe(200); // hard remove the tombstone
        const { comments } = await list(POST);
        expect(comments.find((x) => x.id === c.id)).toBeUndefined();
    });

    it('refuses hard delete from a non-author', async () => {
        const c = (await (await post({ postId: POST, body: 'mine' })).json()) as any;
        expect((await del(c.id, true, { did: 'did:plc:mallory' })).status).toBe(403);
    });
});

function edit(id: string, body: string, who: { did: string } = USER): Promise<Response> {
    return SELF.fetch(`https://comments.fisher.sh/comments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'X-Dev-Did': who.did },
        body: JSON.stringify({ body }),
    });
}

// Windowed edits + revisions (#15). Old versions are snapshotted but never
// returned; the API exposes only the change-magnitude indicator.
describe('edits', () => {
    it('edits within the window and exposes the magnitude indicator', async () => {
        const c = (await (await post({ postId: POST, body: 'hello wrld' })).json()) as any;
        const res = await edit(c.id, 'hello world!');
        expect(res.status).toBe(200);
        const updated = (await res.json()) as any;
        expect(updated.body).toBe('hello world!');
        expect(updated.editCount).toBe(1);
        expect(updated.editedAt).toBeGreaterThan(0);
        expect(updated.charsChanged).toBeGreaterThan(0);
    });

    it('snapshots the original to comment_revisions but never returns it', async () => {
        const c = (await (await post({ postId: POST, body: 'original text' })).json()) as any;
        await edit(c.id, 'revised text');
        const rev = await env.DB.prepare('SELECT version, body FROM comment_revisions WHERE comment_id = ?').bind(c.id).all();
        expect(rev.results).toEqual([{ version: 0, body: 'original text' }]);
        // The list/shape never carries old text.
        const { comments } = await list(POST);
        expect(JSON.stringify(comments)).not.toContain('original text');
    });

    it('treats an identical edit as a no-op (no burned edit)', async () => {
        const c = (await (await post({ postId: POST, body: 'same' })).json()) as any;
        const updated = (await (await edit(c.id, 'same')).json()) as any;
        expect(updated.editCount).toBe(0);
    });

    it('refuses edits from a non-author', async () => {
        const c = (await (await post({ postId: POST, body: 'mine' })).json()) as any;
        expect((await edit(c.id, 'hijacked', { did: 'did:plc:mallory' })).status).toBe(403);
    });

    it('refuses an empty edit and a deleted comment', async () => {
        const c = (await (await post({ postId: POST, body: 'body' })).json()) as any;
        expect((await edit(c.id, '   ')).status).toBe(400);
        await SELF.fetch(`https://comments.fisher.sh/comments/${c.id}`, { method: 'DELETE', headers: { 'X-Dev-Did': USER.did } });
        expect((await edit(c.id, 'too late')).status).toBe(404);
    });

    it('closes the window after 24h', async () => {
        const c = (await (await post({ postId: POST, body: 'old comment' })).json()) as any;
        await env.DB.prepare('UPDATE comments SET created_at = ? WHERE id = ?').bind(1, c.id).run();
        expect((await edit(c.id, 'sneaky late edit')).status).toBe(403);
    });

    it('caps at 3 edits', async () => {
        const c = (await (await post({ postId: POST, body: 'v0' })).json()) as any;
        expect((await edit(c.id, 'v1')).status).toBe(200);
        expect((await edit(c.id, 'v2')).status).toBe(200);
        expect((await edit(c.id, 'v3')).status).toBe(200);
        expect((await edit(c.id, 'v4')).status).toBe(429);
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
