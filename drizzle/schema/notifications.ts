import { pgTable, uuid, varchar, text, boolean, timestamp, index } from 'drizzle-orm/pg-core';

export const notificationTypeEnum = ['info', 'success', 'warning', 'error'] as const;
export type NotificationType = (typeof notificationTypeEnum)[number];

/**
 * In-app notifications.
 * Supports soft delete so notification history is preserved.
 */
export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),

    // Target user (auth user ID)
    userId: uuid('user_id').notNull(),

    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    type: varchar('type', { length: 50 })
      .$type<NotificationType>()
      .default('info')
      .notNull(),

    // Read status
    isRead: boolean('is_read').default(false).notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),

    // Optional deep link
    actionUrl: text('action_url'),

    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

    // Soft delete
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
  },
  (table) => [
    index('notifications_user_id_idx').on(table.userId),
    index('notifications_is_read_idx').on(table.isRead),
    index('notifications_created_at_idx').on(table.createdAt),
  ]
);
