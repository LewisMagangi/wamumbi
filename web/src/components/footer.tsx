import Image from "next/image"
import Link from "next/link"
import { Facebook, Instagram, Send } from "lucide-react"

const socials = [
  { href: "https://www.facebook.com/WamumbiFoundation", label: "Facebook", Icon: Facebook },
  { href: "https://www.instagram.com/wamumbifoundation", label: "Instagram", Icon: Instagram },
  { href: "https://t.me/wamumbifoundation", label: "Telegram", Icon: Send },
]

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "About us" },
      { href: "/events", label: "Events" },
      { href: "/gallery", label: "Gallery" },
      { href: "/campaigns", label: "Campaigns" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { href: "/donate", label: "Donate" },
      { href: "/volunteer-signup", label: "Volunteer" },
      { href: "/partner-with-us", label: "Partner with us" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-screen-xl px-5 py-16 md:px-10">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-xs">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <Image src="/brand/logo-mark.png" alt="" width={36} height={36} className="h-9 w-9" />
              <span className="font-display text-xl font-semibold">Wamumbi Foundation</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Touching hearts. Community outreach for orphaned and vulnerable children and the people who care for them.
            </p>
            <div className="mt-6 flex gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid h-10 w-10 place-items-center rounded-full border text-muted-foreground transition-colors duration-fast hover:text-foreground"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-sans text-sm font-medium text-foreground">{col.title}</h3>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-muted-foreground transition-colors duration-fast hover:text-foreground">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-sans text-sm font-medium text-foreground">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li><a className="hover:text-foreground" href="mailto:wamumbifoundation@gmail.com">wamumbifoundation@gmail.com</a></li>
              <li><a className="hover:text-foreground" href="tel:+254114010696">+254 114 010 696</a></li>
              <li>Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} Wamumbi Charity Foundation</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
