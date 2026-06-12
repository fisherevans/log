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
import { handleCreate, handleDelete, handleList } from './comments';

export default {
    async fetch(request: Request, env: Env, _ctx: ExecutionContext): Promise<Response> {
        const cors = corsHeaders(env, request);

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

            if (path === '/comments') {
                if (request.method === 'GET') {
                    return json(await handleList(request, env), {}, cors);
                }
                if (request.method === 'POST') {
                    const body = await readJson<Parameters<typeof handleCreate>[2]>(request);
                    return json(await handleCreate(request, env, body), { status: 201 }, cors);
                }
            }

            const del = path.match(/^\/comments\/([A-Za-z0-9]+)$/);
            if (del && request.method === 'DELETE') {
                return json(await handleDelete(request, env, del[1]), {}, cors);
            }

            return json({ error: 'not found' }, { status: 404 }, cors);
        } catch (err) {
            return errorResponse(err, cors);
        }
    },
} satisfies ExportedHandler<Env>;
