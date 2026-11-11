import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { protectedProcedure, router } from "./trpc"

/** The signed-in user's own notifications. Nobody can read anyone else's. */
export const notificationsRouter = router({
  list: protectedProcedure.input(z.void()).query(async ({ ctx }) => {
    const rows = await prisma.notification.findMany({
      where: { user_id: ctx.user.id },
      orderBy: { created_at: "desc" },
      take: 30,
      select: { id: true, title: true, message: true, is_read: true, created_at: true, campaign_id: true, event_id: true, project_id: true, donation_id: true },
    })
    return rows.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      isRead: n.is_read,
      createdAt: n.created_at,
      href: n.event_id ? "/dashboard/events" : n.campaign_id ? "/dashboard/campaigns" : n.project_id ? "/projects" : n.donation_id ? "/donations" : null,
    }))
  }),

  unreadCount: protectedProcedure.input(z.void()).query(({ ctx }) =>
    prisma.notification.count({ where: { user_id: ctx.user.id, is_read: false } })
  ),

  markRead: protectedProcedure
    .input(z.object({ ids: z.array(z.number().int()).max(100).optional() }))
    .mutation(async ({ input, ctx }) => {
      await prisma.notification.updateMany({
        where: { user_id: ctx.user.id, is_read: false, ...(input.ids ? { id: { in: input.ids } } : {}) },
        data: { is_read: true, read_at: new Date() },
      })
      return { ok: true }
    }),
})
