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

    it('resolve returns null subject + empty groups for an unprovisioned DID', async () => {
        const res = await resolve('did:plc:nobody', GRANTS_TOKEN);
        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ subject: null, groups: [] });
    });

    it('admin management endpoints reject non-admins', async () => {
        expect((await SELF.fetch('https://comments.fisher.sh/admin/grants')).status).toBe(401); // no identity
        expect((await adminReq('POST', '/admin/grants', { did: 'x', groups: ['admin'] }, 'did:plc:nobody')).status).toBe(
            403,
        );
        expect((await adminReq('GET', '/admin/grants')).status).toBe(200); // fallback admin OK
    });
});
