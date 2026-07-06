import { pgTable, text, timestamp, varchar, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { orders } from "./orders";

export const orderAttachments = pgTable("order_attachments", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  orderId: varchar("order_id", { length: 36 }).references(() => orders.id).notNull(),
  fileId: varchar("file_id", { length: 36 }).notNull(), // reference to the global files table (Cloudinary info)
  type: varchar("type", { length: 50 }).notNull(), // Site, CurrentGate, Wall, Measurement, Reference, FinishedSample, VoiceNote
  url: text("url").notNull(),
  isVoiceNote: boolean("is_voice_note").default(false),
  size: doublePrecision("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const orderAttachmentsRelations = relations(orderAttachments, ({ one }) => ({
  order: one(orders, {
    fields: [orderAttachments.orderId],
    references: [orders.id],
  }),
}));
