import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Partner with us",
  description: "Work with Wamumbi Foundation as a company, church, school or organisation to support orphaned children in Kenya.",
  openGraph: { title: "Partner with us · Wamumbi Foundation", description: "Work with Wamumbi Foundation as a company, church, school or organisation to support orphaned children in Kenya." },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
