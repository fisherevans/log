import path from 'node:path';
import { defineWorkersConfig, readD1Migrations } from '@cloudflare/vitest-pool-workers/config';

// Runs the Worker against a local miniflare D1, with the real migrations applied
// before each suite. No remote Cloudflare auth needed.
export default defineWorkersConfig(async () => {
    const migrations = await readD1Migrations(path.join(__dirname, 'migrations'));
    return {
        test: {
            setupFiles: ['./test/apply-migrations.ts'],
            poolOptions: {
                workers: {
                    singleWorker: true,
                    miniflare: {
                        // Test-only bindings layered over wrangler.toml [vars].
                        bindings: {
                            TEST_MIGRATIONS: migrations,
                            DEV_AUTH: '1',
                            ADMIN_DID: 'did:plc:admin',
                            IP_HASH_SALT: 'test-salt',
                        },
                    },
                    wrangler: { configPath: './wrangler.toml' },
                },
            },
        },
    };
});
