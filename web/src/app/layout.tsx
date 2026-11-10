import { type Metadata, type Viewport } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import localFont from "next/font/local"
import "./globals.css"
import TrpcProvider from "@/components/trpc-provider"
import { ThemeProvider } from "@/components/theme-provider"

// Fonts are self-hosted (no runtime call to Google Fonts): faster and more private
const geistSans = localFont({
  src: "./fonts/Geist-Variable.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
})

const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
})

// Display face for headings: warm, humane serif for storytelling (Fraunces, OFL)
const fraunces = localFont({
  src: "./fonts/Fraunces-Variable.woff2",
  variable: "--font-display",
  weight: "100 900",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Wamumbi Foundation · Touching hearts",
    template: "%s · Wamumbi Foundation",
  },
  description:
    "Wamumbi Foundation supports orphaned and vulnerable children and their guardians in Kenya through community outreach, education and care.",
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#100e0d" },
    { media: "(prefers-color-scheme: light)", color: "#fbfaf7" },
  ],
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={publishableKey ?? ''}>
      <html lang="en" suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} antialiased`}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
            <TrpcProvider>
              {children}
            </TrpcProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
