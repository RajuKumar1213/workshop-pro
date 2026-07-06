import { pgTable, uuid, varchar, jsonb, text, timestamp, unique } from 'drizzle-orm/pg-core';

/**
 * Key-value store for workshop configuration settings.
 *
 * Examples:
 * - key: "workshop.name", value: "Raju Iron Works"
 * - key: "workshop.gst", value: "29ABCDE1234F2Z5"
 * - key: "workshop.logo_url", value: "https://res.cloudinary.com/..."
 * - key: "billing.currency", value: "INR"
 */
export const workshopSettings = pgTable(
  'workshop_settings',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    key: varchar('key', { length: 255 }).notNull(),
    value: jsonb('value').notNull(),
    description: text('description'),
    updatedBy: uuid('updated_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => [unique().on(table.key)]
);
