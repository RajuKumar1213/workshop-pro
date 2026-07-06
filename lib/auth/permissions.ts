import type { PermissionKey } from '@/constants/permissions';
import type { WorkshopRole } from '@/constants/roles';
import type { SessionPayload } from '@/types/auth';

/**
 * Server-side permission checking utilities.
 * Use these in Server Components, Route Handlers, and Server Actions.
 */

export function canView(session: SessionPayload | null, permission: PermissionKey): boolean {
  return checkPermission(session, permission);
}

export function canCreate(session: SessionPayload | null, permission: PermissionKey): boolean {
  return checkPermission(session, permission);
}

export function canEdit(session: SessionPayload | null, permission: PermissionKey): boolean {
  return checkPermission(session, permission);
}

export function canDelete(session: SessionPayload | null, permission: PermissionKey): boolean {
  return checkPermission(session, permission);
}

export function canAssign(session: SessionPayload | null, permission: PermissionKey): boolean {
  return checkPermission(session, permission);
}

export function canManage(session: SessionPayload | null, permission: PermissionKey): boolean {
  return checkPermission(session, permission);
}

export function hasRole(session: SessionPayload | null, role: WorkshopRole): boolean {
  if (!session) return false;
  return session.roles.includes(role);
}

export function isAdmin(session: SessionPayload | null): boolean {
  return hasRole(session, 'Admin' as WorkshopRole);
}

// ─── Internal ───────────────────────────────────────────────────────────────

function checkPermission(session: SessionPayload | null, permission: PermissionKey): boolean {
  if (!session) return false;
  return session.permissions.includes(permission);
}
