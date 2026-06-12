// Small HTTP helpers: JSON responses, error shaping, and CORS. No framework - the
// router in index.ts is a hand-rolled switch, which is plenty for this surface.
import type { Env } from './env';

export class HttpError extends Error {
    status: number;
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
    }
}

// CORS headers for a cross-origin call from the blog. The API uses cookies for
// the session, so the origin must be echoed explicitly (not "*") and credentials
// allowed. Requests from any other origin get no CORS headers (browser blocks).
export function corsHeaders(env: Env, request: Request): Record<string, string> {
    const origin = request.headers.get('Origin');
    if (origin && origin === env.ALLOWED_ORIGIN) {
        return {
            'Access-Control-Allow-Origin': origin,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, X-Dev-Did, X-Dev-Handle',
            Vary: 'Origin',
        };
    }
    return {};
}

export function json(data: unknown, init: ResponseInit = {}, extra: Record<string, string> = {}): Response {
    return new Response(JSON.stringify(data), {
        ...init,
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            ...(init.headers as Record<string, string> | undefined),
            ...extra,
        },
    });
}

// Flatten an Error and its (non-enumerable) .cause chain into one string, so the
// real failure is visible in `wrangler tail` instead of just the top message.
export function errorChain(err: unknown): string {
    const parts: string[] = [];
    let cur: unknown = err;
    for (let i = 0; cur instanceof Error && i < 5; i++) {
        parts.push(`${cur.name}: ${cur.message}`);
        cur = (cur as { cause?: unknown }).cause;
    }
    return parts.join(' <- ') || String(err);
}

export function errorResponse(err: unknown, cors: Record<string, string>): Response {
    if (err instanceof HttpError) {
        return json({ error: err.message }, { status: err.status }, cors);
    }
    console.error('unhandled error', errorChain(err), (err as Error)?.stack);
    return json({ error: 'internal error' }, { status: 500 }, cors);
}

// Parse a JSON body, capped in size to keep abusive payloads cheap to reject.
export async function readJson<T>(request: Request, maxBytes = 16 * 1024): Promise<T> {
    const text = await request.text();
    if (text.length > maxBytes) {
        throw new HttpError(413, 'payload too large');
    }
    try {
        return JSON.parse(text) as T;
    } catch {
        throw new HttpError(400, 'invalid JSON');
    }
}

// The submitter's IP, from Cloudflare's connecting-IP header.
export function clientIp(request: Request): string {
    return request.headers.get('CF-Connecting-IP') ?? '';
}
