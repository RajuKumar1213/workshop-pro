import type { WorkshopRole } from '@/constants/roles';
import type { PermissionKey } from '@/constants/permissions';

/**
 * Workshop staff profile — extends auth service user with workshop-specific data.
 */
export interface WorkshopUser {
  id: string;
  authUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  employeeCode?: string;
  department?: string;
  roles: WorkshopRole[];
  permissions: PermissionKey[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UserFullName = string;

/**
 * Derives full name from first/last name.
 */
export function getUserFullName(user: Pick<WorkshopUser, 'firstName' | 'lastName' | 'email'>): UserFullName {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) return user.firstName;
  return user.email;
}

/**
 * Derives initials for avatar fallback.
 */
export function getUserInitials(user: Pick<WorkshopUser, 'firstName' | 'lastName' | 'email'>): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  if (user.firstName) return user.firstName.slice(0, 2).toUpperCase();
  return user.email.slice(0, 2).toUpperCase();
}
