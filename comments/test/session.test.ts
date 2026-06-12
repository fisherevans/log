import { SELF, env } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';
import { createSession, destroySession, getSessionIdentity } from '../src/session';

beforeEach(async () => {
    await env.DB.exec('DELETE FROM sessions');
    await env.DB.exec('DELETE FROM comments');
});

function cookieToken(setCookie: string): string {
    return setCookie.split(';')[0].split('=')[1];
}

describe('worker sessions', () => {
    it('round-trips an identity through a session cookie', async () => {
        const setCookie = await createSession(env, {
            did: 'did:plc:alice',
            handle: 'alice.bsky.social',
            displayName: 'Alice',
            avatar: 'https://cdn/av.jpg',
            accountCreatedAt: 1_600_000_000_000,
        });
        expect(setCookie).toContain('HttpOnly');
        expect(setCookie).toContain('SameSite=None');

        const tok = cookieToken(setCookie);
        const req = new Request('https://comments.fisher.sh/', { headers: { Cookie: `cmt_session=${tok}` } });
        const id = await getSessionIdentity(env, req);
        expect(id?.did).toBe('did:plc:alice');
        expect(id?.handle).toBe('alice.bsky.social');
        expect(id?.accountCreatedAt).toBe(1_600_000_000_000);
    });

    it('lets a session cookie authenticate a real comment create (no dev seam)', async () => {
        const setCookie = await createSession(env, {
            did: 'did:plc:bob',
            handle: 'bob.test',
            displayName: 'Bob',
            avatar: null,
            accountCreatedAt: null,
        });
        const tok = cookieToken(setCookie);

        const res = await SELF.fetch('https://comments.fisher.sh/comments', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Cookie: `cmt_session=${tok}` },
            body: JSON.stringify({ postId: 'SessPost01', body: 'via session' }),
        });
        expect(res.status).toBe(201);
        expect(((await res.json()) as any).author.did).toBe('did:plc:bob');
    });

    it('ignores an expired session', async () => {
        await env.DB.prepare(
            `INSERT INTO sessions (token, did, created_at, expires_at) VALUES ('expired', 'did:plc:old', 0, 1)`,
        ).run();
        const req = new Request('https://comments.fisher.sh/', { headers: { Cookie: 'cmt_session=expired' } });
        expect(await getSessionIdentity(env, req)).toBeNull();
    });

    it('destroys a session', async () => {
        const setCookie = await createSession(env, {
            did: 'did:plc:carol',
            handle: null,
            displayName: null,
            avatar: null,
            accountCreatedAt: null,
        });
        const tok = cookieToken(setCookie);
        const req = new Request('https://comments.fisher.sh/', { headers: { Cookie: `cmt_session=${tok}` } });
        const cleared = await destroySession(env, req);
        expect(cleared).toContain('Max-Age=0');
        expect(await getSessionIdentity(env, req)).toBeNull();
    });
});
