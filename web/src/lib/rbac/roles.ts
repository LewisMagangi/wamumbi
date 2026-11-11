/**
 * Wamumbi role hierarchy.
 * The role key is stored in user_roles.name. Order = seniority (used for display and
 * for "who can assign which role": only super_admin assigns roles today).
 */
export const ROLES = [
  "super_admin",
  "campaign_manager",
  "event_coordinator",
  "volunteer_coordinator",
  "content_manager",
  "finance_manager",
  "team_leader",
  "volunteer",
  "donor",
] as const

export type Role = (typeof ROLES)[number]

export const DEFAULT_ROLE: Role = "donor"

export const ROLE_META: Record<Role, { label: string; description: string }> = {
  super_admin: { label: "Super Admin", description: "Full control. Approves all content and manages roles." },
  campaign_manager: { label: "Campaign Manager", description: "Manages campaigns. Sees donor profiles, never donor contact details." },
  event_coordinator: { label: "Event Coordinator", description: "Events, registrations and volunteer coordination for events." },
  volunteer_coordinator: { label: "Volunteer Coordinator", description: "All volunteer and team management. No financial access." },
  content_manager: { label: "Content Manager", description: "Blog posts and media. Moderates uploaded photos." },
  finance_manager: { label: "Finance Manager", description: "Financial reports and donor information. Cannot create campaigns." },
  team_leader: { label: "Team Leader", description: "Manages their own team only." },
  volunteer: { label: "Volunteer", description: "Takes part in events. Photo uploads go to moderation. Sees anonymised data." },
  donor: { label: "Donor", description: "Public pages plus their own donations." },
}

/** Roles that existed before this RBAC; mapped so existing users keep working. */
export const LEGACY: Record<string, Role> = {
  admin: "super_admin",
  staff: "volunteer_coordinator",
  Volunteer: "volunteer",
}

export function normalizeRole(name: string | null | undefined): Role {
  if (!name) return DEFAULT_ROLE
  if ((ROLES as readonly string[]).includes(name)) return name as Role
  return LEGACY[name] ?? DEFAULT_ROLE
}
