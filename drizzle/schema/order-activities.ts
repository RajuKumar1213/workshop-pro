import { pgTable, text, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./orders";

export const orderActivities = pgTable("order_activities", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  orderId: varchar("order_id", { length: 36 }).references(() => orders.id).notNull(),
  userId: varchar("user_id", { length: 36 }).notNull(),
  action: varchar("action", { length: 100 }).notNull(), // Created, StatusChanged, CanvasUpdated, ImageUploaded, PaymentAdded
  details: jsonb("details"), // generic payload
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderActivitiesRelations = relations(orderActivities, ({ one }) => ({
  order: one(orders, {
    fields: [orderActivities.orderId],
    references: [orders.id],
  }),
}));
