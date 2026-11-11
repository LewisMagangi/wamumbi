import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PhotoGrid } from "@/components/gallery/lightbox"
import { PAST_EVENTS, pastEventBySlug } from "@/data/past-events"
import { coverFor, photosFor } from "@/data/gallery"

type Params = { slug: string }

export function generateStaticParams() {
  return PAST_EVENTS.map((e) => ({ slug: e.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const e = pastEventBySlug(slug)
  if (!e) return {}
  const cover = coverFor(slug)
  return {
    title: `${e.title} (${e.year})`,
    description: e.summary,
    openGraph: cover ? { images: [{ url: cover.src, width: cover.width, height: cover.height }] } : undefined,
  }
}

export default async function PastEventPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const event = pastEventBySlug(slug)
  if (!event) notFound()

  const photos = photosFor(slug).map((p) => ({ ...p, caption: `${event.title}, ${event.year}` }))
  const cover = photos[0]
  const ordered = [...PAST_EVENTS].sort((a, b) => a.year - b.year)
  const idx = ordered.findIndex((e) => e.slug === slug)
  const next = ordered[(idx + 1) % ordered.length]

  return (
    <>
      <Navbar />
      <main className="pb-24">
        <section className="relative isolate flex min-h-[60svh] items-end overflow-hidden">
          {cover && (
            <Image src={cover.src} alt="" fill priority sizes="100vw" placeholder="blur" blurDataURL={cover.blurDataURL} className="-z-20 object-cover" />
          )}
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/75 to-background/20" />
          <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-background/80 to-transparent" />
          <div className="mx-auto w-full max-w-screen-xl px-5 pb-12 pt-32 md:px-10">
            <Link href="/events" className="inline-flex items-center gap-1.5 text-sm text-foreground/80 hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> All events
            </Link>
            <p className="mt-8 text-sm tabular-nums text-foreground/80">{event.dateLabel} · {event.place}</p>
            <h1 className="mt-3 max-w-3xl text-display-md">{event.title}</h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-foreground/85">{event.summary}</p>
          </div>
        </section>

        <div className="mx-auto max-w-screen-xl px-5 md:px-10">
          <div className="mt-12">
            {photos.length ? (
              <PhotoGrid photos={photos} />
            ) : (
              <p className="rounded-lg border border-dashed px-6 py-16 text-center text-muted-foreground">Photos from this event are being added.</p>
            )}
          </div>

          <div className="mt-20 flex flex-col items-start justify-between gap-8 border-t pt-10 md:flex-row md:items-center">
            <div>
              <p className="text-sm text-muted-foreground">Help us make the next one happen.</p>
              <Button asChild className="mt-4 rounded-full px-6"><Link href="/donate">Donate</Link></Button>
            </div>
            {next && next.slug !== slug && (
              <Link href={`/events/past/${next.slug}`} className="group text-right">
                <p className="text-sm text-muted-foreground">Next event</p>
                <p className="mt-1 inline-flex items-center gap-2 font-display text-2xl">
                  {next.title} <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </p>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
