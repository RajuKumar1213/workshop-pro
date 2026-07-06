import { pgTable, text, timestamp, varchar, boolean } from "drizzle-orm/pg-core";

export const designTemplates = pgTable("design_templates", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  category: varchar("category", { length: 100 }).notNull(), // Channel Gate, Main Gate, etc.
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  previewImageId: varchar("preview_image_id", { length: 36 }),
  isCustom: boolean("is_custom").default(false), // Custom designs uploaded by user
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
