import 'server-only';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/drizzle/schema';
import type { InferInsertModel } from 'drizzle-orm';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

type OrderInsert = InferInsertModel<typeof orders>;
type OrderItemInsert = InferInsertModel<typeof orderItems>;

export class OrderRepository {
  static async create(orderData: Omit<OrderInsert, 'id'>, itemsData: any[]) {
    return await db.transaction(async (tx) => {
      const orderId = uuidv4();
      const [order] = await tx
        .insert(orders)
        .values({ ...orderData, id: orderId })
        .returning();

      if (itemsData.length > 0) {
        const itemsToInsert = itemsData.map((item) => ({
          id: uuidv4(),
          orderId: order.id,
          productType: item.product?.category || null,
          category: item.product?.category || null,
          previewImageId: item.product?.imageUrl || null,
          designData: item.design ? item.design : {},
        }));
        await tx.insert(orderItems).values(itemsToInsert);
      }

      return order;
    });
  }

  static async findById(id: string) {
    const order = await db.query.orders.findFirst({
      where: (t, { eq }) => eq(t.id, id),
      with: {
        customer: true,
        items: true,
        status: true,
      },
    });

    if (order && order.items) {
      // Map backend structure back to frontend structure
      order.items = order.items.map((item: any) => ({
        id: item.id,
        product: {
          category: item.category,
          imageUrl: item.previewImageId,
        },
        design: item.designData || {},
      })) as any;
    }
    
    return order;
  }

  static async update(id: string, orderData: Partial<Omit<OrderInsert, 'id'>>, itemsData?: any[]) {
    return await db.transaction(async (tx) => {
      let order;
      if (Object.keys(orderData).length > 0) {
        const [updated] = await tx
          .update(orders)
          .set({ ...orderData, updatedAt: new Date() })
          .where(eq(orders.id, id))
          .returning();
        order = updated;
      } else {
        order = await tx.query.orders.findFirst({ where: eq(orders.id, id) });
      }

      if (itemsData !== undefined) {
        // Simple strategy: delete existing items and insert new ones
        // In a more complex app, we might want to diff them, but for draft orders this is fine.
        await tx.delete(orderItems).where(eq(orderItems.orderId, id));
        if (itemsData.length > 0) {
          const itemsToInsert = itemsData.map((item) => ({
            id: item.id && item.id.length === 36 ? item.id : uuidv4(),
            orderId: id,
            productType: item.product?.category || null,
            category: item.product?.category || null,
            previewImageId: item.product?.imageUrl || null,
            designData: item.design ? item.design : {},
          }));
          await tx.insert(orderItems).values(itemsToInsert);
        }
      }

      return order;
    });
  }
}
