import { SELF, env } from 'cloudflare:test';
import { beforeEach, describe, expect, it } from 'vitest';

// The DID-keyed grant store (auth pivot, Phase 0): admin authZ reads it, the
// login app resolves DID -> {subject, groups} via the bearer-gated endpoint.
const ADMIN = 'did:plc:admin'; // the ADMIN_DID test binding (transitional fallback admin)
const GRANTS_TOKEN = 'test-grants-token'; // matches the LOGIN_GRANTS_TOKEN test binding

function adminReq(method: string, path: string, body?: unknown, did = ADMIN): Promise<Response> {
    return SELF.fetch(`https://comments.fisher.sh${path}`, {
        method,
        headers: { 'Content-Type': 'application/json', 'X-Dev-Did': did },
        body: body == null ? undefined : JSON.stringify(body),
    });
}

function resolve(did: string, token?: string): Promise<Response> {
    return SELF.fetch(`https://comments.fisher.sh/admin/grants/resolve?did=${encodeURIComponent(did)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

beforeEach(async () => {
    await env.DB.exec('DELETE FROM grants');
    await env.DB.exec('DELETE FROM principals');
    await env.DB.exec('DELETE FROM comments');
});

describe('grants store + admin gate', () => {
    it('confers admin via the grant store, not just ADMIN_DID', async () => {
        const friend = 'did:plc:friend';
        // Not provisioned -> not an admin.
        expect((await adminReq('POST', '/admin/global', { enabled: false }, friend)).status).toBe(403);
        // The fallback admin grants friend admin + users.
        const r = await adminReq('POST', '/admin/grants', { did: friend, subject: 'friend', groups: ['admin', 'users'] });
        expect(r.status).toBe(200);
        expect(await r.json()).toMatchObject({ ok: true, subject: 'friend', groups: ['admin', 'users'] });
        // Now friend can moderate.
        expect((await adminReq('POST', '/admin/global', { enabled: false }, friend)).status).toBe(200);
        // Revoking the admin group removes the power (users grant remains).
        expect((await adminReq('DELETE', '/admin/grants', { did: friend, groups: ['admin'] })).status).toBe(200);
        expect((await adminReq('POST', '/admin/global', { enabled: true }, friend)).status).toBe(403);
        const after = (await (await adminReq('GET', '/admin/grants?did=' + friend)).json()) as any;
        expect(after.grants[0].groups).toEqual(['users']);
    });

    it('resolve requires the bearer and returns subject + groups', async () => {
        await adminReq('POST', '/admin/grants', { did: 'did:plc:friend', subject: 'friend', groups: ['close-friends'] });
        expect((await resolve('did:plc:friend')).status).toBe(401); // no bearer
        expect((await resolve('did:plc:friend', 'wrong')).status).toBe(401); // bad bearer
        const res = await resolve('did:plc:friend', GRANTS_TOKEN);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ subject: 'friend', groups: ['close-friends'] });
    });

    it('resolve open-mints a slug subject + empty groups for an unprovisioned DID', async () => {
        // Open mint: an unmapped did:plc:<id> resolves to "bsky-<id>" with no
        // groups, so a brand-new Bluesky user clears the login gate but stays
        // out of every group-gated app until explicitly granted.
        const res = await resolve('did:plc:nobody', GRANTS_TOKEN);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ subject: 'bsky-nobody', groups: [] });
    });

    it('resolve mints a hashed slug for a non-plc DID', async () => {
        const res = await resolve('did:web:example.com', GRANTS_TOKEN);
        const body = (await res.json()) as { subject: string; groups: string[] };
        expect(body.subject).toMatch(/^bsky-[a-f0-9]{24}$/);
        expect(body.groups).toEqual([]);
    });

    it('admin management endpoints reject non-admins', async () => {
        expect((await SELF.fetch('https://comments.fisher.sh/admin/grants')).status).toBe(401); // no identity
        expect((await adminReq('POST', '/admin/grants', { did: 'x', groups: ['admin'] }, 'did:plc:nobody')).status).toBe(
            403,
        );
        expect((await adminReq('GET', '/admin/grants')).status).toBe(200); // fallback admin OK
    });
});

// --- claims-by-subject (#214) -----------------------------------------------
//
// The login app builds an ID token at consent time, where it holds the OIDC
// subject and NOT the originating DID - hence a second, subject-keyed lookup.
// Before this existed, `groups` was resolved here and then discarded: the real
// claims came from a users.json baked into the login pod, so granting someone
// access via this API produced a working login and a token with no groups.

function claims(subject: string, token?: string): Promise<Response> {
    return SELF.fetch(`https://comments.fisher.sh/admin/grants/claims?subject=${encodeURIComponent(subject)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
}

describe('claims by subject', () => {
    it('requires the login bearer, like resolve does', async () => {
        expect((await claims('friend')).status).toBe(401);
        expect((await claims('friend', 'wrong-token')).status).toBe(401);
    });

    it('returns profile + groups for a provisioned subject', async () => {
        await adminReq('POST', '/admin/grants', {
            did: 'did:plc:friend',
            subject: 'friend',
            groups: ['users'],
            email: 'friend@example.com',
            name: 'A Friend',
        });
        const r = await claims('friend', GRANTS_TOKEN);
        expect(r.status).toBe(200);
        expect(await r.json()).toMatchObject({
            subject: 'friend',
            email: 'friend@example.com',
            name: 'A Friend',
            groups: ['users'],
        });
    });

    it('404s an unknown subject, so the login app falls back to users.json', async () => {
        // This is the break-glass path's lifeline: the password account exists
        // only in the login pod's local file, never here. A 200-with-empty-body
        // would look like "known user with no groups" and silently lock it out.
        expect((await claims('nobody-here', GRANTS_TOKEN)).status).toBe(404);
    });

    it('reflects a revoked group on the next call', async () => {
        await adminReq('POST', '/admin/grants', { did: 'did:plc:friend', subject: 'friend', groups: ['admin', 'users'] });
        await adminReq('DELETE', '/admin/grants', { did: 'did:plc:friend', groups: ['admin'] });
        const r = await claims('friend', GRANTS_TOKEN);
        expect(await r.json()).toMatchObject({ groups: ['users'] });
    });

    it('does not wipe the profile when groups are revoked', async () => {
        await adminReq('POST', '/admin/grants', {
            did: 'did:plc:friend',
            subject: 'friend',
            groups: ['admin'],
            email: 'friend@example.com',
            name: 'A Friend',
        });
        await adminReq('DELETE', '/admin/grants', { did: 'did:plc:friend', groups: ['admin'] });
        expect(await (await claims('friend', GRANTS_TOKEN)).json()).toMatchObject({
            email: 'friend@example.com',
            name: 'A Friend',
            groups: [],
        });
    });

    it('unions groups across identities that share a subject', async () => {
        // Account linking: one person, two upstream identities, one subject. The
        // schema allows it today even though nothing writes it yet, so the claims
        // resolver must not pick an arbitrary row and drop the other's groups.
        await adminReq('POST', '/admin/grants', { did: 'did:plc:one', subject: 'linked', groups: ['users'] });
        await adminReq('POST', '/admin/grants', { did: 'did:plc:two', subject: 'linked', groups: ['admin'] });
        expect(await (await claims('linked', GRANTS_TOKEN)).json()).toMatchObject({ groups: ['admin', 'users'] });
    });
});
