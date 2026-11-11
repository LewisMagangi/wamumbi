"use client"

import { useMemo, useState } from "react"
import { format } from "date-fns"
import { Input } from "@/components/ui/input"
import { trpc } from "@/app/_trpc/client"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })

/**
 * Donations, from the database. The server decides what each role sees:
 * finance sees everything, campaign managers see names without contact details,
 * everyone else sees only their own donations.
 */
export function DonationsView() {
  const { has, hasAny } = useAuth()
  const { data, isLoading, error } = trpc.donations.getAll.useQuery()
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")

  const rows = useMemo(() => {
    const list = data ?? []
    return list.filter((d) =>
      (status === "all" || d.status === status) &&
      (!q || `${d.donorName} ${d.campaignTitle}`.toLowerCase().includes(q.toLowerCase()))
    )
  }, [data, q, status])

  const statuses = useMemo(() => Array.from(new Set((data ?? []).map((d) => d.status))), [data])
  const completed = (data ?? []).filter((d) => d.status === "completed")
  const total = completed.reduce((s, d) => s + d.amount, 0)
  const donors = new Set(completed.map((d) => d.donorName)).size
  const own = !hasAny(["donations:view_all", "donations:view_aggregate"])
  const showEmail = has("donors:view_contact")

  return (
    <div className="space-y-6">
      <dl className="grid overflow-hidden rounded-lg border bg-card sm:grid-cols-3">
        {[
          { label: own ? "You've given" : "Completed donations", value: fmt(total) },
          { label: own ? "Donations" : "Donors", value: fmt(own ? completed.length : donors) },
          { label: "Average gift", value: fmt(completed.length ? total / completed.length : 0) },
        ].map((s, i) => (
          <div key={s.label} className={cn("px-5 py-5", i > 0 && "border-t sm:border-l sm:border-t-0")}>
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="mt-2 font-display text-3xl tabular-nums tracking-tight">{isLoading ? "…" : s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="rounded-lg border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <label htmlFor="donation-search" className="sr-only">Search donations</label>
          <Input id="donation-search" placeholder="Search donor or campaign" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
          <label htmlFor="donation-status" className="sr-only">Filter by status</label>
          <select id="donation-status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <p className="text-sm text-muted-foreground sm:ml-auto">{rows.length} shown</p>
        </div>

        {error ? (
          <p className="px-5 py-10 text-center text-sm text-destructive">{error.message}</p>
        ) : isLoading ? (
          <div className="space-y-3 p-5" aria-hidden>{[0, 1, 2, 3].map((i) => <div key={i} className="h-4 animate-pulse rounded bg-muted" />)}</div>
        ) : !rows.length ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">{data?.length ? "No donations match your filters." : "No donations recorded yet."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="px-5 py-2.5 font-normal">Date</th>
                  {!own && <th className="px-5 py-2.5 font-normal">Donor</th>}
                  <th className="px-5 py-2.5 font-normal">Campaign</th>
                  <th className="px-5 py-2.5 font-normal">Method</th>
                  <th className="px-5 py-2.5 font-normal">Status</th>
                  <th className="px-5 py-2.5 text-right font-normal">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((d) => (
                  <tr key={d.id} className="hover:bg-accent/40">
                    <td className="whitespace-nowrap px-5 py-3 tabular-nums text-muted-foreground">{format(new Date(d.donationDate), "d MMM yyyy")}</td>
                    {!own && (
                      <td className="px-5 py-3">
                        <p>{d.donorName}</p>
                        {showEmail && d.donorEmail && <p className="text-xs text-muted-foreground">{d.donorEmail}</p>}
                      </td>
                    )}
                    <td className="max-w-[14rem] truncate px-5 py-3">{d.campaignTitle}</td>
                    <td className="px-5 py-3 text-muted-foreground">{d.paymentMethod}{d.isRecurring ? " · recurring" : ""}</td>
                    <td className="px-5 py-3">
                      <span className={cn("capitalize", d.status === "completed" ? "text-success" : d.status === "failed" ? "text-destructive" : "text-muted-foreground")}>{d.status}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums">{d.currency} {fmt(d.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
