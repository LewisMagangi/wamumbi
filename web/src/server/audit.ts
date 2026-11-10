import "server-only"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma"

/**
 * Write an audit_logs row. Never throws: auditing must not break the action it records.
 * Action and entity rows are created on first use.
 */
export async function audit(entry: {
  userId: number | null
  action: string
  entity: string
  entityId: number
  oldValues?: Record<string, unknown>
  newValues?: Record<string, unknown>
}) {
  try {
    const [action, entity] = await Promise.all([
      prisma.auditAction.upsert({ where: { name: entry.action }, update: {}, create: { name: entry.action } }),
      prisma.entityType.upsert({ where: { name: entry.entity }, update: {}, create: { name: entry.entity, table_name: entry.entity } }),
    ])
    await prisma.auditLog.create({
      data: {
        user_id: entry.userId,
        action_id: action.id,
        entity_type_id: entity.id,
        entity_id: entry.entityId,
        old_values: (entry.oldValues ?? undefined) as Prisma.InputJsonValue | undefined,
        new_values: (entry.newValues ?? undefined) as Prisma.InputJsonValue | undefined,
        affected_columns: Object.keys(entry.newValues ?? {}),
      },
    })
  } catch (err) {
    console.error("audit log failed", err)
  }
}
