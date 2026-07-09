'use client';

import { useAuth } from '@/providers/auth-provider';
import type { PermissionKey } from '@/constants/permissions';
import type { WorkshopRole } from '@/constants/roles';
import { hasPermission, hasAnyPermission, hasAllPermissions, hasRole } from '@/types/permissions';

/**
 * Client-side permission hook.
 * Uses the auth context to check permissions on the current user.
 *
 * Usage:
 *   const { can } = usePermissions();
 *   if (can('customers:create')) { ... }
 */
export function usePermissions() {
  const { user } = useAuth();

  return {
    can: (permission: PermissionKey) => hasPermission(user, permission),
    canAny: (permissions: PermissionKey[]) => hasAnyPermission(user, permissions),
    canAll: (permissions: PermissionKey[]) => hasAllPermissions(user, permissions),
    hasRole: (role: WorkshopRole) => hasRole(user, role),
    isSuperAdmin: () => hasRole(user, 'SuperAdmin' as WorkshopRole),
    isAdmin: () => hasRole(user, 'Admin' as WorkshopRole),
    isManager: () => hasRole(user, 'Manager' as WorkshopRole),
    isSupervisor: () => hasRole(user, 'Supervisor' as WorkshopRole),
    isWorker: () => hasRole(user, 'Worker' as WorkshopRole),
  };
}
