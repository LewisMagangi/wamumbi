import "server-only"
import { prisma } from "@/lib/prisma"
import { canAny, type Permission } from "@/lib/rbac/permissions"
import { LEGACY, ROLES } from "@/lib/rbac/roles"

/**
 * In-app notifications (the bell in the dashboard). Best effort: a failure here
 * never breaks the action that triggered it.
 */

type Links = { campaignId?: number; eventId?: number; projectId?: number; donationId?: number }

async function lookups() {
  const [type, method] = await Promise.all([
    prisma.notificationType.upsert({ where: { name: "system" }, update: {}, create: { name: "system", description: "Messages from the website" } }),
    prisma.deliveryMethod.upsert({ where: { name: "in_app" }, update: {}, create: { name: "in_app", description: "Shown in the dashboard" } }),
  ])
  return { typeId: type.id, methodId: method.id }
}

/** Notify specific users. */
export async function notifyUsers(userIds: number[], msg: { title: string; message: string } & Links) {
  const ids = Array.from(new Set(userIds)).filter(Boolean)
  if (!ids.length) return
  try {
    const { typeId, methodId } = await lookups()
    await prisma.notification.createMany({
      data: ids.map((user_id) => ({
        user_id,
        notification_type_id: typeId,
        delivery_method_id: methodId,
        title: msg.title.slice(0, 200),
        message: msg.message,
        campaign_id: msg.campaignId ?? null,
        event_id: msg.eventId ?? null,
        project_id: msg.projectId ?? null,
        donation_id: msg.donationId ?? null,
        delivered_at: new Date(),
      })),
    })
  } catch (error) {
    console.error("[notify] in-app notification failed:", error instanceof Error ? error.message : error)
  }
}

/** Notify everyone whose role holds any of these permissions (e.g. all approvers). */
export async function notifyPermission(perms: Permission[], msg: { title: string; message: string } & Links, exceptUserId?: number) {
  try {
    const roles: string[] = ROLES.filter((r) => canAny(r, perms))
    const legacy = Object.entries(LEGACY).filter(([, r]) => roles.includes(r)).map(([name]) => name)
    const users = await prisma.user.findMany({
      where: { role: { name: { in: [...roles, ...legacy] } }, status: { name: "active" } },
      select: { id: true },
    })
    await notifyUsers(users.map((u) => u.id).filter((id) => id !== exceptUserId), msg)
  } catch (error) {
    console.error("[notify] could not find recipients:", error instanceof Error ? error.message : error)
  }
}
