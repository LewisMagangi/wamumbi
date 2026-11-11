import type { Metadata } from "next"
import { format } from "date-fns"
import { prisma } from "@/lib/prisma"

const PUBLIC_STATUSES = ["scheduled", "ongoing", "completed", "cancelled"]

/** Title and description for event links shared on WhatsApp, Facebook and search. */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const id = Number((await params).id)
  if (!Number.isInteger(id) || id <= 0) return { title: "Event" }
  try {
    const e = await prisma.event.findUnique({
      where: { id },
      select: { title: true, description: true, event_date: true, image_url: true, status: { select: { name: true } } },
    })
    if (!e || !PUBLIC_STATUSES.includes(e.status.name)) return { title: "Event not found", robots: { index: false } }
    const description = `${format(e.event_date, "EEEE d MMMM yyyy")}. ${e.description}`.slice(0, 200)
    return {
      title: e.title,
      description,
      openGraph: { title: e.title, description, ...(e.image_url ? { images: [e.image_url] } : {}) },
    }
  } catch {
    return { title: "Event" }
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
