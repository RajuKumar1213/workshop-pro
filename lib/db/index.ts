import 'server-only';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/drizzle/schema';

/**
 * Workshop database client (Drizzle ORM).
 *
 * This connects to the WORKSHOP-SPECIFIC PostgreSQL database (workshop_db).
 * It is separate from the authorization-service database.
 *
 * This module is marked `server-only` — it will throw a build error
 * if accidentally imported in a Client Component.
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle database client:', err);
});

export const db = drizzle(pool, { schema });

export type Database = typeof db;
