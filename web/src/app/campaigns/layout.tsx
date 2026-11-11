import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Campaigns",
  description: "School fees, meals and care for orphaned children in Kenya. See what each campaign is raising for and how close it is.",
  openGraph: { title: "Campaigns · Wamumbi Foundation", description: "School fees, meals and care for orphaned children in Kenya. See what each campaign is raising for and how close it is." },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
