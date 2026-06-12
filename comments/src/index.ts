// log.fisher.sh comments backend - a Cloudflare Worker over D1.
//
// Routing is a hand-rolled switch; the surface is small. Identity comes from a
// Bluesky OAuth session (issue #3), abuse controls + moderation from issue #4,
// DataDog observability from issue #6, and email subscribe from issue #7. Each
// of those mounts additional routes here.
//
//   GET    /comments?post_id=...   list a post's thread (public)
//   POST   /comments               create a comment (auth)
//   DELETE /comments/:id           delete own comment, or admin
//   GET    /health                 liveness
import type { Env } from './env';
import { corsHeaders, errorResponse, json, readJson } from './http';
import { handleCreate, handleDelete, handleEdit, handleList } from './comments';
import {
    handleBan,
    handleBanCommentIp,
    handleStatus,
    handleTogglePost,
    handleToggleGlobal,
    handleUnban,
} from './moderation';
import { handleAddGrant, handleListGrants, handleRemoveGrant, handleResolveGrant } from './grants';
import { handleSubscribe } from './subscribe';
import { Telemetry } from './datadog';
import {
    handleCallback,
    handleClientMetadata,
    handleDevLogin,
    handleJwks,
    handleLogin,
    handleLogout,
    handleMe,
} from './atproto';

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const cors = corsHeaders(env, request);
        const telemetry = new Telemetry(env, ctx);

        // CORS preflight.
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: cors });
        }

        const url = new URL(request.url);
        const path = url.pathname.replace(/\/+$/, '') || '/';

        try {
            if (request.method === 'GET' && path === '/health') {
                return json({ ok: true }, {}, cors);
            }

            // --- Bluesky OAuth (issue #3) ------------------------------------
            // Browser-redirect endpoints (login/callback/metadata/jwks) are
            // top-level navigations, not CORS fetches. /me and /logout are called
            // by the blog UI cross-origin, so they carry CORS headers.
            if (request.method === 'GET') {
                if (path === '/oauth/client-metadata.json') return await handleClientMetadata(env);
                if (path === '/oauth/jwks.json') return await handleJwks(env);
                if (path === '/oauth/login') return await handleLogin(request, env);
                if (path === '/oauth/callback') return await handleCallback(request, env);
                if (path === '/oauth/dev-login') return await handleDevLogin(request, env);
                if (path === '/oauth/me') return await handleMe(request, env, cors);
            }
            if (request.method === 'POST' && path === '/oauth/logout') {
                return await handleLogout(request, env, cors);
            }

            // --- grants: DID-keyed authorization store (auth pivot) -----------
            // /resolve is the login app's bearer-gated read; the rest is the
            // admin-gated DevOps management surface.
            if (path === '/admin/grants/resolve' && request.method === 'GET') {
                return json(await handleResolveGrant(request, env), {}, cors);
            }
            if (path === '/admin/grants') {
                if (request.method === 'GET') return json(await handleListGrants(request, env), {}, cors);
                if (request.method === 'POST') {
                    return json(await handleAddGrant(request, env, await readJson(request)), {}, cors);
                }
                if (request.method === 'DELETE') {
                    return json(await handleRemoveGrant(request, env, await readJson(request)), {}, cors);
                }
            }

            if (path === '/comments') {
                if (request.method === 'GET') {
                    return json(await handleList(request, env), {}, cors);
                }
                if (request.method === 'POST') {
                    const body = await readJson<Parameters<typeof handleCreate>[2]>(request);
                    return json(await handleCreate(request, env, body, telemetry), { status: 201 }, cors);
                }
            }

            if (path === '/subscribe' && request.method === 'POST') {
                return json(await handleSubscribe(request, env, await readJson(request)), { status: 201 }, cors);
            }

            const commentId = path.match(/^\/comments\/([A-Za-z0-9]+)$/);
            if (commentId && request.method === 'DELETE') {
                return json(await handleDelete(request, env, commentId[1], telemetry), {}, cors);
            }
            if (commentId && request.method === 'PATCH') {
                return json(await handleEdit(request, env, commentId[1], await readJson(request), telemetry), {}, cors);
            }

            // --- moderation (issue #4), DID-gated admin ----------------------
            if (path === '/admin/status' && request.method === 'GET') {
                const postId = url.searchParams.get('post_id') ?? '';
                return json(await handleStatus(request, env, postId), {}, cors);
            }
            if (request.method === 'POST') {
                if (path === '/admin/ban') {
                    return json(await handleBan(request, env, await readJson(request), telemetry), {}, cors);
                }
                if (path === '/admin/unban') {
                    return json(await handleUnban(request, env, await readJson(request), telemetry), {}, cors);
                }
                if (path === '/admin/global') {
                    return json(await handleToggleGlobal(request, env, await readJson(request), telemetry), {}, cors);
                }
                const banIp = path.match(/^\/admin\/comments\/([A-Za-z0-9]+)\/ban-ip$/);
                if (banIp) {
                    return json(
                        await handleBanCommentIp(request, env, banIp[1], await readJson(request), telemetry),
                        {},
                        cors,
                    );
                }
                const togglePost = path.match(/^\/admin\/posts\/([A-Za-z0-9]+)$/);
                if (togglePost) {
                    return json(
                        await handleTogglePost(request, env, togglePost[1], await readJson(request), telemetry),
                        {},
                        cors,
                    );
                }
            }

            return json({ error: 'not found' }, { status: 404 }, cors);
        } catch (err) {
            return errorResponse(err, cors);
        }
    },
} satisfies ExportedHandler<Env>;
