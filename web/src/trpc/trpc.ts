import { TRPCError, initTRPC } from "@trpc/server"
import { OpenApiMeta } from "trpc-to-openapi"
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"
import { canAny, type Permission } from "@/lib/rbac/permissions"
import { normalizeRole, type Role } from "@/lib/rbac/roles"
import { applyProfile, type RedactProfile } from "@/lib/rbac/redact"
import { getOrCreateDbUser } from "@/server/current-user"

const t = initTRPC.meta<OpenApiMeta>().create()
const middleware = t.middleware

export type AuthedUser = {
  id: number
  email: string
  firstName: string | null
  lastName: string | null
  role: Role
}

/** Signed in through Clerk and linked to a row in `users`. */
const isAuth = middleware(async (opts) => {
  const clerkUser = await currentUser()
  if (!clerkUser) throw new TRPCError({ code: "UNAUTHORIZED" })

  const dbUser = await getOrCreateDbUser(clerkUser)
  if (!dbUser) throw new TRPCError({ code: "FORBIDDEN", message: "Account is not active" })

  const user: AuthedUser = {
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.first_name,
    lastName: dbUser.last_name,
    role: normalizeRole(dbUser.role?.name),
  }
  return opts.next({ ctx: { dbUser, user } })
})

/**
 * Optional auth: public procedures that behave differently for signed-in staff
 * (e.g. include drafts). Never throws.
 */
const maybeAuth = middleware(async (opts) => {
  let user: AuthedUser | null = null
  try {
    const clerkUser = await currentUser()
    if (clerkUser) {
      const dbUser = await getOrCreateDbUser(clerkUser)
      if (dbUser) {
        user = {
          id: dbUser.id,
          email: dbUser.email,
          firstName: dbUser.first_name,
          lastName: dbUser.last_name,
          role: normalizeRole(dbUser.role?.name),
        }
      }
    }
  } catch (error) {
    // Never block a public request, but leave a trace: a signed-in user whose
    // account can't be loaded otherwise just looks signed out.
    console.error("[auth] could not load the signed-in user:", error instanceof Error ? error.message : error)
    user = null
  }
  return opts.next({ ctx: { user } })
})

export const router = t.router
/** @deprecated use publicProcedure, protectedProcedure or permissionProcedure */
export const procedure = t.procedure
export const publicProcedure = t.procedure
export const optionalAuthProcedure = t.procedure.use(maybeAuth)
export const protectedProcedure = t.procedure.use(isAuth)
/** Kept for existing imports. */
export const privateProcedure = protectedProcedure

/** Signed in AND holding at least one of the given permissions. */
export function permissionProcedure(...anyOf: Permission[]) {
  return protectedProcedure.use(async (opts) => {
    if (!canAny(opts.ctx.user.role, anyOf)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Requires one of: ${anyOf.join(", ")}`,
      })
    }
    return opts.next()
  })
}

/**
 * Shape the response for the caller's role.
 *  - "donor": strips donor contact details (and names, without donors:view_profile)
 *  - "people": first name + last initial and no contact data, unless the role has full access
 * `fullAccess` lists the permissions that see the record unredacted.
 */
export function redactOutput(profile: RedactProfile, fullAccess: Permission[]) {
  return middleware(async (opts) => {
    const result = await opts.next()
    if (!result.ok) return result
    const role = (opts.ctx as { user?: AuthedUser | null }).user?.role ?? null
    return { ...result, data: applyProfile(profile, result.data, role, fullAccess) }
  })
}

/**
 * Team leaders only see people in teams they lead. Filters array results by `userId`.
 * Roles holding any `bypass` permission see everything.
 */
export function scopeToLedTeams(bypass: Permission[]) {
  return middleware(async (opts) => {
    const result = await opts.next()
    const user = (opts.ctx as { user?: AuthedUser }).user
    if (!result.ok || !user || canAny(user.role, bypass) || !Array.isArray(result.data)) return result
    const members = await prisma.teamMember.findMany({
      where: { team: { team_leader_id: user.id } },
      select: { user_id: true },
    })
    const allowed = new Set([user.id, ...members.map((m) => m.user_id)])
    return {
      ...result,
      data: (result.data as Array<{ userId?: number }>).filter((r) => r.userId == null || allowed.has(r.userId)),
    }
  })
}

/** True if the user leads the given team. */
export async function leadsTeam(userId: number, teamId: number) {
  const team = await prisma.team.findUnique({ where: { id: teamId }, select: { team_leader_id: true } })
  return team?.team_leader_id === userId
}
