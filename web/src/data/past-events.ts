/**
 * Past outreach events, compiled from the foundation's Telegram channel
 * (t.me/wamumbifoundation) and its shared Google Photos albums.
 *
 * Titles, years and places come from the album titles. The one-line summaries are
 * deliberately short and only describe what the photos show. Replace them with the
 * team's own words (what happened, who took part, how many children) when available.
 * Photos are attached by slug from gallery.generated.json (scripts/process-media.mjs).
 */
export type PastEvent = {
  slug: string
  title: string
  year: number
  dateLabel: string
  place: string
  summary: string
  /** Where the photos came from, for the record */
  source: { label: string; href: string }
}

export const PAST_EVENTS: PastEvent[] = [
  {
    slug: "kabete-childrens-home-2021",
    title: "Nairobi Children's Home, Kabete",
    year: 2021,
    dateLabel: "2021",
    place: "Kabete, Nairobi",
    summary: "A visit to the children at the Nairobi children's home in Kabete.",
    source: { label: "Google Photos album", href: "https://photos.app.goo.gl/MWDHuEYCA3qY3Adr6" },
  },
  {
    slug: "githurai-street-charity-2021",
    title: "Githurai street charity",
    year: 2021,
    dateLabel: "2021",
    place: "Githurai, Nairobi",
    summary: "Street outreach in Githurai, reaching children and families where they are.",
    source: { label: "Google Photos album", href: "https://photos.app.goo.gl/BrjJRL8CGpruZeCr5" },
  },
  {
    slug: "bishop-luigi-locati-2022",
    title: "Bishop Opera Luigi Locati",
    year: 2022,
    dateLabel: "2022",
    place: "Kenya",
    summary: "Outreach with the Bishop Opera Luigi Locati community.",
    source: { label: "Google Photos album", href: "https://photos.app.goo.gl/Z9qZPdxKjocV67ocA" },
  },
  {
    slug: "familia-moja-2024",
    title: "Familia Moja",
    year: 2024,
    dateLabel: "2024",
    place: "Kenya",
    summary: "A day with the children and caregivers of Familia Moja.",
    source: { label: "Google Photos album", href: "https://photos.app.goo.gl/X6sdrr3EswD2cwNf7" },
  },
  {
    slug: "muranga-rescue-centre-2025",
    title: "Murang'a Children's Rescue Center",
    year: 2025,
    dateLabel: "2025",
    place: "Murang'a",
    summary: "Outreach to the Murang'a Children's Rescue Center.",
    source: { label: "Telegram channel", href: "https://t.me/wamumbifoundation" },
  },
]

export const pastEventBySlug = (slug: string) => PAST_EVENTS.find((e) => e.slug === slug)
