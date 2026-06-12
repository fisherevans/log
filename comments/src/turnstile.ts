// Cloudflare Turnstile verification, shared by comment create (#4) and email
// subscribe (#7). Enforced only when TURNSTILE_SECRET is configured, so local dev
// and tests run without it; production always sets it.
import type { Env } from './env';
import { HttpError } from './http';

interface TurnstileResult {
    success: boolean;
}

// Verify a token against Turnstile's siteverify. Fails closed: any error from the
// verification call itself counts as a failure.
export async function verifyTurnstile(secret: string, token: string, remoteIp: string): Promise<boolean> {
    const body = new FormData();
    body.append('secret', secret);
    body.append('response', token);
    if (remoteIp) body.append('remoteip', remoteIp);
    try {
        const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            body,
        });
        const data = (await res.json()) as TurnstileResult;
        return data.success === true;
    } catch {
        return false;
    }
}

// Throw a 400/403 unless Turnstile passes (or no secret is configured). A no-op
// when TURNSTILE_SECRET is unset.
export async function requireTurnstile(env: Env, token: string | undefined, remoteIp: string): Promise<void> {
    if (!env.TURNSTILE_SECRET) return;
    if (!token) throw new HttpError(400, 'missing Turnstile token');
    if (!(await verifyTurnstile(env.TURNSTILE_SECRET, token, remoteIp))) {
        throw new HttpError(403, 'Turnstile verification failed');
    }
}
