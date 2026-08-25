// Grants API (auth pivot, Phase 0). The DID-keyed authorization store has two
// audiences:
//   - The k3s login app calls GET /admin/grants/resolve?did=... (bearer
//     LOGIN_GRANTS_TOKEN) to turn a verified Bluesky DID into {subject, groups}
//     when it mints an admin OIDC token. This is the only cross-system dependency
//     (admin Bluesky login depends on this Worker; the password break-glass does
//     not, so it's the covered fallback).
//   - A DevOps agent (or Fisher) manages grants via the admin-gated CRUD
//     endpoints (requireAdmin = Fisher's Bluesky session).
import type { Env } from './env';
import { HttpError } from './http';
import { requireAdmin } from './moderation';
import {
    addGrant,
    listGrants,
    removeGrant,
    resolveClaimsBySubject,
    resolveSubjectAndGroups,
    setPrincipalProfile,
    setPrincipalSubject,
} from './db';

// Constant-time bearer check for the login app's resolve call.
function bearerOk(request: Request, expected: string | undefined): boolean {
    if (!expected) return false;
    const header = request.headers.get('Authorization') ?? '';
    const got = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (got.length !== expected.length) return false;
    let diff = 0;
    for (let i = 0; i < got.length; i++) diff |= got.charCodeAt(i) ^ expected.charCodeAt(i);
    return diff === 0;
}

// GET /admin/grants/resolve?did=...  ->  {subject, groups}   (login app, bearer)
export async function handleResolveGrant(request: Request, env: Env): Promise<unknown> {
    if (!bearerOk(request, env.LOGIN_GRANTS_TOKEN)) throw new HttpError(401, 'invalid grants token');
    const did = new URL(request.url).searchParams.get('did')?.trim();
    if (!did) throw new HttpError(400, 'did required');
    return await resolveSubjectAndGroups(env.DB, did);
}

// GET /admin/grants/claims?subject=...  ->  {subject, email, name, groups}
//
// The login app calls this at consent time to build an ID token. It is keyed by
// subject rather than DID because that is all the consent request carries.
//
// A 404 here is meaningful, not an error: it means "no principal for this
// subject", which tells the login app to fall back to its local users.json. That
// fallback is what keeps the password break-glass account working when this
// Worker is unreachable, so do not turn this into a 200-with-empty-body.
export async function handleResolveClaims(request: Request, env: Env): Promise<unknown> {
    if (!bearerOk(request, env.LOGIN_GRANTS_TOKEN)) throw new HttpError(401, 'invalid grants token');
    const subject = new URL(request.url).searchParams.get('subject')?.trim();
    if (!subject) throw new HttpError(400, 'subject required');
    const claims = await resolveClaimsBySubject(env.DB, subject);
    if (!claims) throw new HttpError(404, 'no principal for that subject');
    return claims;
}

// GET /admin/grants[?did=...]   (admin) - list provisioned principals + groups
export async function handleListGrants(request: Request, env: Env): Promise<unknown> {
    await requireAdmin(request, env);
    const did = new URL(request.url).searchParams.get('did')?.trim() || undefined;
    return { grants: await listGrants(env.DB, did) };
}

interface GrantBody {
    did?: string;
    subject?: string;
    groups?: string[];
    email?: string;
    name?: string;
}

// POST /admin/grants   body {did, subject?, groups?}   (admin)
// Upserts the DID -> subject mapping (if subject given) and adds each group.
export async function handleAddGrant(request: Request, env: Env, body: GrantBody): Promise<unknown> {
    await requireAdmin(request, env);
    const did = (body.did ?? '').trim();
    if (!did) throw new HttpError(400, 'did required');
    const now = Date.now();
    if (body.subject != null) {
        const subject = body.subject.trim();
        if (!subject) throw new HttpError(400, 'subject must be non-empty');
        await setPrincipalSubject(env.DB, did, subject, now);
    }
    if (body.email != null || body.name != null) {
        await setPrincipalProfile(env.DB, did, body.email?.trim() || null, body.name?.trim() || null, now);
    }
    for (const g of body.groups ?? []) {
        const group = g.trim();
        if (group) await addGrant(env.DB, did, group, now);
    }
    return { ok: true, ...(await resolveSubjectAndGroups(env.DB, did)) };
}

// DELETE /admin/grants   body {did, groups?}   (admin) - remove the listed groups
export async function handleRemoveGrant(request: Request, env: Env, body: GrantBody): Promise<unknown> {
    await requireAdmin(request, env);
    const did = (body.did ?? '').trim();
    if (!did) throw new HttpError(400, 'did required');
    // Deliberately no profile write here. DELETE revokes group grants; wiping
    // someone's name and email as a side effect of a revoke would be surprising,
    // and it would lose data that is not recoverable from anywhere else.
    for (const g of body.groups ?? []) {
        const group = g.trim();
        if (group) await removeGrant(env.DB, did, group);
    }
    return { ok: true, ...(await resolveSubjectAndGroups(env.DB, did)) };
}
