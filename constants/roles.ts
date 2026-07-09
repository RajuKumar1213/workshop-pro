/**
 * Workshop role definitions.
 * These align with roles managed in the authorization-service.
 */
export enum WorkshopRole {
  SuperAdmin = 'SuperAdmin',
  Admin = 'Admin',
  Manager = 'Manager',
  Supervisor = 'Supervisor',
  Worker = 'Worker',
}

/**
 * Ordered hierarchy of roles — higher index = higher privilege.
 */
export const ROLE_HIERARCHY: WorkshopRole[] = [
  WorkshopRole.Worker,
  WorkshopRole.Supervisor,
  WorkshopRole.Manager,
  WorkshopRole.Admin,
  WorkshopRole.SuperAdmin,
];

/**
 * Role display labels for UI rendering.
 */
export const ROLE_LABELS: Record<WorkshopRole, string> = {
  [WorkshopRole.SuperAdmin]: 'Super Admin',
  [WorkshopRole.Admin]: 'Administrator',
  [WorkshopRole.Manager]: 'Manager',
  [WorkshopRole.Supervisor]: 'Supervisor',
  [WorkshopRole.Worker]: 'Worker',
};

/**
 * Role color variants for badge rendering.
 */
export const ROLE_COLORS: Record<WorkshopRole, string> = {
  [WorkshopRole.SuperAdmin]: 'default',
  [WorkshopRole.Admin]: 'destructive',
  [WorkshopRole.Manager]: 'default',
  [WorkshopRole.Supervisor]: 'secondary',
  [WorkshopRole.Worker]: 'outline',
};
