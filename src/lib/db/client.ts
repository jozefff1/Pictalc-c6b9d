import { neon, Pool } from '@neondatabase/serverless';
import { drizzle as drizzleHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePool } from 'drizzle-orm/neon-serverless';
import { sql } from 'drizzle-orm';
import * as schema from './schema';

// ── Primary client (neon-http) ────────────────────────────────────────────────
// Used by all existing API routes. Lightweight, edge-compatible, no transactions.
const neonSql = neon(process.env.DATABASE_URL ?? '');
export const db = drizzleHttp(neonSql, { schema });

// ── Transaction-capable client (neon-serverless Pool) ────────────────────────
// Required by withTenantContext for Phase 9 RLS-protected routes.
// Lazy-initialised so it does not open connections on cold starts of non-tenant routes.
let _pool: Pool | null = null;
function getPool(): Pool {
  if (!_pool) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL ?? '' });
  }
  return _pool;
}

const poolDb = () => drizzlePool(getPool(), { schema });

// ── withTenantContext ─────────────────────────────────────────────────────────
// Wraps any DB operation inside a transaction that first sets the
// app.current_tenant_id Postgres config variable, activating all
// tenant_isolation pgPolicy rules. MUST be used for every query on
// RLS-protected tables once Phase 9 migration is applied.
//
// Usage:
//   const data = await withTenantContext(tenantId, (tx) => tx.select().from(pairings));
export async function withTenantContext<T>(
  tenantId: string,
  operation: (tx: ReturnType<typeof poolDb>) => Promise<T>
): Promise<T> {
  return await poolDb().transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.current_tenant_id', ${tenantId}, true)`
    );
    return await operation(tx as unknown as ReturnType<typeof poolDb>);
  });
}
