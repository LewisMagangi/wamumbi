import generated from "./gallery.generated.json"
import { PAST_EVENTS } from "./past-events"

export type Photo = {
  id: string
  src: string
  srcSet: string
  width: number
  height: number
  blurDataURL: string
  date: string | null
}

type Generated = { hero: string | null; events: Record<string, Photo[]> }
const data = generated as Generated

export const photosFor = (slug: string): Photo[] => data.events[slug] ?? []

export const allPhotos = (): Array<Photo & { eventSlug: string }> =>
  PAST_EVENTS.flatMap((e) => photosFor(e.slug).map((p) => ({ ...p, eventSlug: e.slug })))

export const coverFor = (slug: string): Photo | undefined => photosFor(slug)[0]

export const heroPhoto = (): Photo | undefined => {
  const all = allPhotos()
  return all.find((p) => p.id === data.hero) ?? all[0]
}

export const totalPhotos = () => allPhotos().length
