import { SELF, env } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';

// In the test pool ADMIN_DID is did:plc:admin (vitest.config.ts), so this DID is
// admin via the break-glass branch of isAdminIdentity without a grants row.
const ADMIN = 'did:plc:admin';
const POST = 'ModPost001';

function postAs(did: string, body: Record<string, unknown>, handle = ''): Promise<Response> {
    return SELF.fetch('https://comments.fisher.sh/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Dev-Did': did, 'X-Dev-Handle': handle },
        body: JSON.stringify(body),
    });
}

function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
    return SELF.fetch(`https://comments.fisher.sh${path}`, {
        ...init,
        headers: { 'Content-Type': 'application/json', 'X-Dev-Did': ADMIN, ...(init.headers ?? {}) },
    });
}

function me(did?: string): Promise<any> {
    const headers = did ? { 'X-Dev-Did': did } : {};
    return SELF.fetch('https://comments.fisher.sh/oauth/me', { headers }).then((r) => r.json());
}

beforeEach(async () => {
    await env.DB.exec('DELETE FROM comments');
    await env.DB.exec('DELETE FROM bans');
    await env.DB.exec('DELETE FROM post_settings');
    await env.DB.exec('DELETE FROM settings');
});

describe('admin signal', () => {
    it('reports isAdmin for the admin DID, not for others, and logged-out', async () => {
        expect(await me(ADMIN)).toMatchObject({ loggedIn: true, isAdmin: true });
        expect(await me('did:plc:alice')).toMatchObject({ loggedIn: true, isAdmin: false });
        expect(await me()).toEqual({ loggedIn: false });
    });
});

describe('bans', () => {
    it('permanently bans a DID and blocks their comments', async () => {
        const res = await adminFetch('/admin/ban', { method: 'POST', body: JSON.stringify({ type: 'did', subject: 'did:plc:troll' }) });
        expect(res.status).toBe(200);
        expect((await res.json()).expiresAt).toBeNull();
        expect((await postAs('did:plc:troll', { postId: POST, body: 'spam' })).status).toBe(403);
    });

    it('temp-bans with days, returns an expiry, and blocks while active', async () => {
        const res = await adminFetch('/admin/ban', { method: 'POST', body: JSON.stringify({ type: 'did', subject: 'did:plc:temp', days: 10 }) });
        expect(res.status).toBe(200);
        const out = (await res.json()) as { expiresAt: number };
        expect(out.expiresAt).toBeGreaterThan(Date.now());
        expect((await postAs('did:plc:temp', { postId: POST, body: 'x' })).status).toBe(403);
    });

    it('ignores an expired ban', async () => {
        await env.DB
            .prepare(`INSERT INTO bans (subject_type, subject, reason, created_at, expires_at) VALUES ('did', 'did:plc:past', NULL, 1, 1)`)
            .run();
        expect((await postAs('did:plc:past', { postId: POST, body: 'im back' })).status).toBe(201);
    });

    it('rejects a negative days value', async () => {
        const res = await adminFetch('/admin/ban', { method: 'POST', body: JSON.stringify({ type: 'did', subject: 'did:plc:x', days: -5 }) });
        expect(res.status).toBe(400);
    });

    it('refuses ban for non-admins', async () => {
        const res = await SELF.fetch('https://comments.fisher.sh/admin/ban', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Dev-Did': 'did:plc:alice' },
            body: JSON.stringify({ type: 'did', subject: 'did:plc:y' }),
        });
        expect(res.status).toBe(403);
    });
});

describe('admin delete-any', () => {
    it('lets an admin delete another user\'s comment', async () => {
        const c = (await (await postAs('did:plc:alice', { postId: POST, body: 'hi' })).json()) as { id: string };
        expect((await adminFetch(`/comments/${c.id}`, { method: 'DELETE' })).status).toBe(200);
        const { comments } = (await (await SELF.fetch(`https://comments.fisher.sh/comments?post_id=${POST}`)).json()) as { comments: any[] };
        expect(comments[0].deleted).toBe(true);
    });

    it('still refuses delete of another user\'s comment by a non-admin', async () => {
        const c = (await (await postAs('did:plc:alice', { postId: POST, body: 'hi' })).json()) as { id: string };
        const res = await SELF.fetch(`https://comments.fisher.sh/comments/${c.id}`, {
            method: 'DELETE',
            headers: { 'X-Dev-Did': 'did:plc:bob' },
        });
        expect(res.status).toBe(403);
    });
});

describe('admin status + toggles', () => {
    it('reports and toggles per-post and global switches', async () => {
        expect(await (await adminFetch(`/admin/status?post_id=${POST}`)).json()).toEqual({ global: true, post: true });

        await adminFetch(`/admin/posts/${POST}`, { method: 'POST', body: JSON.stringify({ enabled: false }) });
        expect((await (await adminFetch(`/admin/status?post_id=${POST}`)).json() as any).post).toBe(false);

        await adminFetch('/admin/global', { method: 'POST', body: JSON.stringify({ enabled: false }) });
        expect((await (await adminFetch(`/admin/status?post_id=${POST}`)).json() as any).global).toBe(false);
    });

    it('refuses /admin/status for non-admins', async () => {
        const res = await SELF.fetch(`https://comments.fisher.sh/admin/status?post_id=${POST}`, { headers: { 'X-Dev-Did': 'did:plc:alice' } });
        expect(res.status).toBe(403);
    });
});
