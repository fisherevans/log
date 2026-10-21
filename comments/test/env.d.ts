/// <reference types="@cloudflare/vitest-plugin/types" />
import type { D1Migration } from '@cloudflare/vitest-plugin';

// Test bindings, typed onto the global Cloudflare.Env that `cloudflare:test`'s
// `env` (and `cloudflare:workers`) exposes.
declare global {
    namespace Cloudflare {
        interface Env {
            DB: D1Database;
            TEST_MIGRATIONS: D1Migration[];
            ADMIN_DID: string;
            DEV_AUTH: string;
            IP_HASH_SALT: string;
            ALLOWED_ORIGIN: string;
            PUBLIC_URL: string;
        }
    }
}
