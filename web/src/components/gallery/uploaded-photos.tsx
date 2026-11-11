"use client"

import { trpc } from "@/app/_trpc/client"
import { PhotoGrid } from "@/components/gallery/lightbox"
import type { Photo } from "@/data/gallery"

type Uploaded = { id: number; url: string; width: number | null; height: number | null; alt: string | null; caption: string | null; taken_at: Date | string | null }

/** Turn an approved upload into the shape the photo grid uses. */
export function toPhoto(m: Uploaded): Photo & { caption?: string } {
  return {
    id: `upload-${m.id}`,
    src: m.url,
    srcSet: "",
    width: m.width ?? 1200,
    height: m.height ?? 900,
    blurDataURL: "",
    date: m.taken_at ? String(m.taken_at) : null,
    caption: m.caption ?? m.alt ?? undefined,
  }
}

/** Approved photos uploaded through the dashboard for one event or past-event album. */
export function UploadedPhotos({ eventId, album, title, className }: { eventId?: number; album?: string; title?: string; className?: string }) {
  const { data } = trpc.media.listApproved.useQuery({ eventId, album, limit: 100 })
  if (!data?.length) return null
  return (
    <section className={className} aria-label={title ?? "Photos"}>
      {title && <h2 className="mb-6 text-display-sm">{title}</h2>}
      <PhotoGrid photos={data.map(toPhoto)} />
    </section>
  )
}
