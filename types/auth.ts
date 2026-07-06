import type { WorkshopRole } from '@/constants/roles';
import type { PermissionKey } from '@/constants/permissions';

/**
 * The authenticated user's JWT payload — returned by auth service /me endpoint.
 * This is what gets decoded from the access token.
 */
export interface AuthUser {
  userId: string;
  sessionId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  roles: WorkshopRole[];
  permissions: PermissionKey[];
}

/**
 * Session stored in the httpOnly cookie (encrypted JWT sub-payload).
 */
export interface SessionPayload {
  userId: string;
  sessionId: string;
  email: string;
  roles: WorkshopRole[];
  permissions: PermissionKey[];
  expiresAt: number; // Unix timestamp
}

/**
 * Auth context state provided to the entire client application.
 */
export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Login response from the auth service (normalized by BFF route handler).
 */
export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
}

/**
 * Login form fields.
 */
export interface LoginFormValues {
  email: string;
  password: string;
}
