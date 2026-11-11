import Image from "next/image"
import Link from "next/link"
import { photosFor } from "@/data/gallery"
import { pastEventBySlug } from "@/data/past-events"
import { cn } from "@/lib/utils"

export type PhotoPick = { slug: string; index: number; alt: string }

/**
 * A row of real event photos, each captioned with the event and year and linking
 * to that event's album. Picks whose photo doesn't exist are skipped.
 */
export function PhotoStrip({ picks, className, aspect = "aspect-[4/3]" }: { picks: PhotoPick[]; className?: string; aspect?: string }) {
  const items = picks
    .map((p) => ({ ...p, photo: photosFor(p.slug)[p.index], event: pastEventBySlug(p.slug) }))
    .filter((p) => p.photo && p.event)
  if (!items.length) return null
  return (
    <ul className={cn("grid grid-cols-2 gap-3 md:grid-cols-4", className)}>
      {items.map(({ photo, event, alt, slug }) => (
        <li key={photo!.id}>
          <Link href={`/events/past/${slug}`} className="group block">
            <div className={cn("relative overflow-hidden rounded-lg bg-muted", aspect)}>
              <Image
                src={photo!.src}
                alt={alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                placeholder="blur"
                blurDataURL={photo!.blurDataURL}
                className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-2 text-xs leading-snug text-muted-foreground group-hover:text-foreground">
              {event!.title} · {event!.year}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  )
}
