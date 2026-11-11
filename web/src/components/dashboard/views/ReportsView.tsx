"use client"

import { trpc } from "@/app/_trpc/client"
import { cn } from "@/lib/utils"

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })

/** Financial reports from live data (finance managers and Super Admin). */
export function ReportsView() {
  const stats = trpc.dashboard.getStats.useQuery()
  const trend = trpc.dashboard.getMonthlyDonationTrend.useQuery()
  const perf = trpc.dashboard.getCampaignPerformance.useQuery()

  const months = trend.data ?? []
  const max = Math.max(1, ...months.map((m) => m.amount))
  const yearTotal = months.reduce((s, m) => s + m.amount, 0)

  function exportCsv() {
    const lines = [["Campaign", "Goal", "Raised", "Progress %", "Donors", "Currency"], ...(perf.data ?? []).map((c) => [c.title, c.goalAmount, c.raisedAmount, Math.round(c.progress), c.donorCount, c.currency])]
    const csv = lines.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n")
    const a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    a.download = `wamumbi-campaign-performance-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="space-y-6">
      <dl className="grid overflow-hidden rounded-lg border bg-card sm:grid-cols-3">
        {[
          { label: "Raised to date", value: stats.data?.totalDonations },
          { label: "Shown period", value: yearTotal },
          { label: "Active campaigns", value: stats.data?.activeCampaigns },
        ].map((s, i) => (
          <div key={s.label} className={cn("px-5 py-5", i > 0 && "border-t sm:border-l sm:border-t-0")}>
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="mt-2 font-display text-3xl tabular-nums tracking-tight">{s.value == null ? "…" : fmt(s.value)}</dd>
          </div>
        ))}
      </dl>

      <section className="rounded-lg border bg-card">
        <header className="border-b px-5 py-3.5"><h2 className="font-sans text-sm font-medium">Donations by month</h2></header>
        {!months.length ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">{trend.isLoading ? "Loading…" : "No donations recorded yet."}</p>
        ) : (
          <figure className="px-5 pb-5 pt-6">
            <div className="flex h-56 items-end gap-3" role="img" aria-label={`Donations by month: ${months.map((m) => `${m.month} ${fmt(m.amount)}`).join(", ")}`}>
              {months.map((m) => (
                <div key={m.month} className="group flex h-full flex-1 flex-col justify-end">
                  <span className="mb-1 text-center text-xs tabular-nums text-muted-foreground">{m.amount ? fmt(m.amount) : ""}</span>
                  <div className="rounded-sm bg-foreground/80 transition-colors group-hover:bg-brand" style={{ height: `${Math.max(2, (m.amount / max) * 100)}%` }} />
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-3">{months.map((m) => <span key={m.month} className="flex-1 text-center text-xs text-muted-foreground">{m.month.slice(0, 3)}</span>)}</div>
          </figure>
        )}
      </section>

      <section className="rounded-lg border bg-card">
        <header className="flex items-center justify-between border-b px-5 py-3">
          <h2 className="font-sans text-sm font-medium">Campaign performance</h2>
          <button onClick={exportCsv} disabled={!perf.data?.length} className="rounded-full border px-3 py-1.5 text-sm transition-colors hover:bg-accent disabled:opacity-50">Export CSV</button>
        </header>
        {!perf.data?.length ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">{perf.isLoading ? "Loading…" : "No campaigns yet."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="px-5 py-2.5 font-normal">Campaign</th>
                  <th className="px-5 py-2.5 font-normal">Progress</th>
                  <th className="px-5 py-2.5 text-right font-normal">Donors</th>
                  <th className="px-5 py-2.5 text-right font-normal">Raised</th>
                  <th className="px-5 py-2.5 text-right font-normal">Goal</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {perf.data.map((c) => {
                  const pct = Math.min(100, Math.round(c.progress))
                  return (
                    <tr key={c.id} className="hover:bg-accent/40">
                      <td className="max-w-[16rem] truncate px-5 py-3">{c.title}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} /></div>
                          <span className="tabular-nums text-muted-foreground">{pct}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">{c.donorCount}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{c.currency} {fmt(c.raisedAmount)}</td>
                      <td className="px-5 py-3 text-right tabular-nums text-muted-foreground">{fmt(c.goalAmount)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}
