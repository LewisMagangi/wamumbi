import "server-only"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma"
import { DEFAULT_ROLE, type Role } from "@/lib/rbac/roles"
import { permissionsJson } from "@/lib/rbac/permissions"

type ClerkLikeUser = {
  id: string
  firstName: string | null
  lastName: string | null
  imageUrl?: string | null
  primaryEmailAddress?: { emailAddress: string } | null
  emailAddresses: { emailAddress: string }[]
}

/**
 * Emails listed in SUPER_ADMIN_EMAILS (comma separated) are promoted to super_admin
 * on sign-in. This is how the first Super Admin is created; afterwards roles are
 * assigned in the dashboard (Users & roles).
 */
function bootstrapAdmins(): Set<string> {
  return new Set(
    (process.env.SUPER_ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean)
  )
}

/** users.profile_image is VARCHAR(255); Clerk image URLs can be longer, so skip those rather than fail sign-in. */
function storableImage(url: string | null | undefined) {
  return url && url.length <= 255 ? url : null
}

async function roleId(name: Role) {
  const role = await prisma.userRole.upsert({
    where: { name },
    update: {},
    create: { name, permissions: permissionsJson(name), description: `${name} role` },
  })
  return role.id
}

async function activeStatusId() {
  const status = await prisma.userStatus.upsert({
    where: { name: "active" },
    update: {},
    create: { name: "active", description: "Active user account" },
  })
  return status.id
}

/**
 * Find the `users` row for a Clerk user, creating it on first sign-in.
 * Returns null for suspended/inactive accounts.
 */
export async function getOrCreateDbUser(clerkUser: ClerkLikeUser) {
  const email = (clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress ?? "").toLowerCase()
  if (!email) return null

  const shouldBeAdmin = bootstrapAdmins().has(email)

  let user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    include: { role: true, status: true },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        email,
        password_hash: "clerk", // authentication is handled by Clerk
        first_name: clerkUser.firstName,
        last_name: clerkUser.lastName,
        profile_image: storableImage(clerkUser.imageUrl),
        email_verified: true,
        role_id: await roleId(shouldBeAdmin ? "super_admin" : DEFAULT_ROLE),
        status_id: await activeStatusId(),
      },
      include: { role: true, status: true },
    })
  } else {
    // Keep name and photo in step with Clerk, where people edit them (/profile).
    const data: Prisma.UserUpdateInput = {}
    if (clerkUser.firstName !== user.first_name) data.first_name = clerkUser.firstName
    if (clerkUser.lastName !== user.last_name) data.last_name = clerkUser.lastName
    if (clerkUser.imageUrl !== undefined && storableImage(clerkUser.imageUrl) !== user.profile_image) data.profile_image = storableImage(clerkUser.imageUrl)
    if (shouldBeAdmin && user.role?.name !== "super_admin") data.role = { connect: { id: await roleId("super_admin") } }
    if (Object.keys(data).length) {
      user = await prisma.user.update({
        where: { id: user.id },
        data,
        include: { role: true, status: true },
      })
    }
  }

  if (user.status && ["suspended", "inactive"].includes(user.status.name)) {
    console.warn(`[auth] user ${user.id} is ${user.status.name}; access denied`)
    return null
  }
  return user
}
