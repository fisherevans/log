// Salted IP hashing. IPs are never stored raw - only as a SHA-256 of
// `${salt}:${ip}`, which is still bannable by hashing an incoming IP and
// comparing. Returns null when no salt is configured (local dev) or no IP is
// present, leaving the column empty.
import type { Env } from './env';

export async function hashIp(env: Env, ip: string): Promise<string | null> {
    if (!ip || !env.IP_HASH_SALT) return null;
    const data = new TextEncoder().encode(`${env.IP_HASH_SALT}:${ip}`);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
