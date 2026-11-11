"use client"

import { SignUp } from "@clerk/nextjs"
import { AuthShell } from "@/components/auth/auth-shell"
import { useClerkAppearance } from "@/components/auth/clerk-appearance"

export default function SignUpPage() {
  const appearance = useClerkAppearance()
  return (
    <AuthShell title="Join us." intro="An account lets you register for outreach days and keep track of what you've given.">
      <SignUp appearance={appearance} path="/sign-up" routing="path" signInUrl="/sign-in" />
    </AuthShell>
  )
}
