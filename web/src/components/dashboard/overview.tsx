"use client"

import Link from "next/link"
import { format } from "date-fns"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { trpc } from "@/app/_trpc/client"
import type { Permission } from "@/lib/rbac/permissions"
import { cn } from "@/lib/utils"

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })

function Panel({ title, href, linkLabel, children, className }: { title: string; href?: string; linkLabel?: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-lg border bg-card", className)}>
      <header className="flex items-center justify-between border-b px-5 py-3.5">
        <h2 className="font-sans text-sm font-medium">{title}</h2>
        {href && (
          <Link href={href} className="group inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            {linkLabel ?? "View all"} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </header>
      <div>{children}</div>
    </section>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p className="px-5 py-10 text-center text-sm text-muted-foreground">{children}</p>
}

function Skeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-5" aria-hidden>
      {Array.from({ length: rows }).map((_, i) => <div key={i} className="h-4 animate-pulse rounded bg-muted" style={{ width: `${90 - i * 15}%` }} />)}
    </div>
  )
}

function Attention() {
  const { has, hasAny } = useAuth()
  const approvals = trpc.admin.pendingContent.useQuery(undefined, { enabled: hasAny(["campaigns:publish", "events:publish", "blog:publish"]) })
  const photos = trpc.media.queue.useQuery({ status: "pending" }, { enabled: has("media:moderate") })
  const volunteers = trpc.inquiries.list.useQuery({ kind: "volunteer", status: "new" }, { enabled: has("volunteers:manage") })
  const partners = trpc.inquiries.list.useQuery({ kind: "partnership", status: "new" }, { enabled: has("users:manage") })

  const items = [
    { n: approvals.data?.length ?? 0, label: "waiting for your approval", href: "/dashboard/admin?tab=approvals" },
    { n: photos.data?.length ?? 0, label: "photos to review", href: "/dashboard/admin?tab=moderation" },
    { n: volunteers.data?.length ?? 0, label: "new volunteer applications", href: "/dashboard/admin?tab=inbox" },
    { n: partners.data?.length ?? 0, label: "new partnership inquiries", href: "/dashboard/admin?tab=inbox" },
  ].filter((i) => i.n > 0)

  if (!items.length) return null
  return (
    <ul className="flex flex-wrap gap-2" aria-label="Needs your attention">
      {items.map((i) => (
        <li key={i.label}>
          <Link href={i.href} className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm transition-colors hover:bg-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
            <span className="font-medium tabular-nums">{i.n}</span>
            <span className="text-muted-foreground">{i.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

function Stats() {
  const { hasAny } = useAuth()
  const { data, isLoading } = trpc.dashboard.getStats.useQuery()
  const money = hasAny(["donations:view_all", "donations:view_aggregate", "reports:view_financial"])
  const stats = [
    money && { label: "Raised to date", value: data?.totalDonations },
    { label: "Active campaigns", value: data?.activeCampaigns },
    { label: "Volunteers", value: data?.totalVolunteers },
    { label: "Upcoming events", value: data?.upcomingEvents },
  ].filter(Boolean) as { label: string; value?: number }[]

  return (
    <dl className={cn("grid grid-cols-2 overflow-hidden rounded-lg border bg-card", stats.length === 4 ? "lg:grid-cols-4" : "lg:grid-cols-3")}>
      {stats.map((s, i) => (
        <div key={s.label} className={cn("px-5 py-5", i % 2 === 1 && "border-l", i >= 2 && "border-t lg:border-t-0", i > 0 && "lg:border-l")}>
          <dt className="text-sm text-muted-foreground">{s.label}</dt>
          <dd className="mt-2 font-display text-3xl tabular-nums tracking-tight">
            {isLoading ? <span className="inline-block h-8 w-20 animate-pulse rounded bg-muted align-middle" /> : fmt(s.value ?? 0)}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Trend() {
  const { data, isLoading } = trpc.dashboard.getMonthlyDonationTrend.useQuery()
  const rows = data ?? []
  const max = Math.max(1, ...rows.map((r) => r.amount))
  return (
    <Panel title="Donations by month" href="/reports" linkLabel="Reports">
      {isLoading ? <Skeleton /> : !rows.length ? <Empty>No donations recorded yet.</Empty> : (
        <figure className="px-5 pb-5 pt-6">
          <div className="flex h-40 items-end gap-2" role="img" aria-label={`Donations by month: ${rows.map((r) => `${r.month} ${fmt(r.amount)}`).join(", ")}`}>
            {rows.map((r) => (
              <div key={r.month} className="group flex h-full flex-1 flex-col justify-end">
                <span className="mb-1 text-center text-xs tabular-nums text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">{fmt(r.amount)}</span>
                <div className="rounded-sm bg-foreground/80 transition-colors group-hover:bg-brand" style={{ height: `${Math.max(2, (r.amount / max) * 100)}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            {rows.map((r) => <span key={r.month} className="flex-1 text-center text-xs text-muted-foreground">{r.month.slice(0, 3)}</span>)}
          </div>
        </figure>
      )}
    </Panel>
  )
}

function RecentDonations() {
  const { data, isLoading } = trpc.dashboard.getRecentDonations.useQuery()
  return (
    <Panel title="Recent donations" href="/donations">
      {isLoading ? <Skeleton rows={4} /> : !data?.length ? <Empty>No donations yet.</Empty> : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b">
                <th className="px-5 py-2.5 font-normal">Donor</th>
                <th className="px-5 py-2.5 font-normal">Campaign</th>
                <th className="px-5 py-2.5 text-right font-normal">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.slice(0, 6).map((d) => (
                <tr key={d.id} className="hover:bg-accent/40">
                  <td className="px-5 py-3">
                    <p>{d.donorName}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(d.donationDate), "d MMM")}</p>
                  </td>
                  <td className="max-w-[12rem] truncate px-5 py-3 text-muted-foreground">{d.campaignTitle}</td>
                  <td className="px-5 py-3 text-right tabular-nums">{d.currencySymbol}{fmt(d.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Panel>
  )
}

function Campaigns() {
  const { data, isLoading } = trpc.dashboard.getActiveCampaigns.useQuery()
  return (
    <Panel title="Active campaigns" href="/campaigns">
      {isLoading ? <Skeleton /> : !data?.length ? <Empty>No active campaigns.</Empty> : (
        <ul className="divide-y">
          {data.slice(0, 4).map((c) => {
            const pct = Math.min(100, Math.round(c.progress))
            return (
              <li key={c.id} className="px-5 py-4">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="truncate">{c.title}</p>
                  <p className="text-sm tabular-nums text-muted-foreground">{pct}%</p>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.title} progress`}>
                  <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                </div>
                <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">{c.currencySymbol}{fmt(c.currentAmount)} of {c.currencySymbol}{fmt(c.goalAmount)}</p>
              </li>
            )
          })}
        </ul>
      )}
    </Panel>
  )
}

function Events() {
  const { data, isLoading } = trpc.dashboard.getUpcomingEvents.useQuery()
  return (
    <Panel title="Upcoming events" href="/events">
      {isLoading ? <Skeleton /> : !data?.length ? <Empty>Nothing scheduled.</Empty> : (
        <ul className="divide-y">
          {data.slice(0, 5).map((e) => (
            <li key={e.id}>
              <Link href={`/events/${e.id}`} className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 px-5 py-3.5 hover:bg-accent/40">
                <span className="text-center">
                  <span className="block text-xs text-muted-foreground">{format(new Date(e.eventDate), "MMM")}</span>
                  <span className="block font-display text-xl tabular-nums">{format(new Date(e.eventDate), "d")}</span>
                </span>
                <span className="truncate">{e.title}</span>
                <span className="text-sm tabular-nums text-muted-foreground">{e.registrationsCount}/{e.capacity}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

function MyGiving() {
  const { data, isLoading } = trpc.donations.getAll.useQuery()
  return (
    <Panel title="Your giving">
      {isLoading ? <Skeleton /> : !data?.length ? (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-muted-foreground">You haven&apos;t recorded a donation yet.</p>
          <Button asChild className="mt-4 rounded-full"><Link href="/donate">Donate</Link></Button>
        </div>
      ) : (
        <ul className="divide-y">
          {data.slice(0, 8).map((d) => (
            <li key={d.id} className="flex items-center justify-between px-5 py-3 text-sm">
              <span>
                <span className="block">{d.campaignTitle}</span>
                <span className="text-xs text-muted-foreground">{format(new Date(d.donationDate), "d MMM yyyy")} · {d.status}</span>
              </span>
              <span className="tabular-nums">{d.currency} {fmt(d.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

const ACTIONS: { label: string; href: string; anyOf: Permission[] }[] = [
  { label: "New campaign", href: "/campaigns", anyOf: ["campaigns:create"] },
  { label: "Create event", href: "/dashboard/events", anyOf: ["events:create"] },
  { label: "Add volunteer", href: "/volunteers", anyOf: ["volunteers:manage"] },
  { label: "Upload photos", href: "/dashboard/admin?tab=uploads", anyOf: ["media:upload", "media:upload_restricted"] },
]

export function QuickActions() {
  const { hasAny } = useAuth()
  const actions = ACTIONS.filter((a) => hasAny(a.anyOf))
  if (!actions.length) return null
  return (
    <>
      {actions.map((a, i) => (
        <Button key={a.label} asChild size="sm" variant={i === 0 ? "default" : "outline"} className="rounded-full px-4">
          <Link href={a.href}>{a.label}</Link>
        </Button>
      ))}
    </>
  )
}

export function Overview() {
  const { has, hasAny, role, isLoading } = useAuth()
  if (isLoading) return <Skeleton rows={5} />

  if (role === "donor") {
    return (
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <MyGiving />
        <Events />
      </div>
    )
  }

  const money = hasAny(["donations:view_all", "donations:view_aggregate"])
  return (
    <div className="space-y-6">
      <Attention />
      <Stats />
      {money && (
        <div className="grid gap-6 lg:grid-cols-2">
          <Trend />
          <RecentDonations />
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <Events />
        {has("campaigns:create") || money ? <Campaigns /> : <MyGiving />}
      </div>
    </div>
  )
}
