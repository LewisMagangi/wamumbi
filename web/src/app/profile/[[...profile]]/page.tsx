"use client"

import { UserProfile } from "@clerk/nextjs"
import { DashboardShell } from "@/components/dashboard/shell"
import { useClerkAppearance } from "@/components/auth/clerk-appearance"

/** Account settings (name, email, password, connected accounts), handled by Clerk. */
export default function ProfilePage() {
  const appearance = useClerkAppearance()
  return (
    <DashboardShell title="Your account" description="Name, email, password and sign-in methods.">
      <UserProfile
        path="/profile"
        routing="path"
        appearance={{ ...appearance, elements: { ...appearance.elements, rootBox: "w-full", cardBox: "w-full max-w-none shadow-none border border-border rounded-xl" } }}
      />
    </DashboardShell>
  )
}
