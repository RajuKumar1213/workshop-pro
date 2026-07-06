import { pgTable, text, timestamp, varchar, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./orders";

export const customers = pgTable("customers", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  name: text("name").notNull(),
  mobile: varchar("mobile", { length: 20 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 20 }),
  alternativeMobile: varchar("alternative_mobile", { length: 20 }),
  address: text("address"),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  gst: varchar("gst", { length: 50 }),
  notes: text("notes"),
  createdBy: varchar("created_by", { length: 36 }),
  updatedBy: varchar("updated_by", { length: 36 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
});

export const customersRelations = relations(customers, ({ many }) => ({
  orders: many(orders),
}));
