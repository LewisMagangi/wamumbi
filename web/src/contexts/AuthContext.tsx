"use client"

import { useClerk } from "@clerk/nextjs"
import { trpc } from "@/app/_trpc/client"
import type { Permission } from "@/lib/rbac/permissions"
import type { Role } from "@/lib/rbac/roles"

export type UserRole = Role

export interface AuthUser {
  id: number
  name: string
  email: string
  role: Role
  roleLabel: string
  permissions: Permission[]
}

/**
 * Legacy (action, resource) checks map onto the new permission strings so existing
 * components that call hasPermission("create", "campaigns") keep working.
 */
const LEGACY_MAP: Record<string, Permission[]> = {
  "create:campaigns": ["campaigns:create"],
  "update:campaigns": ["campaigns:update"],
  "delete:campaigns": ["campaigns:delete"],
  "create:events": ["events:create"],
  "update:events": ["events:update"],
  "delete:events": ["events:delete"],
  "create:registrations": ["registrations:manage", "registrations:manage_team"],
  "read:volunteers": ["volunteers:view", "volunteers:view_team", "volunteers:view_anonymized"],
  "create:volunteers": ["volunteers:manage"],
  "update:volunteers": ["volunteers:manage"],
  "delete:volunteers": ["volunteers:manage"],
  "read:teams": ["teams:view"],
  "create:teams": ["teams:manage"],
  "update:teams": ["teams:manage", "teams:manage_own"],
  "delete:teams": ["teams:manage"],
  "read:donations": ["donations:view_all", "donations:view_aggregate", "donations:view_own"],
  "update:donations": ["donations:manage"],
  "delete:donations": ["donations:manage"],
  "create:blog": ["blog:create"],
  "update:blog": ["blog:update"],
  "delete:blog": ["blog:delete"],
  "create:projects": ["campaigns:create"],
  "update:projects": ["campaigns:update"],
  "delete:projects": ["campaigns:delete"],
}

/** Reads the signed-in user and role from the server (trpc.admin.me). No provider needed. */
export function useAuth() {
  const { data, isLoading } = trpc.admin.me.useQuery(undefined, {
    staleTime: 60_000,
    retry: false,
  })
  const { signOut } = useClerk()

  const user = (data ?? null) as AuthUser | null
  const has = (p: Permission) => !!user?.permissions.includes(p)

  const hasPermission = (action: string, resource: string): boolean => {
    if (!user) return false
    if (action === "read" && ["campaigns", "events", "projects", "blog"].includes(resource)) return true
    if (resource === "profile" || resource === "comments") return true
    const mapped = LEGACY_MAP[`${action}:${resource}`]
    return mapped ? mapped.some(has) : false
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "super_admin",
    role: user?.role ?? null,
    has,
    hasAny: (ps: Permission[]) => ps.some(has),
    hasPermission,
    logout: () => signOut({ redirectUrl: "/" }),
  }
}

/** Kept so older imports keep compiling; the hook above needs no provider. */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
