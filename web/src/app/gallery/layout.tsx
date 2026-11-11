import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from Wamumbi Foundation's visits to children's homes and outreach days across Kenya.",
  openGraph: { title: "Gallery · Wamumbi Foundation", description: "Photos from Wamumbi Foundation's visits to children's homes and outreach days across Kenya." },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
