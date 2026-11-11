import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Events",
  description: "Outreach days and visits you can join, and photos from the ones we've held since 2021.",
  openGraph: { title: "Events · Wamumbi Foundation", description: "Outreach days and visits you can join, and photos from the ones we've held since 2021." },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
