import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-plugin';

// Runs the Worker against a local miniflare D1, with the real migrations applied
// before each suite. No remote Cloudflare auth needed.
export default defineConfig(async () => {
    const migrations = await readD1Migrations(path.join(import.meta.dirname, 'migrations'));
    return {
        plugins: [
            cloudflareTest({
                miniflare: {
                    // Test-only bindings layered over wrangler.toml [vars].
                    bindings: {
                        TEST_MIGRATIONS: migrations,
                        DEV_AUTH: '1',
                        ADMIN_DID: 'did:plc:admin',
                        IP_HASH_SALT: 'test-salt',
                        LOGIN_GRANTS_TOKEN: 'test-grants-token',
                    },
                },
                wrangler: { configPath: './wrangler.toml' },
            }),
        ],
        test: {
            setupFiles: ['./test/apply-migrations.ts'],
        },
    };
});
