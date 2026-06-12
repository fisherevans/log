import { applyD1Migrations, env } from 'cloudflare:test';

// Apply migrations/*.sql to the test D1 before any suite runs.
await applyD1Migrations(env.DB, env.TEST_MIGRATIONS);
