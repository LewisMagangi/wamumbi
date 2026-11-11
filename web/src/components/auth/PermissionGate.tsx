"use client"

import React, { ReactNode } from "react"
import { usePermissions, Resource, PermissionAction } from "../../hooks/usePermissions"
import type { Permission } from "@/lib/rbac/permissions"

type LegacyProps = { action: PermissionAction; resource: Resource; permission?: never; anyOf?: never }
type PermissionProps = { permission: Permission; action?: never; resource?: never; anyOf?: never }
type AnyOfProps = { anyOf: Permission[]; action?: never; resource?: never; permission?: never }

type PermissionGateProps = (LegacyProps | PermissionProps | AnyOfProps) & {
  children: ReactNode
  fallback?: ReactNode
}

/**
 * Renders children only when the user may perform the action. UI-only convenience:
 * the server enforces the same rules on every API call.
 *   <PermissionGate permission="media:moderate">…</PermissionGate>
 *   <PermissionGate anyOf={["donations:view_all", "donations:view_aggregate"]}>…</PermissionGate>
 *   <PermissionGate action="create" resource="campaigns">…</PermissionGate>  (legacy)
 */
export function PermissionGate(props: PermissionGateProps) {
  const { can, has, hasAny, isLoading } = usePermissions()
  if (isLoading) return null
  const allowed = props.permission
    ? has(props.permission)
    : props.anyOf
      ? hasAny(props.anyOf)
      : can(props.action as PermissionAction, props.resource as Resource)
  return <>{allowed ? props.children : props.fallback ?? null}</>
}

export function EditPermissionGate({ children, fallback = null, resource }: { children: ReactNode; fallback?: ReactNode; resource: Resource }) {
  return <PermissionGate action="update" resource={resource} fallback={fallback}>{children}</PermissionGate>
}

export function CreatePermissionGate({ children, fallback = null, resource }: { children: ReactNode; fallback?: ReactNode; resource: Resource }) {
  return <PermissionGate action="create" resource={resource} fallback={fallback}>{children}</PermissionGate>
}

export function AdminGate({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  const { isAdmin, isLoading } = usePermissions()
  if (isLoading) return null
  return <>{isAdmin ? children : fallback}</>
}
