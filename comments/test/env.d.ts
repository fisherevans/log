/// <reference types="@cloudflare/vitest-pool-workers" />
import type { D1Migration } from '@cloudflare/vitest-pool-workers/config';

declare module 'cloudflare:test' {
    interface ProvidedEnv {
        DB: D1Database;
        TEST_MIGRATIONS: D1Migration[];
        ADMIN_DID: string;
        DEV_AUTH: string;
        IP_HASH_SALT: string;
        ALLOWED_ORIGIN: string;
        PUBLIC_URL: string;
    }
}
