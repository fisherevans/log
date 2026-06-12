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
import { addGrant, listGrants, removeGrant, resolveSubjectAndGroups, setPrincipalSubject } from './db';

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
    for (const g of body.groups ?? []) {
        const group = g.trim();
        if (group) await removeGrant(env.DB, did, group);
    }
    return { ok: true, ...(await resolveSubjectAndGroups(env.DB, did)) };
}
