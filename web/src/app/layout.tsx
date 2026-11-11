import { type Metadata, type Viewport } from "next"
import { ClerkProvider } from "@clerk/nextjs"
import localFont from "next/font/local"
import "./globals.css"
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site"
import TrpcProvider from "@/components/trpc-provider"
import { ThemeProvider } from "@/components/theme-provider"

// Fonts are self-hosted (no runtime call to Google Fonts): faster and more private
// Body: Hanken Grotesk, a warm humanist grotesque (OFL)
const sans = localFont({
  src: "./fonts/HankenGrotesk-Variable.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
})

const geistMono = localFont({
  src: "./fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
})

// Display: Newsreader, an editorial serif with optical sizes, for storytelling (OFL)
const display = localFont({
  src: "./fonts/Newsreader-Variable.woff2",
  variable: "--font-display",
  weight: "200 800",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Wamumbi Foundation · Touching hearts",
    template: "%s · Wamumbi Foundation",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Link previews on WhatsApp, Facebook, X and LinkedIn. The image is app/opengraph-image.jpg.
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_KE",
    title: "Wamumbi Foundation · Touching hearts",
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
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
        <body className={`${sans.variable} ${geistMono.variable} ${display.variable} antialiased`}>
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
