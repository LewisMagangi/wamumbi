"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { format, isPast } from "date-fns"
import { ArrowLeft, CalendarDays, MapPin, Ticket, Users } from "lucide-react"
import { useUser } from "@clerk/nextjs"
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { trpc } from "@/app/_trpc/client"
import { UploadedPhotos } from "@/components/gallery/uploaded-photos"

/** Public event page with self-registration for signed-in visitors. */
export default function EventPage() {
  const params = useParams()
  const id = Number(params?.id)
  const valid = Number.isInteger(id) && id > 0
  const { isSignedIn, isLoaded } = useUser()
  const utils = trpc.useUtils()
  const { data: e, isLoading, error } = trpc.events.getById.useQuery({ id }, { enabled: valid, retry: false })
  const [done, setDone] = useState(false)
  const register = trpc.events.register.useMutation({
    onSuccess: () => { setDone(true); utils.events.getById.invalidate({ id }) },
  })

  const notFound = !valid || (error && !isLoading)
  const past = e ? isPast(new Date(e.eventDate)) : false
  const closed = e ? (e.registrationDeadline && isPast(new Date(e.registrationDeadline))) || e.availableSpots <= 0 || past || !["scheduled", "ongoing"].includes(e.status) : true
  const place = e?.address ? [e.address.street, e.address.city, e.address.country].filter(Boolean).join(", ") : "Venue to be confirmed"

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-screen-xl px-5 pb-24 pt-28 md:px-10">
        <Link href="/events" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> All events
        </Link>

        {notFound ? (
          <div className="mt-16 max-w-xl">
            <h1 className="text-display-sm">We couldn&apos;t find that event.</h1>
            <p className="mt-4 text-muted-foreground">It may have finished or been taken down. See what&apos;s coming up instead.</p>
            <Button asChild className="mt-8 rounded-full px-6"><Link href="/events">See events</Link></Button>
          </div>
        ) : isLoading || !e ? (
          <div className="mt-12 space-y-4" aria-hidden>
            <div className="h-12 w-2/3 animate-pulse rounded bg-muted" />
            <div className="aspect-[21/9] animate-pulse rounded-lg bg-muted" />
          </div>
        ) : (
          <article className="mt-10 grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
            <div>
              <p className="text-sm text-muted-foreground">{e.category}{e.status === "cancelled" ? " · Cancelled" : ""}</p>
              <h1 className="mt-3 max-w-3xl text-display-md">{e.title}</h1>
              {e.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- event images come from arbitrary hosts
                <img src={e.imageUrl} alt="" className="mt-10 aspect-[16/9] w-full rounded-lg object-cover" />
              )}
              <div className="mt-10 max-w-2xl whitespace-pre-line text-lg leading-relaxed text-muted-foreground">{e.description}</div>
            </div>

            <aside className="lg:pt-10">
              <div className="rounded-lg border bg-card p-6 lg:sticky lg:top-24">
                <dl className="space-y-5 text-sm">
                  <div className="flex gap-3">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <div><dt className="sr-only">When</dt><dd>{format(new Date(e.eventDate), "EEEE d MMMM yyyy")}<br /><span className="text-muted-foreground">{format(new Date(e.eventDate), "HH:mm")}</span></dd></div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <div><dt className="sr-only">Where</dt><dd>{place}</dd></div>
                  </div>
                  <div className="flex gap-3">
                    <Ticket className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <div><dt className="sr-only">Price</dt><dd>{e.ticketPrice ? `${e.currency} ${e.ticketPrice.toLocaleString()}` : "Free"}</dd></div>
                  </div>
                  <div className="flex gap-3">
                    <Users className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                    <div><dt className="sr-only">Places</dt><dd className="tabular-nums">{e.availableSpots > 0 ? `${e.availableSpots} of ${e.capacity} places left` : "Fully booked"}</dd></div>
                  </div>
                </dl>

                <div className="mt-6 border-t pt-6">
                  {done ? (
                    <div role="status" className="text-sm">
                      <p><span className="font-medium">You&apos;re registered.</span> <span className="text-muted-foreground">We&apos;ll see you there.</span></p>
                      {e.ticketPrice > 0 && (
                        <div className="mt-4 rounded-md bg-muted/60 p-4">
                          <p className="font-medium">Pay for your ticket with M-Pesa</p>
                          <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">
                            <li>Lipa na M-Pesa → Buy Goods and Services</li>
                            <li>Till number <span className="font-medium tabular-nums text-foreground">8392352</span></li>
                            <li>Amount <span className="font-medium tabular-nums text-foreground">{e.currency} {e.ticketPrice.toLocaleString()}</span></li>
                          </ol>
                          <p className="mt-2 text-xs text-muted-foreground">Keep the M-Pesa message; the team confirms payment at the door.</p>
                        </div>
                      )}
                    </div>
                  ) : closed ? (
                    <p className="text-sm text-muted-foreground">{past ? "This event has happened." : e.status === "cancelled" ? "This event was cancelled." : "Registration is closed."}</p>
                  ) : !isLoaded ? null : isSignedIn ? (
                    <>
                      <Button className="w-full rounded-full" disabled={register.isPending} onClick={() => register.mutate({ eventId: e.id })}>
                        {register.isPending ? "Registering…" : "Register"}
                      </Button>
                      {register.error && <p role="alert" className="mt-3 text-sm text-destructive">{register.error.message}</p>}
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full rounded-full"><Link href={`/sign-in?redirect_url=${encodeURIComponent(`/events/${e.id}`)}`}>Sign in to register</Link></Button>
                      <p className="mt-3 text-center text-xs text-muted-foreground">It takes a minute to create an account.</p>
                    </>
                  )}
                  {!closed && !done && e.registrationDeadline && (
                    <p className="mt-3 text-center text-xs text-muted-foreground">Registration closes {format(new Date(e.registrationDeadline), "d MMMM")}</p>
                  )}
                </div>
              </div>
            </aside>
          </article>
        )}
        {e && <UploadedPhotos eventId={e.id} title="Photos" className="mt-20 border-t pt-12" />}
      </main>
      <Footer />
    </>
  )
}
