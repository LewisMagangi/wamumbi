import type { MetadataRoute } from "next"
import { PAST_EVENTS } from "@/data/past-events"
import { prisma } from "@/lib/prisma"
import { SITE_URL } from "@/lib/site"

export const revalidate = 3600

/** Public pages for search engines. Staff and account pages are left out on purpose. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const pages: MetadataRoute.Sitemap = [
    { path: "", priority: 1 },
    { path: "/donate", priority: 0.9 },
    { path: "/about", priority: 0.8 },
    { path: "/events", priority: 0.8 },
    { path: "/campaigns", priority: 0.8 },
    { path: "/gallery", priority: 0.7 },
    { path: "/volunteer-signup", priority: 0.7 },
    { path: "/partner-with-us", priority: 0.6 },
    { path: "/terms", priority: 0.2 },
    { path: "/privacy", priority: 0.2 },
  ].map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: now, priority: p.priority }))

  const past = PAST_EVENTS.map((e) => ({ url: `${SITE_URL}/events/past/${e.slug}`, lastModified: now, priority: 0.6 }))

  let upcoming: MetadataRoute.Sitemap = []
  try {
    const events = await prisma.event.findMany({
      where: { status: { name: { in: ["scheduled", "ongoing"] } } },
      select: { id: true, updated_at: true },
    })
    upcoming = events.map((e) => ({ url: `${SITE_URL}/events/${e.id}`, lastModified: e.updated_at, priority: 0.7 }))
  } catch {
    // Database unavailable at build time: list the static pages only.
  }

  return [...pages, ...past, ...upcoming]
}
