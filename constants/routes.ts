/**
 * Application route constants.
 * All routes are defined here — never use string literals in navigation code.
 */
export const ROUTES = {
  // Auth
  LOGIN: '/login',

  // Dashboard
  DASHBOARD: '/dashboard',

  // Modules
  CUSTOMERS: '/customers',
  ORDERS: '/orders',
  PRODUCTION: '/production',
  INVOICES: '/invoices',
  GALLERY: '/gallery',
  REPORTS: '/reports',
  ATTENDANCE: '/attendance',
  STAFF: '/staff',
  SETTINGS: '/settings',

  // Errors
  UNAUTHORIZED: '/unauthorized',
} as const;

export type AppRoute = (typeof ROUTES)[keyof typeof ROUTES];
