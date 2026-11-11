import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Volunteer",
  description: "Give your time at outreach days and children's homes with Wamumbi Foundation in Nairobi and beyond.",
  openGraph: { title: "Volunteer · Wamumbi Foundation", description: "Give your time at outreach days and children's homes with Wamumbi Foundation in Nairobi and beyond." },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
