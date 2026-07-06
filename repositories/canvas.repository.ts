import 'server-only';
import { db } from '@/lib/db';
import { canvasLayouts, canvasObjects, measurements } from '@/drizzle/schema';
import type { InferInsertModel } from 'drizzle-orm';
import { eq, inArray } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';

type LayoutInsert = InferInsertModel<typeof canvasLayouts>;
type ObjectInsert = InferInsertModel<typeof canvasObjects>;
type MeasurementInsert = InferInsertModel<typeof measurements>;

export class CanvasRepository {
  /**
   * Bulk upserts a layout with all its objects and measurements.
   * To keep it simple, this deletes existing objects for the layout and recreates them.
   */
  static async saveLayout(
    layoutData: Omit<LayoutInsert, 'id'> & { id?: string },
    objectsData: (Omit<ObjectInsert, 'id' | 'layoutId'> & { id?: string; measurements?: Omit<MeasurementInsert, 'id' | 'objectId'>[] })[]
  ) {
    return await db.transaction(async (tx) => {
      // 1. Upsert Layout
      const layoutId = layoutData.id || uuidv4();
      let layout;
      if (layoutData.id) {
        [layout] = await tx
          .update(canvasLayouts)
          .set({ ...layoutData, updatedAt: new Date() })
          .where(eq(canvasLayouts.id, layoutId))
          .returning();
      } else {
        [layout] = await tx
          .insert(canvasLayouts)
          .values({ ...layoutData, id: layoutId })
          .returning();
      }

      // 2. Clear existing objects & measurements for this layout
      const existingObjects = await tx.query.canvasObjects.findMany({
        where: eq(canvasObjects.layoutId, layoutId),
        columns: { id: true },
      });
      const existingObjectIds = existingObjects.map(o => o.id);
      
      if (existingObjectIds.length > 0) {
        await tx.delete(measurements).where(inArray(measurements.objectId, existingObjectIds));
        await tx.delete(canvasObjects).where(eq(canvasObjects.layoutId, layoutId));
      }

      // 3. Insert Objects & Measurements
      for (const obj of objectsData) {
        const objectId = obj.id || uuidv4();
        const { measurements: objMeasurements, ...objData } = obj;
        
        await tx.insert(canvasObjects).values({
          ...objData,
          id: objectId,
          layoutId,
        });

        if (objMeasurements && objMeasurements.length > 0) {
          const measurementsToInsert = objMeasurements.map(m => ({
            ...m,
            id: uuidv4(),
            objectId,
          }));
          await tx.insert(measurements).values(measurementsToInsert);
        }
      }

      return layout;
    });
  }

  static async getLayoutByOrderItemId(orderItemId: string) {
    return db.query.canvasLayouts.findFirst({
      where: (t, { eq }) => eq(t.orderItemId, orderItemId),
      with: {
        objects: {
          with: {
            measurements: true,
          }
        }
      }
    });
  }
}
