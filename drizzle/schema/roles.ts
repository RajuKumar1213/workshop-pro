import { pgTable, uuid, varchar, text, timestamp, unique } from 'drizzle-orm/pg-core';
import { workshopUsers } from './workshop-users';

/**
 * Workshop-specific roles (Admin, Manager, Supervisor, Worker).
 * These mirror the roles in the auth service but are stored here for local RBAC checks.
 */
export const workshopRoles = pgTable('workshop_roles', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 100 }).unique().notNull(),
  description: text('description'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

/**
 * Junction table linking workshop users to their roles.
 */
export const workshopUserRoles = pgTable(
  'workshop_user_roles',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .references(() => workshopUsers.id, { onDelete: 'cascade' })
      .notNull(),
    roleId: uuid('role_id')
      .references(() => workshopRoles.id, { onDelete: 'cascade' })
      .notNull(),
    assignedBy: uuid('assigned_by'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [unique().on(table.userId, table.roleId)]
);
