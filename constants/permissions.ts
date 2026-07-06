/**
 * Permission constants for the Workshop Management System.
 *
 * Format: `{resource}:{action}`
 *
 * These are checked against the roles/permissions stored in the auth service
 * and mirrored in the workshop DB for RBAC enforcement.
 */
export const PERMISSIONS = {
  CUSTOMERS: {
    VIEW: 'customers:view',
    CREATE: 'customers:create',
    EDIT: 'customers:edit',
    DELETE: 'customers:delete',
  },
  ORDERS: {
    VIEW: 'orders:view',
    CREATE: 'orders:create',
    EDIT: 'orders:edit',
    DELETE: 'orders:delete',
    ASSIGN: 'orders:assign',
  },
  PRODUCTION: {
    VIEW: 'production:view',
    CREATE: 'production:create',
    EDIT: 'production:edit',
    DELETE: 'production:delete',
    MANAGE: 'production:manage',
  },
  INVOICES: {
    VIEW: 'invoices:view',
    CREATE: 'invoices:create',
    EDIT: 'invoices:edit',
    DELETE: 'invoices:delete',
  },
  GALLERY: {
    VIEW: 'gallery:view',
    UPLOAD: 'gallery:upload',
    DELETE: 'gallery:delete',
  },
  REPORTS: {
    VIEW: 'reports:view',
    EXPORT: 'reports:export',
  },
  ATTENDANCE: {
    VIEW: 'attendance:view',
    CREATE: 'attendance:create',
    EDIT: 'attendance:edit',
    MANAGE: 'attendance:manage',
  },
  STAFF: {
    VIEW: 'staff:view',
    CREATE: 'staff:create',
    EDIT: 'staff:edit',
    DELETE: 'staff:delete',
    ASSIGN: 'staff:assign',
  },
  SETTINGS: {
    VIEW: 'settings:view',
    MANAGE: 'settings:manage',
  },
} as const;

export type PermissionKey =
  (typeof PERMISSIONS)[keyof typeof PERMISSIONS][keyof (typeof PERMISSIONS)[keyof typeof PERMISSIONS]];
