"use client"

import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
import type { Photo } from "@/data/gallery"
import { cn } from "@/lib/utils"

type Item = Photo & { caption?: string }

/**
 * Masonry-style photo grid with a keyboard-accessible lightbox.
 * Esc closes, arrow keys move, focus returns to the thumbnail that opened it.
 */
export function PhotoGrid({ photos, className }: { photos: Item[]; className?: string }) {
  const [index, setIndex] = useState<number | null>(null)
  const openers = useRef<Array<HTMLButtonElement | null>>([])
  const closeBtn = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setIndex((i) => {
      if (i != null) openers.current[i]?.focus()
      return null
    })
  }, [])
  const step = useCallback((d: number) => setIndex((i) => (i == null ? i : (i + d + photos.length) % photos.length)), [photos.length])

  useEffect(() => {
    if (index == null) return
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [index, close, step])

  const current = index != null ? photos[index] : null

  return (
    <>
      <ul className={cn("columns-2 gap-3 md:columns-3 lg:columns-4 [&>li]:mb-3", className)}>
        {photos.map((p, i) => (
          <li key={p.id} className="break-inside-avoid">
            <button
              ref={(el) => { openers.current[i] = el }}
              onClick={() => setIndex(i)}
              className="group relative block w-full overflow-hidden rounded-md bg-muted focus-visible:outline-offset-4"
              aria-label={`Open photo ${i + 1} of ${photos.length}${p.caption ? `: ${p.caption}` : ""}`}
            >
              <Image
                src={p.src}
                alt={p.caption ?? "Wamumbi Foundation outreach photo"}
                width={p.width}
                height={p.height}
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                placeholder="blur"
                blurDataURL={p.blurDataURL}
                className="h-auto w-full transition-transform duration-slow ease-out group-hover:scale-[1.02]"
              />
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <div role="dialog" aria-modal="true" aria-label="Photo viewer" className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm animate-in fade-in duration-200">
          <button ref={closeBtn} onClick={close} aria-label="Close" className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border bg-background/60 hover:bg-accent">
            <X className="h-5 w-5" />
          </button>
          <button onClick={() => step(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border bg-background/60 hover:bg-accent md:left-6">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => step(1)} aria-label="Next photo" className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border bg-background/60 hover:bg-accent md:right-6">
            <ChevronRight className="h-5 w-5" />
          </button>
          <figure className="flex max-h-[88vh] max-w-[92vw] flex-col items-center">
            <Image
              key={current.id}
              src={current.src}
              alt={current.caption ?? "Wamumbi Foundation outreach photo"}
              width={current.width}
              height={current.height}
              sizes="92vw"
              className="max-h-[80vh] w-auto rounded-md object-contain"
              priority
            />
            <figcaption className="mt-3 text-sm tabular-nums text-muted-foreground">
              {index! + 1} / {photos.length}{current.caption ? ` · ${current.caption}` : ""}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  )
}
