// Email subscribe (issue #7). A native intake form posts here; emails land in the
// D1 `subscribers` table, Turnstile-gated so bots can't stuff it. Buttondown is
// deferred - this is the interim own-store, exported manually later. No send
// automation here; this only collects addresses.
import type { Env } from './env';
import { HttpError, clientIp } from './http';
import { requireTurnstile } from './turnstile';
import { hashIp } from './hash';
import { addSubscriber } from './db';

const MAX_EMAIL = 254; // RFC 5321 practical max
// Deliberately permissive: one @, a dot in the domain, no whitespace. The real
// validation is a confirmation send later; this just rejects obvious garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface SubscribeBody {
    email?: string;
    turnstileToken?: string;
}

// POST /subscribe  ->  { ok, alreadySubscribed }
export async function handleSubscribe(request: Request, env: Env, body: SubscribeBody): Promise<unknown> {
    const ip = clientIp(request);
    await requireTurnstile(env, body.turnstileToken, ip);

    const email = (body.email ?? '').trim().toLowerCase();
    if (!email || email.length > MAX_EMAIL || !EMAIL_RE.test(email)) {
        throw new HttpError(400, 'enter a valid email address');
    }

    const ipHash = await hashIp(env, ip);
    const inserted = await addSubscriber(env.DB, email, Date.now(), ipHash);
    // Idempotent + privacy-preserving: re-subscribing isn't an error and we don't
    // leak whether the address was already on the list.
    return { ok: true, alreadySubscribed: !inserted };
}
