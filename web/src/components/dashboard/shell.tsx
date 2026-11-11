"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState, type ReactNode } from "react"
import { LogOut, Menu, X } from "lucide-react"
import { useClerk, UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "@/components/theme-toggle"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { useAuth } from "@/contexts/AuthContext"
import { navigationItems, type NavItem } from "@/components/dashboard/nav"
import { useClerkAppearance } from "@/components/auth/clerk-appearance"
import type { Permission } from "@/lib/rbac/permissions"
import { cn } from "@/lib/utils"

/** Groups for the sidebar; items are filtered by the signed-in user's role. */
const GROUPS: { label: string; names: string[] }[] = [
  { label: "Workspace", names: ["Overview", "Campaigns", "Donations", "Volunteers", "Manage events", "Projects", "Reports"] },
  { label: "Content", names: ["Photos", "Moderation", "Inbox", "Approvals"] },
  { label: "Admin", names: ["Users & roles"] },
]

function isActive(item: NavItem, pathname: string | null, tab: string | null) {
  const [path, query] = item.href.split("?")
  if (query) return pathname === path && query === `tab=${tab}`
  return pathname === path
}

function Nav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const params = useSearchParams()
  const tab = params?.get("tab") ?? null
  const { hasAny } = useAuth()
  const visible = (n: NavItem) => !n.anyOf || hasAny(n.anyOf as Permission[])
  const byName = Object.fromEntries(navigationItems.map((n) => [n.name, n]))

  return (
    <nav aria-label="Dashboard" className="space-y-7">
      {GROUPS.map((g) => {
        const items = g.names.map((n) => byName[n]).filter((n): n is NavItem => !!n && visible(n))
        if (!items.length) return null
        return (
          <div key={g.label}>
            <p className="px-3 text-xs text-muted-foreground">{g.label}</p>
            <ul className="mt-2 space-y-0.5">
              {items.map((item) => {
                const active = isActive(item, pathname, tab)
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors duration-fast",
                        active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </nav>
  )
}

function SidebarBody({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth()
  const { signOut } = useClerk()
  const appearance = useClerkAppearance()
  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2.5 px-3" onClick={onNavigate}>
        <Image src="/brand/logo-mark.png" alt="" width={28} height={28} className="h-7 w-7" />
        <span className="font-display text-lg">Wamumbi</span>
      </Link>
      <div className="mt-8 flex-1 overflow-y-auto pb-6">
        <Suspense fallback={null}>
          <Nav onNavigate={onNavigate} />
        </Suspense>
      </div>
      <div className="border-t pt-4">
        <div className="flex items-center gap-3 px-3">
          <UserButton userProfileMode="navigation" userProfileUrl="/profile" appearance={{ variables: appearance.variables, elements: { avatarBox: "h-8 w-8" } }} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{user?.name ?? "…"}</p>
            <p className="truncate text-xs text-muted-foreground">{user?.roleLabel}</p>
          </div>
          <button onClick={() => signOut({ redirectUrl: "/" })} aria-label="Sign out" className="grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * App frame for signed-in areas: persistent sidebar on desktop, drawer on mobile,
 * page title row with actions. No public navbar or footer.
 */
export function DashboardShell({
  title,
  description,
  actions,
  children,
  anyOf,
}: {
  /** Omit when the page content renders its own heading. */
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  /** Permissions needed to see the page (any one). */
  anyOf?: Permission[]
}) {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  useEffect(() => setOpen(false), [pathname])

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r bg-card/40 px-3 py-6 lg:block">
        <SidebarBody />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 border-r bg-background px-3 py-6 animate-in slide-in-from-left duration-200">
            <button onClick={() => setOpen(false)} aria-label="Close navigation" className="absolute right-3 top-5 grid h-9 w-9 place-items-center rounded-md hover:bg-accent">
              <X className="h-4 w-4" />
            </button>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/85 px-5 backdrop-blur-md md:px-8">
          <button onClick={() => setOpen(true)} aria-label="Open navigation" className="grid h-9 w-9 place-items-center rounded-md hover:bg-accent lg:hidden">
            <Menu className="h-4 w-4" />
          </button>
          <div className="flex-1" />
          <Link href="/" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">View website</Link>
          <ThemeToggle />
        </header>

        <main className="mx-auto max-w-6xl px-5 py-8 md:px-8 md:py-10">
          {title && (
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h1 className="font-display text-3xl tracking-tight md:text-4xl">{title}</h1>
                {description && <p className="mt-2 text-muted-foreground">{description}</p>}
              </div>
              {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
            </div>
          )}
          <div>
            <ProtectedRoute anyOf={anyOf}>{children}</ProtectedRoute>
          </div>
        </main>
      </div>
    </div>
  )
}
