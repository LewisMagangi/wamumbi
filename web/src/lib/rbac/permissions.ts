import { ROLES, type Role } from "./roles"

/**
 * Permission strings are `resource:action`. Scoped variants carry a suffix:
 *   _own  -> only records the user owns
 *   _team -> only records belonging to a team the user leads
 * This file is the single source of truth. The seed copies it into
 * user_roles.permissions so the database stays readable for admins,
 * and docs/rbac.md documents it as a table.
 */
export const PERMISSIONS = [
  // campaigns
  "campaigns:create",
  "campaigns:update",
  "campaigns:delete",
  "campaigns:publish",
  // donors & donations
  "donors:view_profile", // name, giving history; no contact details
  "donors:view_contact", // email, phone, address
  "donations:view_all",
  "donations:view_aggregate", // totals and per-campaign figures, donors anonymised
  "donations:view_own",
  "donations:manage", // edit / refund / delete
  "reports:view_financial",
  "reports:export",
  // events
  "events:create",
  "events:update",
  "events:delete",
  "events:publish",
  "registrations:manage",
  "registrations:manage_team",
  // volunteers & teams
  "volunteers:view",
  "volunteers:view_team",
  "volunteers:view_anonymized",
  "volunteers:manage",
  "volunteers:coordinate", // assign volunteers to events
  "teams:view",
  "teams:manage",
  "teams:manage_own",
  // content & media
  "blog:create",
  "blog:update",
  "blog:delete",
  "blog:publish",
  "media:upload",
  "media:upload_restricted", // goes to moderation, rate limited
  "media:moderate",
  // administration
  "users:manage",
  "roles:assign",
  "audit:view",
  "dashboard:view",
] as const

export type Permission = (typeof PERMISSIONS)[number]

const ALL = [...PERMISSIONS] as Permission[]

export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  super_admin: ALL,

  campaign_manager: [
    "dashboard:view",
    "campaigns:create", "campaigns:update", "campaigns:delete",
    "donors:view_profile",
    "donations:view_aggregate", "donations:view_own",
    "media:upload",
  ],

  event_coordinator: [
    "dashboard:view",
    "events:create", "events:update", "events:delete",
    "registrations:manage",
    "volunteers:view", "volunteers:coordinate",
    "teams:view",
    "donations:view_own",
    "media:upload",
  ],

  volunteer_coordinator: [
    "dashboard:view",
    "volunteers:view", "volunteers:manage", "volunteers:coordinate",
    "teams:view", "teams:manage",
    "donations:view_own",
    "media:upload",
  ],

  content_manager: [
    "dashboard:view",
    "blog:create", "blog:update", "blog:delete",
    "media:upload", "media:moderate",
    "donations:view_own",
  ],

  finance_manager: [
    "dashboard:view",
    "donors:view_profile", "donors:view_contact",
    "donations:view_all", "donations:view_aggregate", "donations:view_own", "donations:manage",
    "reports:view_financial", "reports:export",
  ],

  team_leader: [
    "dashboard:view",
    "teams:view", "teams:manage_own",
    "volunteers:view_team",
    "registrations:manage_team",
    "donations:view_own",
    "media:upload",
  ],

  volunteer: [
    "dashboard:view",
    "volunteers:view_anonymized",
    "teams:view",
    "donations:view_own",
    "media:upload_restricted",
  ],

  donor: ["donations:view_own"],
}

export function can(role: Role | null | undefined, permission: Permission): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

export function canAny(role: Role | null | undefined, permissions: readonly Permission[]): boolean {
  return permissions.some((p) => can(role, p))
}

/** JSON written to user_roles.permissions by the seed. */
export function permissionsJson(role: Role) {
  return { version: 1, permissions: [...ROLE_PERMISSIONS[role]] }
}

/** Matrix for docs and the admin "Roles" view. */
export function matrix() {
  return PERMISSIONS.map((p) => ({ permission: p, roles: ROLES.filter((r) => can(r, p)) }))
}

/** Volunteer photo upload limits (media:upload_restricted). */
export const RESTRICTED_UPLOAD = {
  maxPerDay: 10,
  maxBytes: 10 * 1024 * 1024,
  mimeTypes: ["image/jpeg", "image/png", "image/webp"],
} as const
