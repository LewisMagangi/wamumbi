"use client"

import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { ArrowRight } from "lucide-react"
import { PageShell } from "@/components/page-shell"
import { Reveal } from "@/components/motion"
import { Button } from "@/components/ui/button"
import { trpc } from "@/app/_trpc/client"

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })

/** Public list of live campaigns. Management lives at /dashboard/campaigns. */
export default function CampaignsPage() {
  const { data, isLoading, error } = trpc.campaigns.getAll.useQuery()
  const live = (data ?? []).filter((c) => c.status === "active")
  const done = (data ?? []).filter((c) => c.status === "completed")

  return (
    <PageShell
      title="Where your gift goes."
      intro="Each campaign pays for something specific: school fees, food, a roof. Give to the one that moves you, or to the foundation and we'll put it where it's needed most."
      aside={<Button asChild size="lg" className="rounded-full px-7"><Link href="/donate">Give now</Link></Button>}
    >
      {error ? (
        <p className="text-muted-foreground">We couldn&apos;t load campaigns right now. Please try again shortly.</p>
      ) : isLoading ? (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3" aria-hidden>
          {[0, 1, 2].map((i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-lg bg-muted" />)}
        </div>
      ) : !live.length ? (
        <div className="max-w-xl">
          <p className="font-display text-2xl">No campaigns are open right now.</p>
          <p className="mt-3 text-muted-foreground">A gift to the foundation still reaches the children we work with.</p>
          <Link href="/donate" className="group mt-6 inline-flex items-center gap-1.5 font-medium">
            Give to the foundation <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ) : (
        <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
          {live.map((c, i) => {
            const pct = Math.max(0, Math.min(100, c.progressPercentage))
            return (
              <li key={c.id}>
                <Reveal delay={(i % 3) * 0.06} className="flex h-full flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                    {c.imageUrl && <Image src={c.imageUrl} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" unoptimized />}
                  </div>
                  <p className="mt-5 text-sm text-muted-foreground">{c.category}{c.endDate ? ` · until ${format(new Date(c.endDate), "d MMM")}` : ""}</p>
                  <h2 className="mt-1.5 font-display text-2xl leading-snug">{c.title}</h2>
                  <p className="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">{c.description}</p>
                  <div className="mt-auto pt-6">
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label={`${Math.round(pct)}% funded`}>
                      <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-2.5 text-sm tabular-nums text-muted-foreground">
                      <span className="text-foreground">{fmt(c.currentAmount)}</span> raised of {fmt(c.goalAmount)} · {c.donationsCount} {c.donationsCount === 1 ? "gift" : "gifts"}
                    </p>
                    <Link href="/donate" className="group mt-5 inline-flex items-center gap-1.5 text-sm font-medium">
                      Give to this campaign <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </div>
                </Reveal>
              </li>
            )
          })}
        </ul>
      )}

      {done.length > 0 && (
        <section aria-labelledby="funded" className="mt-24 border-t pt-12">
          <h2 id="funded" className="text-display-sm">Fully funded</h2>
          <ul className="mt-8 divide-y">
            {done.map((c) => (
              <li key={c.id} className="flex flex-col justify-between gap-1 py-4 sm:flex-row sm:items-baseline">
                <span className="font-display text-xl">{c.title}</span>
                <span className="text-sm tabular-nums text-muted-foreground">{fmt(c.currentAmount)} raised · {c.donationsCount} gifts</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageShell>
  )
}
