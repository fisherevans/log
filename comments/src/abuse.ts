// Layered abuse controls for comment creation, cheapest-first (issue #4):
//   1. Turnstile  - Cloudflare's bot wall (skipped when no secret is configured)
//   2. Ban lists  - DID and IP, checked on every submit
//   3. Rate limit - per-IP hourly + per-DID daily
//   4. Progressive trust - a new DID is capped until it earns trust
//
// enforceAbuse throws an HttpError (403/429) to reject; returning means allowed.
import type { Env } from './env';
import { HttpError } from './http';
import type { Identity } from './identity';
import { requireTurnstile } from './turnstile';
import {
    countByDidSince,
    countByIpSince,
    getReputation,
    isBanned,
    lifetimeCountByDid,
    recordFirstSeen,
} from './db';

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Tunables. Anyone Bluesky-logged-in is "valid", so these are the real ceiling.
const IP_HOURLY_CAP = 15; // comments per IP per rolling hour
const NEW_DID_DAILY_CAP = 5; // untrusted DID: comments per rolling day
const TRUSTED_DID_DAILY_CAP = 100; // trusted DID: comments per rolling day
// Lifetime comments that earn trust. Kept well above the new-account daily cap so
// a brand-new DID must build a track record across several days before the cap
// lifts (most real commenters clear the account-age path immediately instead).
const TRUST_MIN_COMMENTS = 15;
const TRUST_MIN_AGE_MS = 30 * DAY; // Bluesky account age that earns trust

export interface AbuseResult {
    trusted: boolean;
}

export async function enforceAbuse(
    env: Env,
    identity: Identity,
    ipHash: string | null,
    turnstileToken: string | undefined,
    remoteIp: string,
): Promise<AbuseResult> {
    const now = Date.now();

    // 1. Turnstile (no-op when no secret is configured).
    await requireTurnstile(env, turnstileToken, remoteIp);

    // 2. Bans.
    if (await isBanned(env.DB, identity.did, ipHash, now)) {
        throw new HttpError(403, 'you are not permitted to comment');
    }

    // 3. Per-IP rate (only when we have a hashed IP).
    if (ipHash) {
        const recentIp = await countByIpSince(env.DB, ipHash, now - HOUR);
        if (recentIp >= IP_HOURLY_CAP) throw new HttpError(429, 'too many comments from your network, slow down');
    }

    // 4. Progressive trust + per-DID daily cap.
    const trusted = await isTrusted(env, identity.did, now);
    const cap = trusted ? TRUSTED_DID_DAILY_CAP : NEW_DID_DAILY_CAP;
    const recentDid = await countByDidSince(env.DB, identity.did, now - DAY);
    if (recentDid >= cap) {
        throw new HttpError(429, trusted ? 'daily comment limit reached' : 'new accounts are limited; try again tomorrow');
    }

    // Record first sighting (and capture account age if known) for future trust.
    await recordFirstSeen(env.DB, identity.did, now, identity.accountCreatedAt ?? null);

    return { trusted };
}

// A DID is trusted once it has enough history here, or its Bluesky account is old
// enough. Until then it sits under the new-account cap.
async function isTrusted(env: Env, did: string, now: number): Promise<boolean> {
    if (did === env.ADMIN_DID) return true;
    const lifetime = await lifetimeCountByDid(env.DB, did);
    if (lifetime >= TRUST_MIN_COMMENTS) return true;
    const rep = await getReputation(env.DB, did);
    if (rep?.account_created_at && now - rep.account_created_at >= TRUST_MIN_AGE_MS) return true;
    return false;
}
