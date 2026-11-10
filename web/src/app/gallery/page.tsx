"use client"

import { useMemo, useState } from "react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"
import { PhotoGrid } from "@/components/gallery/lightbox"
import { PAST_EVENTS } from "@/data/past-events"
import { allPhotos } from "@/data/gallery"
import { cn } from "@/lib/utils"

export default function GalleryPage() {
  const photos = allPhotos()
  const [filter, setFilter] = useState<string>("all")
  const events = PAST_EVENTS.filter((e) => photos.some((p) => p.eventSlug === e.slug))

  const shown = useMemo(() => {
    const list = filter === "all" ? photos : photos.filter((p) => p.eventSlug === filter)
    const titles = Object.fromEntries(PAST_EVENTS.map((e) => [e.slug, `${e.title}, ${e.year}`]))
    return list.map((p) => ({ ...p, caption: titles[p.eventSlug] }))
  }, [filter, photos])

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-screen-xl px-5 pb-24 pt-32 md:px-10">
        <p className="eyebrow">Gallery</p>
        <h1 className="mt-4 max-w-2xl text-display-md">Moments from our outreach.</h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">
          Photos from our visits and events since 2021. Every photo here was reviewed before publishing.
        </p>

        {events.length > 0 && (
          <div role="group" aria-label="Filter by event" className="mt-10 flex flex-wrap gap-2">
            {[{ slug: "all", label: "All" }, ...events.map((e) => ({ slug: e.slug, label: `${e.title.split(",")[0]} ${e.year}` }))].map((f) => (
              <button
                key={f.slug}
                onClick={() => setFilter(f.slug)}
                aria-pressed={filter === f.slug}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition-colors duration-fast",
                  filter === f.slug ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10">
          {shown.length ? (
            <PhotoGrid photos={shown} />
          ) : (
            <p className="rounded-lg border border-dashed px-6 py-16 text-center text-muted-foreground">Photos are on their way.</p>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
