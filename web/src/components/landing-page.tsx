"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react"
import Navbar from "@/components/Navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { CountUp, Reveal } from "@/components/motion"
import { trpc } from "@/app/_trpc/client"
import { PAST_EVENTS } from "@/data/past-events"
import { allPhotos, coverFor, photosFor } from "@/data/gallery"
import { useState, type FormEvent } from "react"

const programmes = [
  {
    name: "Safe housing",
    description:
      "We ensure orphaned children have access to safe and stable housing, either through supporting existing guardians or finding suitable foster homes.",
  },
  {
    name: "Education support",
    description:
      "We provide educational materials, school fees, uniforms, and mentorship to ensure children can attend school and build a better future.",
  },
  {
    name: "Healthcare access",
    description:
      "We facilitate access to healthcare services, including regular check-ups, vaccinations, and treatment for illnesses.",
  },
]

// Figures carried over from the previous site. Update them in one place here.
const impact = [
  { value: 500, suffix: "+", label: "Children supported" },
  { value: 200, suffix: "+", label: "Families assisted" },
  { value: 50, suffix: "+", label: "Community programmes" },
  { value: PAST_EVENTS.length, suffix: "", label: "Outreach events documented" },
]

const testimonials = [
  {
    quote:
      "The Wamumbi Foundation has been a blessing to our family. After losing my parents, I didn't think I would be able to continue my education. Now I'm in my final year of high school with plans for university.",
    name: "Sarah N.",
    role: "Student, 18",
  },
  {
    quote:
      "As a guardian to my three orphaned grandchildren, I was struggling to provide for their needs. The foundation's support with food, education, and healthcare has lifted a huge burden from my shoulders.",
    name: "Grace M.",
    role: "Guardian",
  },
  {
    quote:
      "The community workshops organized by Wamumbi Foundation have equipped me with skills to better support the orphaned children in my care. Their holistic approach makes a real difference.",
    name: "John K.",
    role: "Community leader",
  },
]

const ways = [
  { title: "Donate", body: "Your contribution pays for school fees, meals and health care for children and their guardians.", href: "/donate", cta: "Give today" },
  { title: "Volunteer", body: "Share your time and skills at outreach days, mentoring and events.", href: "/volunteer-signup", cta: "Join the team" },
  { title: "Partner with us", body: "Organisations and businesses can partner with us for lasting, community-led impact.", href: "/partner-with-us", cta: "Start a conversation" },
]

function SectionHeader({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <Reveal className="max-w-2xl">
      <h2 id={`h-${eyebrow.toLowerCase().replace(/\s+/g, "-")}`} className="text-display-sm">{title}</h2>
      {children && <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{children}</p>}
    </Reveal>
  )
}

function Hero() {
  return (
    <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden">
      <Image
        src="/hero.png"
        alt="Illustration of a grandmother, a mother and two children smiling together"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[60%_85%] motion-safe:animate-[hero-zoom_18s_ease-out_both]"
      />
      {/* Scrim: strong on the left behind the text, light at the bottom so the whole family stays visible */}
      <div aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-1/4 bg-gradient-to-t from-background/90 to-transparent" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/75 via-35% to-transparent to-60%" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-background/80 to-transparent" />

      <div className="mx-auto w-full max-w-screen-xl px-5 pb-16 pt-32 md:px-10 md:pb-24">
        <Reveal>
          <h1 className="max-w-3xl text-display-lg">Bringing hope to orphaned children.</h1>
        </Reveal>
        <Reveal delay={0.16}>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-foreground/85 md:text-xl">
            We improve the lives of orphaned children and support their guardians through community-based initiatives across Kenya.
          </p>
        </Reveal>
        <Reveal delay={0.24} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="group h-12 rounded-full px-7 text-base">
            <Link href="/donate">
              Donate now
              <ArrowRight className="transition-transform duration-base ease-out group-hover:translate-x-0.5" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="ghost" className="h-12 rounded-full px-7 text-base">
            <Link href="#story">See our work</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}

function Impact() {
  return (
    <section aria-label="Our impact" className="border-y">
      <dl className="mx-auto grid max-w-screen-xl grid-cols-2 px-5 md:grid-cols-4 md:px-10">
        {impact.map((s, i) => (
          <div key={s.label} className={`py-10 md:py-14 ${i % 2 ? "pl-6" : ""} md:pl-0 ${i ? "md:border-l md:pl-8" : ""}`}>
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="mt-2 font-display text-4xl tracking-tight md:text-5xl">
              <CountUp to={s.value} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function WhatWeDo() {
  return (
    <section className="mx-auto max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
      <div className="grid gap-16 lg:grid-cols-[1fr_1.1fr]">
        <SectionHeader eyebrow="What we do" title="Holistic care, rooted in the community.">
          Wamumbi Charity Foundation is a non-profit, community-based organisation. We work directly within communities to identify vulnerable children and families, offering support through education, healthcare, nutrition and emotional well-being programmes.
        </SectionHeader>
        <ol className="divide-y border-y">
          {programmes.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.06}>
              <li className="grid grid-cols-[3rem_1fr] gap-4 py-8">
                <span className="font-display text-lg text-muted-foreground tabular-nums">0{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl">{p.name}</h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{p.description}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
      <Reveal className="mt-16">
        <p className="max-w-3xl font-display text-2xl leading-snug text-foreground/90 md:text-3xl">
          We believe every child deserves love, care, and the opportunity to reach their full potential, regardless of their circumstances.
        </p>
      </Reveal>
    </section>
  )
}

function Story() {
  const events = [...PAST_EVENTS].sort((a, b) => a.year - b.year)
  return (
    <section id="story" className="scroll-mt-20 border-t bg-card/40 py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-5 md:px-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeader eyebrow="Our story so far" title="Five years of showing up." />
          <Reveal>
            <Link href="/events" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
              All events <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
        </div>

        <ol className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((e, i) => {
            const cover = coverFor(e.slug)
            const count = photosFor(e.slug).length
            return (
              <Reveal key={e.slug} delay={i * 0.06}>
                <li>
                  <Link href={`/events/past/${e.slug}`} className="group block">
                    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
                      {cover ? (
                        <Image src={cover.src} alt={`${e.title}, ${e.year}`} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 50vw, 100vw"
                          placeholder="blur" blurDataURL={cover.blurDataURL}
                          className="object-cover transition-transform duration-slow ease-out group-hover:scale-[1.03]" />
                      ) : (
                        <div className="grid h-full place-items-center font-display text-5xl text-muted-foreground">{e.year}</div>
                      )}
                    </div>
                    <p className="mt-4 text-sm tabular-nums text-muted-foreground">{e.dateLabel}{count ? ` · ${count} photos` : ""}</p>
                    <h3 className="mt-1 font-display text-xl leading-snug group-hover:underline group-hover:underline-offset-4">{e.title}</h3>
                  </Link>
                </li>
              </Reveal>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function GalleryTeaser() {
  const photos = allPhotos()
  if (photos.length < 5) return null
  // Spread picks across events so the teaser tells the whole story
  const picks = PAST_EVENTS.flatMap((e) => photos.filter((p) => p.eventSlug === e.slug).slice(1, 3)).slice(0, 7)
  const spans = ["col-span-2 row-span-2", "", "", "row-span-2", "", "col-span-2", ""]
  return (
    <section className="mx-auto max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeader eyebrow="Gallery" title="Moments we keep." />
        <Reveal>
          <Button asChild variant="outline" className="rounded-full">
            <Link href="/gallery">Open the gallery <ArrowRight /></Link>
          </Button>
        </Reveal>
      </div>
      <div className="mt-12 grid auto-rows-[160px] grid-cols-2 gap-3 md:auto-rows-[200px] md:grid-cols-4">
        {picks.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.04} className={`relative overflow-hidden rounded-lg bg-muted ${spans[i] ?? ""}`}>
            <Image src={p.src} alt="Wamumbi Foundation outreach" fill sizes="(min-width: 768px) 25vw, 50vw"
              placeholder="blur" blurDataURL={p.blurDataURL} className="object-cover" />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Campaigns() {
  const { data } = trpc.campaigns.getActive.useQuery(undefined, { staleTime: 60_000 })
  const items = (data ?? []).slice(0, 3)
  if (!items.length) return null
  return (
    <section className="border-t py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-5 md:px-10">
        <SectionHeader eyebrow="Active campaigns" title="Where your gift goes right now." />
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((c, i) => {
            const pct = Math.min(100, Math.round(c.progressPercentage))
            return (
              <Reveal key={c.id} delay={i * 0.06}>
                <li className="flex h-full flex-col rounded-lg border bg-card p-6">
                  <p className="text-sm text-muted-foreground">{c.category}</p>
                  <h3 className="mt-2 font-display text-xl leading-snug">{c.title}</h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{c.description}</p>
                  <div className="mt-auto pt-6">
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${c.title} progress`}>
                      <div className="h-full rounded-full bg-brand transition-[width] duration-slow ease-out" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-3 flex justify-between text-sm tabular-nums">
                      <span>{c.raised.toLocaleString()} raised</span>
                      <span className="text-muted-foreground">{pct}%</span>
                    </p>
                    <Link href="/donate" className="mt-5 inline-flex items-center gap-1 text-sm font-medium underline-offset-4 hover:underline">
                      Support this campaign <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </li>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function Voices() {
  return (
    <section className="border-t bg-card/40 py-24 md:py-32">
      <div className="mx-auto max-w-screen-xl px-5 md:px-10">
        <SectionHeader eyebrow="Voices" title="In their words." />
        <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06}>
              <figure className="flex h-full flex-col">
                <blockquote className="font-display text-xl leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="font-medium">{t.name}</span>
                  <span className="text-muted-foreground"> · {t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function GetInvolved() {
  return (
    <section className="mx-auto max-w-screen-xl px-5 py-24 md:px-10 md:py-32">
      <SectionHeader eyebrow="Get involved" title="There's a place for you here." />
      <ul className="mt-12 divide-y border-y">
        {ways.map((w, i) => (
          <Reveal key={w.title} delay={i * 0.05}>
            <li>
              <Link href={w.href} className="group grid gap-3 py-8 md:grid-cols-[1fr_2fr_auto] md:items-center md:gap-10">
                <h3 className="font-display text-3xl">{w.title}</h3>
                <p className="text-muted-foreground">{w.body}</p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium">
                  {w.cta}
                  <ArrowRight className="h-4 w-4 transition-transform duration-base ease-out group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}

function Contact() {
  const [sent, setSent] = useState(false)
  // No backend for general messages yet: compose an email in the visitor's mail app.
  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const subject = encodeURIComponent(String(f.get("subject") || "Message from the website"))
    const body = encodeURIComponent(`${f.get("message")}\n\n${f.get("name")} <${f.get("email")}>`)
    window.location.href = `mailto:wamumbifoundation@gmail.com?subject=${subject}&body=${body}`
    setSent(true)
  }
  const field = "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  return (
    <section id="contact" className="scroll-mt-20 border-t py-24 md:py-32">
      <div className="mx-auto grid max-w-screen-xl gap-16 px-5 md:grid-cols-2 md:px-10">
        <div>
          <SectionHeader eyebrow="Contact" title="Talk to us.">
            Questions about our work, a visit, or a partnership? We read every message.
          </SectionHeader>
          <ul className="mt-10 space-y-5 text-sm">
            <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-muted-foreground" /><a className="hover:underline" href="tel:+254114010696">+254 114 010 696</a></li>
            <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-muted-foreground" /><a className="hover:underline" href="mailto:wamumbifoundation@gmail.com">wamumbifoundation@gmail.com</a></li>
            <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-muted-foreground" />Nairobi, Kenya</li>
          </ul>
        </div>
        <Reveal>
          <form onSubmit={onSubmit} className="space-y-4 rounded-lg border bg-card p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium">Name</label>
                <input id="name" name="name" required autoComplete="name" className={field} />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium">Email</label>
                <input id="email" name="email" type="email" required autoComplete="email" className={field} />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="mb-1.5 block text-sm font-medium">Subject</label>
              <input id="subject" name="subject" className={field} />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium">Message</label>
              <textarea id="message" name="message" rows={5} required className={field} />
            </div>
            <Button type="submit" className="w-full rounded-full">Write to us</Button>
            <p className="text-xs text-muted-foreground" aria-live="polite">
              {sent ? "Your email app should have opened with your message." : "Opens your email app with the message filled in."}
            </p>
          </form>
        </Reveal>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Impact />
        <WhatWeDo />
        <Story />
        <GalleryTeaser />
        <Campaigns />
        <Voices />
        <GetInvolved />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
