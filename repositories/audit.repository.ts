import 'server-only';
import { db } from '@/lib/db';
import { auditLogs } from '@/drizzle/schema';
import type { InferInsertModel } from 'drizzle-orm';

type AuditLogInsert = InferInsertModel<typeof auditLogs>;

export interface AuditLogInput {
  userId: string;
  action: string;
  module: string;
  resource: string;
  resourceId?: string;
  oldValue?: Record<string, unknown>;
  newValue?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  description?: string;
}

/**
 * Audit log repository.
 * Every significant action in the system should call AuditRepository.log().
 *
 * Usage from a Server Action:
 *   await AuditRepository.log({
 *     userId: session.userId,
 *     action: 'CREATE',
 *     module: 'customers',
 *     resource: 'customer',
 *     resourceId: newCustomer.id,
 *     newValue: newCustomer,
 *     ipAddress: req.headers['x-forwarded-for'],
 *   });
 */
export class AuditRepository {
  /**
   * Creates a new audit log entry.
   * Non-throwing — audit failures should never break the main flow.
   */
  static async log(input: AuditLogInput): Promise<void> {
    try {
      const entry: AuditLogInsert = {
        userId: input.userId,
        action: input.action.toUpperCase(),
        module: input.module,
        resource: input.resource,
        resourceId: input.resourceId,
        oldValue: input.oldValue ?? null,
        newValue: input.newValue ?? null,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
        description: input.description,
      };

      await db.insert(auditLogs).values(entry);
    } catch (error) {
      // Audit failures are logged but never surface to the user
      console.error('[AuditRepository] Failed to write audit log:', error);
    }
  }

  /**
   * Retrieves audit logs for a specific resource.
   */
  static async getForResource(
    module: string,
    resourceId: string,
    limit = 50
  ) {
    return db.query.auditLogs.findMany({
      where: (t, { eq, and }) =>
        and(eq(t.module, module), eq(t.resourceId, resourceId)),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      limit,
    });
  }

  /**
   * Retrieves audit logs for a specific user.
   */
  static async getForUser(userId: string, limit = 100) {
    return db.query.auditLogs.findMany({
      where: (t, { eq }) => eq(t.userId, userId),
      orderBy: (t, { desc }) => [desc(t.createdAt)],
      limit,
    });
  }
}
