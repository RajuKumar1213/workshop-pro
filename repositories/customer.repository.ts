import 'server-only';
import { db } from '@/lib/db';
import { customers } from '@/drizzle/schema';
import type { InferInsertModel } from 'drizzle-orm';
import { eq, ilike, or } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

type CustomerInsert = InferInsertModel<typeof customers>;

export class CustomerRepository {
  static async create(input: Omit<CustomerInsert, 'id'>) {
    const id = uuidv4();
    const [customer] = await db
      .insert(customers)
      .values({ ...input, id })
      .returning();
    return customer;
  }

  static async findById(id: string) {
    return db.query.customers.findFirst({
      where: (t, { eq }) => eq(t.id, id),
    });
  }

  static async search(query: string, limit = 10) {
    return db.query.customers.findMany({
      where: (t) =>
        or(
          ilike(t.name, `%${query}%`),
          ilike(t.mobile, `%${query}%`)
        ),
      limit,
    });
  }
}
