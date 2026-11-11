"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Shared dashboard primitives. Follow DESIGN.md (dashboard section): bordered
 * cards on bg-card, quiet labels, tabular numbers, color only for status.
 */

export const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })

export function StatStrip({ stats, loading }: { stats: { label: string; value: ReactNode; hint?: string }[]; loading?: boolean }) {
  return (
    <dl className={cn("grid overflow-hidden rounded-lg border bg-card", stats.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "sm:grid-cols-3")}>
      {stats.map((s, i) => (
        <div key={s.label} className={cn("px-5 py-5", i > 0 && "border-t sm:border-t-0 sm:border-l", stats.length === 4 && i === 2 && "sm:border-l-0 sm:border-t lg:border-l lg:border-t-0", stats.length === 4 && i === 3 && "sm:border-t lg:border-t-0")}>
          <dt className="text-sm text-muted-foreground">{s.label}</dt>
          <dd className="mt-2 font-display text-3xl tabular-nums tracking-tight">{loading ? "…" : s.value}</dd>
          {s.hint && <p className="mt-1 text-xs text-muted-foreground">{s.hint}</p>}
        </div>
      ))}
    </dl>
  )
}

export function Panel({ title, actions, children, className }: { title?: ReactNode; actions?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border bg-card", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5">
          {title && <h2 className="font-sans text-sm font-medium">{title}</h2>}
          {actions}
        </header>
      )}
      {children}
    </section>
  )
}

/** Search + filters row at the top of a list panel. */
export function Toolbar({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
      {children}
      {count !== undefined && <p className="text-sm text-muted-foreground sm:ml-auto">{count} shown</p>}
    </div>
  )
}

export const selectClass = "h-9 rounded-md border bg-background px-2 text-sm"

export function Empty({ children }: { children: ReactNode }) {
  return <p className="px-5 py-12 text-center text-sm text-muted-foreground">{children}</p>
}

export function ErrorText({ children }: { children: ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-destructive">{children}</p>
}

export function Skeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-5" aria-hidden>
      {Array.from({ length: rows }, (_, i) => <div key={i} className="h-4 animate-pulse rounded bg-muted" />)}
    </div>
  )
}

const tone: Record<string, string> = {
  active: "text-success", completed: "text-info", approved: "text-success", confirmed: "text-success", attended: "text-success",
  published: "text-success", upcoming: "text-info", ongoing: "text-success",
  pending_review: "text-warning", pending: "text-warning", paused: "text-warning", waitlisted: "text-warning",
  cancelled: "text-destructive", rejected: "text-destructive", failed: "text-destructive", inactive: "text-muted-foreground",
}

/** Status as colored text with a dot: no pills, per DESIGN.md. */
export function Status({ value }: { value: string }) {
  const key = value.toLowerCase().replace(/\s+/g, "_")
  return (
    <span className={cn("inline-flex items-center gap-1.5 whitespace-nowrap text-sm capitalize", tone[key] ?? "text-muted-foreground")}>
      <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-current" />
      {value.replace(/_/g, " ")}
    </span>
  )
}

export function Progress({ value, label }: { value: number; label: string }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="h-full rounded-full bg-foreground/80 transition-[width] duration-slow ease-out" style={{ width: `${v}%` }} />
    </div>
  )
}

/**
 * Right-hand sheet for create/edit forms and detail views. Traps focus loosely
 * (focuses the panel on open), closes on Escape and backdrop click.
 */
export function Sheet({ open, onClose, title, description, children, footer }: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    ref.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      prev?.focus?.()
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="sheet-title">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      <div ref={ref} tabIndex={-1} className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l bg-background shadow-xl outline-none animate-in slide-in-from-right duration-200">
        <header className="flex items-start justify-between gap-4 border-b px-6 py-5">
          <div>
            <h2 id="sheet-title" className="font-display text-2xl tracking-tight">{title}</h2>
            {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-6">{children}</div>
        {footer && <footer className="flex justify-end gap-2 border-t px-6 py-4">{footer}</footer>}
      </div>
    </div>
  )
}

/** Label/value pairs for detail sheets. */
export function Facts({ items }: { items: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
      {items.map((i) => (
        <div key={i.label}>
          <dt className="text-muted-foreground">{i.label}</dt>
          <dd className="mt-0.5">{i.value}</dd>
        </div>
      ))}
    </dl>
  )
}
