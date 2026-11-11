"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useClerk, useUser } from "@clerk/nextjs"
import { trpc } from "@/app/_trpc/client"
import { Button } from "@/components/ui/button"
import { LEGAL_VERSION } from "@/lib/legal"

/** Pages people must be able to read before accepting. */
const ALLOWED_PATHS = ["/terms", "/privacy"]

/**
 * Asks everyone who is signed in to accept the current Terms of use and Privacy policy
 * before they continue. Acceptance counts if either:
 *  - they ticked Clerk's sign-up checkbox on or after LEGAL_VERSION (legalAcceptedAt), or
 *  - they accepted here (publicMetadata.termsVersion === LEGAL_VERSION).
 * Bumping LEGAL_VERSION asks everyone again.
 */
export function LegalConsentGate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const { signOut } = useClerk()
  const pathname = usePathname()
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const accept = trpc.admin.acceptTerms.useMutation()
  const headingRef = useRef<HTMLHeadingElement>(null)

  const metaVersion = (user?.publicMetadata as { termsVersion?: string } | undefined)?.termsVersion
  const signUpAcceptedAt = (user as { legalAcceptedAt?: Date | null } | null | undefined)?.legalAcceptedAt ?? null
  const accepted =
    done ||
    metaVersion === LEGAL_VERSION ||
    (signUpAcceptedAt !== null && new Date(signUpAcceptedAt).getTime() >= new Date(`${LEGAL_VERSION}T00:00:00Z`).getTime())

  const show = isLoaded && isSignedIn && !accepted && !ALLOWED_PATHS.includes(pathname ?? "")

  useEffect(() => {
    if (!show) return
    headingRef.current?.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = prev
    }
  }, [show])

  if (!show) return null

  async function onAccept() {
    setError(null)
    try {
      await accept.mutateAsync({ version: LEGAL_VERSION })
      setDone(true)
      await user?.reload()
    } catch {
      setError("That didn't save. Check your connection and try again.")
    }
  }

  return (
    <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="dialog" aria-modal="true" aria-labelledby="legal-gate-title" aria-describedby="legal-gate-desc">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" aria-hidden />
      <div className="relative w-full max-w-md rounded-xl border bg-card p-6 shadow-lg md:p-8">
        <h2 id="legal-gate-title" ref={headingRef} tabIndex={-1} className="font-display text-2xl outline-none">
          Before you continue
        </h2>
        <p id="legal-gate-desc" className="mt-3 leading-relaxed text-muted-foreground">
          Please read and accept our Terms of use and Privacy policy. They explain how you can use the site, how donations work, how we protect children, and what we do with your information.
        </p>
        <ul className="mt-4 space-y-1.5 text-sm">
          <li>
            <Link href="/terms" target="_blank" className="underline underline-offset-4">Terms of use</Link>
            <span className="text-muted-foreground"> (opens in a new tab)</span>
          </li>
          <li>
            <Link href="/privacy" target="_blank" className="underline underline-offset-4">Privacy policy</Link>
            <span className="text-muted-foreground"> (opens in a new tab)</span>
          </li>
        </ul>

        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-primary"
          />
          <span>I have read and agree to the Terms of use and Privacy policy.</span>
        </label>

        {error && <p role="alert" className="mt-4 text-sm text-destructive">{error}</p>}

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button onClick={onAccept} disabled={!agreed || accept.isPending} className="rounded-full px-6">
            {accept.isPending ? "Saving…" : "Accept and continue"}
          </Button>
          <Button variant="ghost" onClick={() => signOut({ redirectUrl: "/" })}>
            Sign out
          </Button>
        </div>
      </div>
    </div>
  )
}
