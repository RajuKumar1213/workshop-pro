import { pgTable, uuid, varchar, text, jsonb, timestamp, index } from 'drizzle-orm/pg-core';

/**
 * Immutable audit trail for every significant action in the system.
 *
 * Usage: Call AuditRepository.log() from any server action or route handler.
 * Old/new values are stored as JSONB for full diff visibility.
 */
export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Who performed the action (auth user ID from authorization-service)
    userId: uuid('user_id').notNull(),

    // What was done
    action: varchar('action', { length: 100 }).notNull(), // e.g. 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
    module: varchar('module', { length: 100 }).notNull(), // e.g. 'customers', 'orders'
    resource: varchar('resource', { length: 100 }).notNull(), // e.g. 'customer', 'order'
    resourceId: uuid('resource_id'), // The affected entity's ID

    // Before and after state
    oldValue: jsonb('old_value'),
    newValue: jsonb('new_value'),

    // Request metadata
    ipAddress: varchar('ip_address', { length: 45 }),
    userAgent: text('user_agent'),

    // Description for quick human-readable summary
    description: text('description'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index('audit_logs_user_id_idx').on(table.userId),
    index('audit_logs_module_idx').on(table.module),
    index('audit_logs_created_at_idx').on(table.createdAt),
  ]
);
