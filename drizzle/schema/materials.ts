import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const materials = pgTable("materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull().unique(), // e.g. 'Mild Steel (MS)'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
