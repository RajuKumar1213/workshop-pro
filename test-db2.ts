import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './drizzle/schema';
import { eq } from 'drizzle-orm';
import { productMasters } from './drizzle/schema/product-masters';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const db = drizzle(pool, { schema });

async function test() {
  try {
    const existing = await db.query.productMasters.findFirst({
      where: eq(productMasters.category, 'Window')
    });
    console.log("Success:", existing);
  } catch (error) {
    console.error("Error:");
    console.error(error);
  } finally {
    await pool.end();
  }
}

test();
