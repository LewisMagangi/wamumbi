"use client"

import { SignIn } from "@clerk/nextjs"
import { AuthShell } from "@/components/auth/auth-shell"
import { useClerkAppearance } from "@/components/auth/clerk-appearance"

export default function SignInPage() {
  const appearance = useClerkAppearance()
  return (
    <AuthShell>
      <SignIn appearance={appearance} path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </AuthShell>
  )
}
