import "server-only"
import { TRPCError } from "@trpc/server"
import { prisma } from "@/lib/prisma"
import { can, type Permission } from "@/lib/rbac/permissions"
import type { AuthedUser } from "@/trpc/trpc"

/**
 * Content approval workflow: draft -> pending_review -> live.
 * Anyone who may create content can save drafts. Moving content to a "live" status
 * requires the matching :publish permission (Super Admin). Without it, the request is
 * downgraded to pending_review so a Super Admin can approve it from the dashboard.
 */
type Kind = "campaign" | "event" | "blog"

const LIVE: Record<Kind, string[]> = {
  campaign: ["active"],
  event: ["scheduled", "ongoing"],
  blog: ["published"],
}

const PUBLISH: Record<Kind, Permission> = {
  campaign: "campaigns:publish",
  event: "events:publish",
  blog: "blog:publish",
}

export const PENDING_REVIEW = "pending_review"

async function statusName(kind: Kind, id: number) {
  const where = { where: { id }, select: { name: true } }
  const row =
    kind === "campaign" ? await prisma.campaignStatus.findUnique(where)
    : kind === "event" ? await prisma.eventStatus.findUnique(where)
    : await prisma.blogPostStatus.findUnique(where)
  return row?.name ?? null
}

export async function pendingReviewId(kind: Kind) {
  const args = {
    where: { name: PENDING_REVIEW },
    update: {},
    create: { name: PENDING_REVIEW, description: "Waiting for Super Admin approval", display_order: 1 },
  }
  const row =
    kind === "campaign" ? await prisma.campaignStatus.upsert(args)
    : kind === "event" ? await prisma.eventStatus.upsert(args)
    : await prisma.blogPostStatus.upsert({ ...args, create: { ...args.create, is_published: false } })
  return row.id
}

/** Returns the status id the user is allowed to set. */
export async function reviewStatus(kind: Kind, requestedStatusId: number, user: AuthedUser) {
  if (can(user.role, PUBLISH[kind])) return requestedStatusId
  const name = await statusName(kind, requestedStatusId)
  if (name && LIVE[kind].includes(name)) return pendingReviewId(kind)
  return requestedStatusId
}

/** Team leaders may only change teams they lead. */
export async function assertTeamAccess(user: AuthedUser, teamId: number) {
  if (can(user.role, "teams:manage")) return
  const team = await prisma.team.findUnique({ where: { id: teamId }, select: { team_leader_id: true } })
  if (!team || team.team_leader_id !== user.id) {
    throw new TRPCError({ code: "FORBIDDEN", message: "You can only manage teams you lead" })
  }
}
