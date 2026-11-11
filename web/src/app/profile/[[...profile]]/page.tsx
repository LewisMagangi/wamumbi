"use client"

import { UserProfile, useUser } from "@clerk/nextjs"
import { DashboardShell } from "@/components/dashboard/shell"
import { useClerkAppearance } from "@/components/auth/clerk-appearance"
import { useAuth } from "@/contexts/AuthContext"

/** Summary of who is signed in: photo, name, email and the role the Super Admin gave them. */
function AccountSummary() {
  const { user: clerkUser } = useUser()
  const { user } = useAuth()
  const name = clerkUser?.fullName || clerkUser?.username || user?.name || "…"
  const email = clerkUser?.primaryEmailAddress?.emailAddress ?? user?.email ?? ""

  return (
    <section aria-label="Your account" className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-border bg-card p-5">
      {clerkUser?.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={clerkUser.imageUrl} alt="" className="h-16 w-16 rounded-full object-cover" />
      ) : (
        <div className="h-16 w-16 rounded-full bg-muted" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-xl">{name}</p>
        <p className="truncate text-sm text-muted-foreground">{email}</p>
      </div>
      {user && (
        <div className="text-right">
          <p className="text-sm">{user.roleLabel}</p>
          <p className="text-xs text-muted-foreground">Roles are assigned by the Super Admin</p>
        </div>
      )}
    </section>
  )
}

/**
 * Account settings, handled by Clerk: profile photo, name, username, email,
 * password, connected accounts and signed-in devices.
 */
export default function ProfilePage() {
  const appearance = useClerkAppearance()
  return (
    <DashboardShell title="Your account" description="Change your photo, name, email or password.">
      <AccountSummary />
      <UserProfile
        path="/profile"
        routing="path"
        appearance={{ ...appearance, elements: { ...appearance.elements, rootBox: "w-full", cardBox: "w-full max-w-none shadow-none border border-border rounded-xl", card: "shadow-none", footer: "bg-none bg-card" } }}
      />
    </DashboardShell>
  )
}
