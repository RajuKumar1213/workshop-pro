import { pgTable, text, timestamp, varchar, doublePrecision, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { customers } from "./customers";
import { orderAttachments } from "./order-attachments";
import { orderActivities } from "./order-activities";
import { canvasLayouts } from "./canvas";

export const statuses = pgTable("statuses", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  name: text("name").notNull(),
  color: varchar("color", { length: 20 }),
  sequence: doublePrecision("sequence").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  customerId: varchar("customer_id", { length: 36 }).references(() => customers.id),
  statusId: varchar("status_id", { length: 36 }).references(() => statuses.id),
  priority: varchar("priority", { length: 20 }).default("normal"), // low, normal, high, urgent
  rateType: varchar("rate_type", { length: 20 }), // per_kg, per_sqft, fixed
  estimatedRate: doublePrecision("estimated_rate"),
  advanceAmount: doublePrecision("advance_amount").default(0),
  discount: doublePrecision("discount").default(0),
  expectedWeight: doublePrecision("expected_weight"),
  estimatedAmount: doublePrecision("estimated_amount"),
  deadline: timestamp("deadline"),
  remarks: text("remarks"),
  internalNotes: text("internal_notes"),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const orderItems = pgTable("order_items", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  orderId: varchar("order_id", { length: 36 }).references(() => orders.id).notNull(),
  productType: varchar("product_type", { length: 100 }), // Main Gate, Window, etc.
  category: varchar("category", { length: 100 }),
  previewImageId: varchar("preview_image_id", { length: 255 }),
  designData: jsonb("design_data"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  orderId: varchar("order_id", { length: 36 }).references(() => orders.id).notNull(),
  amount: doublePrecision("amount").notNull(),
  method: varchar("method", { length: 50 }), // Cash, UPI, Bank Transfer
  status: varchar("status", { length: 50 }).default("completed"),
  referenceNumber: varchar("reference_number", { length: 100 }),
  date: timestamp("date").defaultNow().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const ordersRelations = relations(orders, ({ one, many }) => ({
  customer: one(customers, {
    fields: [orders.customerId],
    references: [customers.id],
  }),
  status: one(statuses, {
    fields: [orders.statusId],
    references: [statuses.id],
  }),
  items: many(orderItems),
  payments: many(payments),
  attachments: many(orderAttachments),
  activities: many(orderActivities),
}));

export const orderItemsRelations = relations(orderItems, ({ one, many }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  canvasLayouts: many(canvasLayouts),
}));

export const statusesRelations = relations(statuses, ({ many }) => ({
  orders: many(orders),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
}));
