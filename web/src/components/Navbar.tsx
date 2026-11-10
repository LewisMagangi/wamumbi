"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

const links = [
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/volunteer-signup", label: "Volunteer" },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Close the mobile menu on navigation
  useEffect(() => setOpen(false), [pathname])

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background-color,border-color] duration-base ease-out",
        scrolled || open
          ? "border-b bg-background/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-6 px-5 md:px-10" aria-label="Main">
        <Link href="/" className="flex items-center gap-2.5 rounded-md" aria-label="Wamumbi Foundation home">
          <Image src="/brand/logo-mark.png" alt="" width={32} height={32} className="h-8 w-8" priority />
          <span className="font-display text-lg font-semibold tracking-tight">Wamumbi</span>
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = pathname === l.href || pathname?.startsWith(l.href + "/")
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors duration-fast",
                    active ? "text-foreground" : scrolled ? "text-muted-foreground hover:text-foreground" : "text-foreground/85 hover:text-foreground"
                  )}
                >
                  {l.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          {mounted && (
            <>
              <SignedOut>
                <SignInButton mode="modal">
                  <Button variant="ghost" className="hidden sm:inline-flex">Sign in</Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Button variant="ghost" asChild className="hidden sm:inline-flex">
                  <Link href="/dashboard">Dashboard</Link>
                </Button>
                <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
              </SignedIn>
            </>
          )}
          <Button asChild className="ml-1 rounded-full px-5">
            <Link href="/donate">Donate</Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t bg-background lg:hidden">
          <ul className="mx-auto flex max-w-screen-xl flex-col px-5 py-3">
            {links.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block rounded-md px-2 py-3 text-base text-foreground/90 hover:bg-accent">
                  {l.label}
                </Link>
              </li>
            ))}
            {mounted && (
              <>
                <SignedOut>
                  <li>
                    <SignInButton mode="modal">
                      <button className="block w-full rounded-md px-2 py-3 text-left text-base text-foreground/90 hover:bg-accent">Sign in</button>
                    </SignInButton>
                  </li>
                </SignedOut>
                <SignedIn>
                  <li>
                    <Link href="/dashboard" className="block rounded-md px-2 py-3 text-base text-foreground/90 hover:bg-accent">Dashboard</Link>
                  </li>
                </SignedIn>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}
