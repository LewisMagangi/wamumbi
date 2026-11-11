"use client"

import { useAuth } from "../contexts/AuthContext"
import type { Permission } from "@/lib/rbac/permissions"

export type PermissionAction = "read" | "create" | "update" | "delete"

export type Resource =
  | "campaigns"
  | "events"
  | "projects"
  | "teams"
  | "blog"
  | "donations"
  | "volunteers"
  | "discussions"
  | "comments"
  | "polls"
  | "profile"
  | "registrations"

export function usePermissions() {
  const { hasPermission, has, hasAny, isAdmin, role, isLoading } = useAuth()

  return {
    /** Legacy check, e.g. can("create", "campaigns") */
    can: (action: PermissionAction, resource: Resource) => hasPermission(action, resource),
    canEdit: (resource: Resource) => hasPermission("update", resource),
    canCreate: (resource: Resource) => hasPermission("create", resource),
    canDelete: (resource: Resource) => hasPermission("delete", resource),
    /** New, precise check, e.g. has("media:moderate") */
    has: (p: Permission) => has(p),
    hasAny: (ps: Permission[]) => hasAny(ps),
    isAdmin,
    role,
    isLoading,
  }
}
