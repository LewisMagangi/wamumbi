"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"
import { format } from "date-fns"
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/motion"
import { PermissionGate } from "@/components/auth/PermissionGate"
import { trpc } from "@/app/_trpc/client"
import { PAST_EVENTS } from "@/data/past-events"
import { coverFor, photosFor } from "@/data/gallery"

function Upcoming() {
  const { data, isLoading } = trpc.events.getUpcoming.useQuery(undefined, { staleTime: 60_000 })
  if (isLoading) return <p className="text-muted-foreground">Loading upcoming events…</p>
  if (!data?.length) {
    return (
      <div className="rounded-lg border border-dashed px-6 py-12">
        <p className="font-medium">No upcoming events right now.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Follow us on <a className="underline underline-offset-4" href="https://t.me/wamumbifoundation" target="_blank" rel="noopener noreferrer">Telegram</a> to hear about the next one first.
        </p>
      </div>
    )
  }
  return (
    <ul className="divide-y border-y">
      {data.map((e) => (
        <li key={e.id}>
          <Link href={`/events/${e.id}`} className="group grid gap-2 py-6 md:grid-cols-[10rem_1fr_auto] md:items-center md:gap-8">
            <p className="text-sm tabular-nums text-muted-foreground">{format(new Date(e.eventDate), "EEE d MMM yyyy")}</p>
            <div>
              <h3 className="font-display text-2xl">{e.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{e.location}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-sm font-medium">
              {e.availableSpots > 0 ? `${e.availableSpots} spots left` : "Full"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default function EventsPage() {
  const past = [...PAST_EVENTS].sort((a, b) => b.year - a.year)
  return (
    <>
      <Navbar />
      <main className="pb-24 pt-32">
        <div className="mx-auto max-w-screen-xl px-5 md:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow">Events</p>
              <h1 className="mt-4 text-display-md">Come and be part of it.</h1>
            </div>
            <PermissionGate anyOf={["events:create", "events:update"]}>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/dashboard/events"><CalendarDays /> Manage events</Link>
              </Button>
            </PermissionGate>
          </div>

          <section aria-labelledby="upcoming" className="mt-16">
            <h2 id="upcoming" className="font-sans text-sm font-medium text-muted-foreground">Upcoming</h2>
            <div className="mt-4"><Upcoming /></div>
          </section>

          <section aria-labelledby="past" className="mt-24">
            <h2 id="past" className="text-display-sm">Past events</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">Where we&apos;ve been, told in photos.</p>
            <ul className="mt-12 space-y-20">
              {past.map((e, i) => {
                const photos = photosFor(e.slug)
                const cover = coverFor(e.slug)
                return (
                  <Reveal key={e.slug}>
                    <li className={`grid items-center gap-8 md:grid-cols-2 md:gap-14 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
                      <Link href={`/events/past/${e.slug}`} className="group relative block aspect-[4/3] overflow-hidden rounded-lg bg-muted">
                        {cover ? (
                          <Image src={cover.src} alt={`${e.title}, ${e.year}`} fill sizes="(min-width: 768px) 50vw, 100vw"
                            placeholder="blur" blurDataURL={cover.blurDataURL}
                            className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.02]" />
                        ) : (
                          <span className="grid h-full place-items-center font-display text-6xl text-muted-foreground/30">{e.year}</span>
                        )}
                      </Link>
                      <div>
                        <p className="text-sm tabular-nums text-muted-foreground">{e.dateLabel} · {e.place}</p>
                        <h3 className="mt-2 font-display text-3xl">{e.title}</h3>
                        <p className="mt-4 leading-relaxed text-muted-foreground">{e.summary}</p>
                        <Link href={`/events/past/${e.slug}`} className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium">
                          {photos.length ? `See ${photos.length} photos` : "Read more"}
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </div>
                    </li>
                  </Reveal>
                )
              })}
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
