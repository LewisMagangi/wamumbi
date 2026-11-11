import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { can, canAny } from "@/lib/rbac/permissions"
import { assertTeamAccess } from "@/server/review"
import { audit } from "@/server/audit"
import { permissionProcedure, router, type AuthedUser } from "./trpc"

/**
 * Projects: the foundation's ongoing work (a borehole, a school-fees drive),
 * optionally tied to a team and a campaign. Staff with the dashboard can see
 * them; team managers edit any project, team leaders only their teams' projects.
 */

const MANAGE = ["teams:manage", "teams:manage_own"] as const
const seesBudget = (user: AuthedUser) => canAny(user.role, ["teams:manage", "reports:view_financial"])

const projectFields = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1),
  statusId: z.number().int(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date().optional().nullable(),
  teamId: z.number().int().optional().nullable(),
  campaignId: z.number().int().optional().nullable(),
  budget: z.number().nonnegative().optional().nullable(),
  currencyId: z.number().int().optional().nullable(),
  progress: z.number().int().min(0).max(100).optional(),
})

const include = {
  status: true,
  team: { select: { id: true, name: true } },
  campaign: { select: { id: true, title: true } },
  currency: { select: { code: true } },
  progress: true,
} as const

type Row = NonNullable<Awaited<ReturnType<typeof findOne>>>
const findOne = (id: number) => prisma.project.findUnique({ where: { id }, include })

function shape(p: Row, user: AuthedUser) {
  const budgetVisible = seesBudget(user)
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    status: p.status.name,
    statusId: p.status_id,
    startDate: p.start_date,
    endDate: p.end_date,
    teamId: p.team?.id ?? null,
    team: p.team?.name ?? null,
    campaignId: p.campaign?.id ?? null,
    campaign: p.campaign?.title ?? null,
    budget: budgetVisible && p.budget != null ? Number(p.budget) : null,
    currency: p.currency?.code ?? null,
    currencyId: p.currency_id,
    progress: p.progress?.progress_percentage ?? 0,
    hoursLogged: Number(p.progress?.hours_logged ?? 0),
    volunteersCount: p.progress?.volunteers_count ?? 0,
    updatedAt: p.updated_at,
  }
}

/** Team leaders must attach their projects to a team they lead. */
async function checkTeam(user: AuthedUser, teamId: number | null | undefined) {
  if (can(user.role, "teams:manage")) return
  if (!teamId) throw new TRPCError({ code: "BAD_REQUEST", message: "Choose one of your teams for this project" })
  await assertTeamAccess(user, teamId)
}

export const projectsRouter = router({
  list: permissionProcedure("dashboard:view").query(async ({ ctx }) => {
    const rows = await prisma.project.findMany({ include, orderBy: [{ start_date: "desc" }, { id: "desc" }] })
    return rows.map((p) => shape(p, ctx.user))
  }),

  getStatuses: permissionProcedure("dashboard:view").query(() =>
    prisma.projectStatus.findMany({ where: { is_active: true }, orderBy: { display_order: "asc" }, select: { id: true, name: true } })
  ),

  /** Teams the caller can attach a project to: all for team managers, their own for leaders. */
  assignableTeams: permissionProcedure(...MANAGE).query(({ ctx }) =>
    prisma.team.findMany({
      where: can(ctx.user.role, "teams:manage") ? {} : { team_leader_id: ctx.user.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    })
  ),

  create: permissionProcedure(...MANAGE).input(projectFields).mutation(async ({ input, ctx }) => {
    await checkTeam(ctx.user, input.teamId)
    const created = await prisma.project.create({
      data: {
        title: input.title,
        description: input.description,
        status_id: input.statusId,
        start_date: input.startDate,
        end_date: input.endDate ?? null,
        team_id: input.teamId ?? null,
        campaign_id: input.campaignId ?? null,
        budget: input.budget ?? null,
        currency_id: input.currencyId ?? null,
        created_by: ctx.user.id,
        progress: { create: { progress_percentage: input.progress ?? 0 } },
      },
    })
    await audit({ userId: ctx.user.id, action: "project_create", entity: "project", entityId: created.id })
    return shape((await findOne(created.id))!, ctx.user)
  }),

  update: permissionProcedure(...MANAGE)
    .input(projectFields.partial().extend({ id: z.number().int() }))
    .mutation(async ({ input, ctx }) => {
      const existing = await prisma.project.findUnique({ where: { id: input.id }, select: { team_id: true } })
      if (!existing) throw new TRPCError({ code: "NOT_FOUND", message: "Project not found" })
      // Leaders can edit projects of teams they lead, and can't move them to someone else's team.
      await checkTeam(ctx.user, existing.team_id)
      if (input.teamId !== undefined) await checkTeam(ctx.user, input.teamId)

      const { id, progress, ...f } = input
      await prisma.project.update({
        where: { id },
        data: {
          ...(f.title !== undefined && { title: f.title }),
          ...(f.description !== undefined && { description: f.description }),
          ...(f.statusId !== undefined && { status_id: f.statusId }),
          ...(f.startDate !== undefined && { start_date: f.startDate }),
          ...(f.endDate !== undefined && { end_date: f.endDate }),
          ...(f.teamId !== undefined && { team_id: f.teamId }),
          ...(f.campaignId !== undefined && { campaign_id: f.campaignId }),
          // Only roles that can see the budget can change it.
          ...(f.budget !== undefined && seesBudget(ctx.user) && { budget: f.budget }),
          ...(f.currencyId !== undefined && seesBudget(ctx.user) && { currency_id: f.currencyId }),
          ...(progress !== undefined && {
            progress: {
              upsert: {
                create: { progress_percentage: progress, last_update_date: new Date() },
                update: { progress_percentage: progress, last_update_date: new Date() },
              },
            },
          }),
        },
      })
      await audit({ userId: ctx.user.id, action: "project_update", entity: "project", entityId: id })
      return shape((await findOne(id))!, ctx.user)
    }),

  delete: permissionProcedure("teams:manage").input(z.object({ id: z.number().int() })).mutation(async ({ input, ctx }) => {
    await prisma.project.delete({ where: { id: input.id } })
    await audit({ userId: ctx.user.id, action: "project_delete", entity: "project", entityId: input.id })
    return { ok: true }
  }),
})
