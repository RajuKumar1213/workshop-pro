import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const productMasters = pgTable("product_masters", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: varchar("category", { length: 100 }).notNull().unique(), // e.g., 'Main Gate', 'Window Grill'
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const productMasterImages = pgTable("product_master_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  productMasterId: uuid("product_master_id").notNull().references(() => productMasters.id, { onDelete: 'cascade' }),
  imageUrl: text("image_url").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const productMastersRelations = relations(productMasters, ({ many }) => ({
  images: many(productMasterImages),
}));

export const productMasterImagesRelations = relations(productMasterImages, ({ one }) => ({
  productMaster: one(productMasters, {
    fields: [productMasterImages.productMasterId],
    references: [productMasters.id],
  }),
}));
