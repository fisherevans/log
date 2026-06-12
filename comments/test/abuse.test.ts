import { SELF, env } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';

const POST = 'AbusePost01';
const ADMIN = 'did:plc:admin'; // matches the test ADMIN_DID binding

function post(
    body: Record<string, unknown>,
    who: { did: string; handle?: string; ip?: string },
): Promise<Response> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'X-Dev-Did': who.did,
        'X-Dev-Handle': who.handle ?? '',
    };
    if (who.ip) headers['CF-Connecting-IP'] = who.ip;
    return SELF.fetch('https://comments.fisher.sh/comments', {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });
}

function admin(path: string, body: unknown, did = ADMIN): Promise<Response> {
    return SELF.fetch(`https://comments.fisher.sh${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Dev-Did': did },
        body: JSON.stringify(body),
    });
}

beforeEach(async () => {
    for (const t of ['comments', 'bans', 'post_settings', 'settings', 'did_reputation']) {
        await env.DB.exec(`DELETE FROM ${t}`);
    }
});

describe('rate limiting + progressive trust', () => {
    it('caps a new DID at the daily limit', async () => {
        const who = { did: 'did:plc:newbie' };
        for (let i = 0; i < 5; i++) {
            expect((await post({ postId: POST, body: `c${i}` }, who)).status).toBe(201);
        }
        // 6th within the rolling day is over the new-account cap.
        expect((await post({ postId: POST, body: 'over' }, who)).status).toBe(429);
    });

    it('caps a single IP across DIDs (admin is trusted, so the DID cap is not the limiter)', async () => {
        const ip = '203.0.113.7';
        for (let i = 0; i < 15; i++) {
            expect((await post({ postId: POST, body: `c${i}` }, { did: ADMIN, ip })).status).toBe(201);
        }
        expect((await post({ postId: POST, body: 'over' }, { did: ADMIN, ip })).status).toBe(429);
    });
});

describe('bans', () => {
    it('blocks a banned DID', async () => {
        const who = { did: 'did:plc:spammer' };
        expect((await post({ postId: POST, body: 'first' }, who)).status).toBe(201);
        expect((await admin('/admin/ban', { type: 'did', subject: who.did, reason: 'spam' })).status).toBe(200);
        expect((await post({ postId: POST, body: 'again' }, who)).status).toBe(403);
        // Unban restores access.
        expect((await admin('/admin/unban', { type: 'did', subject: who.did })).status).toBe(200);
        expect((await post({ postId: POST, body: 'back' }, who)).status).toBe(201);
    });

    it('bans the IP behind a comment, blocking that network', async () => {
        const ip = '198.51.100.4';
        const c = (await (await post({ postId: POST, body: 'from ip' }, { did: 'did:plc:x', ip })).json()) as any;
        const res = await admin(`/admin/comments/${c.id}/ban-ip`, { reason: 'flood', deleteComment: true });
        expect(res.status).toBe(200);
        // Same network, different DID, is now blocked.
        expect((await post({ postId: POST, body: 'evade' }, { did: 'did:plc:y', ip })).status).toBe(403);
    });
});

describe('moderation gate + kill switches', () => {
    it('rejects admin actions from non-admins', async () => {
        const res = await admin('/admin/ban', { type: 'did', subject: 'did:plc:z' }, 'did:plc:notadmin');
        expect(res.status).toBe(403);
    });

    it('toggles comments per-post', async () => {
        expect((await admin(`/admin/posts/${POST}`, { enabled: false })).status).toBe(200);
        expect((await post({ postId: POST, body: 'blocked' }, { did: 'did:plc:a' })).status).toBe(403);
        expect((await admin(`/admin/posts/${POST}`, { enabled: true })).status).toBe(200);
        expect((await post({ postId: POST, body: 'ok' }, { did: 'did:plc:a' })).status).toBe(201);
    });

    it('toggles comments globally', async () => {
        expect((await admin('/admin/global', { enabled: false })).status).toBe(200);
        expect((await post({ postId: 'AnyPost', body: 'x' }, { did: 'did:plc:a' })).status).toBe(403);
        expect((await admin('/admin/global', { enabled: true })).status).toBe(200);
        expect((await post({ postId: 'AnyPost', body: 'x' }, { did: 'did:plc:a' })).status).toBe(201);
    });
});
