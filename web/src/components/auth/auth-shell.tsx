import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowLeft } from "lucide-react"

/**
 * Frame for sign-in and sign-up: a photo from our outreach on large screens,
 * the form on the right. No public navbar, so the form gets full attention.
 */
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-[1fr_minmax(28rem,36rem)]">
      <div className="relative hidden lg:block">
        <Image
          src="/media/familia-moja-2024/gp-album3-003-1280.webp"
          alt="Children and volunteers at a Wamumbi Foundation outreach day"
          fill
          priority
          sizes="(min-width: 1024px) 60vw, 0px"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
        <p className="absolute inset-x-10 bottom-10 max-w-md font-display text-3xl leading-snug">
          Every visit, every meal, every school fee: thank you for being part of it.
        </p>
      </div>

      <main className="flex flex-col px-5 py-8 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src="/brand/logo-mark.png" alt="" width={28} height={28} className="h-7 w-7" />
            <span className="font-display text-lg">Wamumbi</span>
          </Link>
          <Link href="/" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Back to the website
          </Link>
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-12">
          {children}
        </div>
      </main>
    </div>
  )
}
