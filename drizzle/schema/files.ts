import { pgTable, uuid, varchar, integer, text, timestamp, index } from 'drizzle-orm/pg-core';

/**
 * File/document records.
 * Tracks uploads (future: stored via Cloudinary).
 * Supports soft delete so file metadata is preserved even after deletion.
 */
export const files = pgTable(
  'files',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Display name
    name: varchar('name', { length: 255 }).notNull(),
    originalName: varchar('original_name', { length: 255 }).notNull(),

    // File metadata
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    sizeBytes: integer('size_bytes').notNull(),

    // Storage
    url: text('url').notNull(),
    cloudinaryId: varchar('cloudinary_id', { length: 255 }),

    // Ownership & context
    uploadedBy: uuid('uploaded_by').notNull(),
    module: varchar('module', { length: 100 }), // e.g. 'customers', 'orders'
    entityId: uuid('entity_id'), // e.g. customer UUID this file belongs to

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

    // Soft delete
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('files_uploaded_by_idx').on(table.uploadedBy),
    index('files_module_entity_idx').on(table.module, table.entityId),
  ]
);
