import { describe, expect, it } from 'vitest';
// Importing atproto applies the global Request shim as a module-load side effect.
import '../src/atproto';

// The atproto OAuth resolver libs construct Requests with `redirect: 'error'` and
// `cache: 'no-store'`, both of which the Workers runtime rejects at construction
// time. The shim in src/atproto.ts coerces/strips them so the OAuth dance runs on
// the edge. These tests run under the same workerd runtime as production, so they
// pin the exact construction that used to throw "Invalid redirect value" /
// "The 'cache' field ... is not implemented".
describe('Workers Request shim', () => {
    it('coerces redirect:error -> manual and strips the unsupported cache field', () => {
        const req = new Request('https://example.com', {
            redirect: 'error',
            cache: 'no-store',
        } as RequestInit);
        expect(req.redirect).toBe('manual');
        expect(req.url).toBe('https://example.com/');
    });

    it('strips cache even when redirect is not set', () => {
        const req = new Request('https://example.com', { cache: 'no-store' } as RequestInit);
        expect(req.url).toBe('https://example.com/');
    });

    it('leaves ordinary requests untouched', () => {
        const req = new Request('https://example.com', { method: 'POST' });
        expect(req.method).toBe('POST');
        expect(req.redirect).toBe('follow');
    });
});
