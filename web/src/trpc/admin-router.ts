import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { prisma } from "@/lib/prisma"
import { ROLES, ROLE_META, normalizeRole, type Role } from "@/lib/rbac/roles"
import { ROLE_PERMISSIONS, matrix, permissionsJson } from "@/lib/rbac/permissions"
import { PENDING_REVIEW } from "@/server/review"
import { audit } from "@/server/audit"
import { optionalAuthProcedure, permissionProcedure, router } from "./trpc"

const roleEnum = z.enum(ROLES)
const kindEnum = z.enum(["campaign", "event", "blog"])

const LIVE_STATUS: Record<z.infer<typeof kindEnum>, string> = {
  campaign: "active",
  event: "scheduled",
  blog: "published",
}

export const adminRouter = router({
  /** Current user, role and permissions. Null when signed out. Used by the client AuthContext. */
  me: optionalAuthProcedure
    .input(z.void())
    .query(({ ctx }) => {
      if (!ctx.user) return null
      return {
        id: ctx.user.id,
        email: ctx.user.email,
        name: [ctx.user.firstName, ctx.user.lastName].filter(Boolean).join(" ") || ctx.user.email,
        role: ctx.user.role,
        roleLabel: ROLE_META[ctx.user.role].label,
        permissions: [...ROLE_PERMISSIONS[ctx.user.role]],
      }
    }),

  /** Role definitions and the permission matrix (read-only reference). */
  roles: permissionProcedure("users:manage")
    .input(z.void())
    .query(() => ({
      roles: ROLES.map((r) => ({ key: r, ...ROLE_META[r] })),
      matrix: matrix(),
    })),

  listUsers: permissionProcedure("users:manage")
    .input(z.object({ search: z.string().trim().max(100).optional() }).optional())
    .query(async ({ input }) => {
      const q = input?.search
      const users = await prisma.user.findMany({
        where: q
          ? {
              OR: [
                { email: { contains: q, mode: "insensitive" } },
                { first_name: { contains: q, mode: "insensitive" } },
                { last_name: { contains: q, mode: "insensitive" } },
              ],
            }
          : undefined,
        include: { role: true, status: true },
        orderBy: { created_at: "desc" },
        take: 200,
      })
      return users.map((u) => ({
        id: u.id,
        email: u.email,
        name: [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email,
        role: normalizeRole(u.role?.name),
        status: u.status?.name ?? "active",
        lastLogin: u.last_login,
      }))
    }),

  assignRole: permissionProcedure("roles:assign")
    .input(z.object({ userId: z.number().int(), role: roleEnum }))
    .mutation(async ({ input, ctx }) => {
      if (input.userId === ctx.user.id && input.role !== "super_admin") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "You cannot remove your own Super Admin role" })
      }
      const before = await prisma.user.findUnique({ where: { id: input.userId }, include: { role: true } })
      if (!before) throw new TRPCError({ code: "NOT_FOUND" })
      const role = await prisma.userRole.upsert({
        where: { name: input.role },
        update: { permissions: permissionsJson(input.role as Role) },
        create: { name: input.role, description: ROLE_META[input.role as Role].description, permissions: permissionsJson(input.role as Role) },
      })
      await prisma.user.update({ where: { id: input.userId }, data: { role_id: role.id } })
      await audit({
        userId: ctx.user.id,
        action: "role_change",
        entity: "user",
        entityId: input.userId,
        oldValues: { role: before.role?.name },
        newValues: { role: input.role },
      })
      return { ok: true }
    }),

  /** Content waiting for Super Admin approval. */
  pendingContent: permissionProcedure("campaigns:publish", "events:publish", "blog:publish")
    .input(z.void())
    .query(async () => {
      const [campaigns, events, posts] = await Promise.all([
        prisma.campaign.findMany({
          where: { status: { name: PENDING_REVIEW } },
          include: { creator: { select: { first_name: true, last_name: true, email: true } } },
          orderBy: { updated_at: "desc" },
        }),
        prisma.event.findMany({
          where: { status: { name: PENDING_REVIEW } },
          include: { creator: { select: { first_name: true, last_name: true, email: true } } },
          orderBy: { updated_at: "desc" },
        }),
        prisma.blogPost.findMany({
          where: { status: { name: PENDING_REVIEW } },
          include: { author: { select: { first_name: true, last_name: true, email: true } } },
          orderBy: { updated_at: "desc" },
        }),
      ])
      const who = (u: { first_name: string | null; last_name: string | null; email: string } | null) =>
        u ? [u.first_name, u.last_name].filter(Boolean).join(" ") || u.email : "Unknown"
      return [
        ...campaigns.map((c) => ({ kind: "campaign" as const, id: c.id, title: c.title, by: who(c.creator), updatedAt: c.updated_at })),
        ...events.map((e) => ({ kind: "event" as const, id: e.id, title: e.title, by: who(e.creator), updatedAt: e.updated_at })),
        ...posts.map((p) => ({ kind: "blog" as const, id: p.id, title: p.title, by: who(p.author), updatedAt: p.updated_at })),
      ].sort((a, b) => +b.updatedAt - +a.updatedAt)
    }),

  reviewContent: permissionProcedure("campaigns:publish", "events:publish", "blog:publish")
    .input(z.object({ kind: kindEnum, id: z.number().int(), decision: z.enum(["approve", "reject"]) }))
    .mutation(async ({ input, ctx }) => {
      const target = input.decision === "approve" ? LIVE_STATUS[input.kind] : "draft"
      const args = { where: { name: target }, update: {}, create: { name: target, description: target } }
      if (input.kind === "campaign") {
        const s = await prisma.campaignStatus.upsert(args)
        await prisma.campaign.update({ where: { id: input.id }, data: { status_id: s.id } })
      } else if (input.kind === "event") {
        const s = await prisma.eventStatus.upsert(args)
        await prisma.event.update({ where: { id: input.id }, data: { status_id: s.id } })
      } else {
        const s = await prisma.blogPostStatus.upsert({ ...args, create: { ...args.create, is_published: input.decision === "approve" } })
        await prisma.blogPost.update({
          where: { id: input.id },
          data: { status_id: s.id, published_at: input.decision === "approve" ? new Date() : null },
        })
      }
      await audit({
        userId: ctx.user.id,
        action: input.decision === "approve" ? "approve" : "reject",
        entity: input.kind,
        entityId: input.id,
        newValues: { status: target },
      })
      return { ok: true }
    }),
})
