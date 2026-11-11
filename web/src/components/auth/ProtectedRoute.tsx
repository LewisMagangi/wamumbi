"use client"

import { ReactNode, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "../../contexts/AuthContext"
import type { Permission } from "@/lib/rbac/permissions"

interface ProtectedRouteProps {
  children: ReactNode
  /** User needs at least one of these */
  anyOf?: Permission[]
  adminOnly?: boolean
}

/** Client-side page guard. Middleware already requires sign-in for /dashboard. */
export function ProtectedRoute({ children, anyOf, adminOnly = false }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, isAdmin, hasAny } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/sign-in")
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex h-[60vh] items-center justify-center" role="status" aria-live="polite">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
        <span className="sr-only">Loading</span>
      </div>
    )
  }

  if ((adminOnly && !isAdmin) || (anyOf && !hasAny(anyOf))) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center">
        <h2 className="font-display text-2xl">You don&apos;t have access to this page</h2>
        <p className="mt-3 text-muted-foreground">
          Your role doesn&apos;t include this area. If you think that&apos;s a mistake, ask a Super Admin to update your role.
        </p>
        <Link href="/dashboard" className="mt-6 text-sm underline underline-offset-4">Back to dashboard</Link>
      </div>
    )
  }

  return <>{children}</>
}
