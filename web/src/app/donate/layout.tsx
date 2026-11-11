import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Donate",
  description: "Give with M-Pesa (till 8392352). Your gift pays for school fees, meals and care for orphaned children in Kenya.",
  openGraph: { title: "Donate · Wamumbi Foundation", description: "Give with M-Pesa (till 8392352). Your gift pays for school fees, meals and care for orphaned children in Kenya." },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
