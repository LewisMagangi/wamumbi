"use client"

import { ReactNode, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useClerk, useUser } from "@clerk/nextjs"
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
  const { isLoaded: clerkLoaded, isSignedIn } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  // Only send people to sign-in when Clerk agrees they're signed out. If Clerk says
  // signed in but our server couldn't load the account, redirecting would loop
  // (sign-in bounces signed-in users to the home page), so show the problem instead.
  useEffect(() => {
    if (clerkLoaded && !isSignedIn) router.replace("/sign-in")
  }, [clerkLoaded, isSignedIn, router])

  if (clerkLoaded && isSignedIn && !isLoading && !isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center py-24 text-center" role="alert">
        <h2 className="font-display text-2xl">We couldn&apos;t load your account</h2>
        <p className="mt-3 text-muted-foreground">
          You&apos;re signed in, but your account didn&apos;t load from our server. Reload the page; if it keeps happening, sign out and back in, or contact the site admin.
        </p>
        <div className="mt-6 flex gap-4 text-sm">
          <button onClick={() => window.location.reload()} className="underline underline-offset-4">Reload</button>
          <button onClick={() => signOut({ redirectUrl: "/sign-in" })} className="underline underline-offset-4">Sign out</button>
        </div>
      </div>
    )
  }

  if (!clerkLoaded || isLoading || !isAuthenticated) {
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
