import 'server-only';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/drizzle/schema';
import type { InferInsertModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

type OrderInsert = InferInsertModel<typeof orders>;
type OrderItemInsert = InferInsertModel<typeof orderItems>;

export class OrderRepository {
  static async create(orderData: Omit<OrderInsert, 'id'>, itemsData: Omit<OrderItemInsert, 'id' | 'orderId'>[]) {
    return await db.transaction(async (tx) => {
      const orderId = uuidv4();
      const [order] = await tx
        .insert(orders)
        .values({ ...orderData, id: orderId })
        .returning();

      if (itemsData.length > 0) {
        const itemsToInsert = itemsData.map((item) => ({
          ...item,
          id: uuidv4(),
          orderId: order.id,
        }));
        await tx.insert(orderItems).values(itemsToInsert);
      }

      return order;
    });
  }

  static async findById(id: string) {
    return db.query.orders.findFirst({
      where: (t, { eq }) => eq(t.id, id),
      with: {
        customer: true,
        items: true,
        status: true,
      },
    });
  }
}
