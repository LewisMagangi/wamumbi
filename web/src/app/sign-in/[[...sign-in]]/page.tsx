"use client"

import { SignIn } from "@clerk/nextjs"
import { AuthShell } from "@/components/auth/auth-shell"
import { useClerkAppearance } from "@/components/auth/clerk-appearance"

export default function SignInPage() {
  const appearance = useClerkAppearance()
  return (
    <AuthShell title="Welcome back." intro="Sign in to register for events, see your giving, or manage the foundation's work.">
      <SignIn appearance={appearance} path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </AuthShell>
  )
}
