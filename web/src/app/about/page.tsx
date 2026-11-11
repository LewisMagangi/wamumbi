import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { photosFor } from "@/data/gallery"
import { PAST_EVENTS } from "@/data/past-events"

export const metadata: Metadata = {
  title: "About",
  description: "Wamumbi Foundation brings hope to orphaned children through community-based initiatives in Kenya.",
}

const values = [
  { name: "Compassion", body: "We approach every child with empathy, understanding, and unconditional love." },
  { name: "Community", body: "We believe in the power of community and work collaboratively to create lasting change." },
  { name: "Excellence", body: "We strive for excellence in everything we do, ensuring the highest quality of care and support." },
]

export default function AboutPage() {
  const [a, b] = [photosFor("kabete-childrens-home-2021")[1], photosFor("bishop-luigi-locati-2022")[0]]
  return (
    <PageShell
      title="About Wamumbi"
      intro="Bringing hope and transforming the lives of orphaned children through community-based initiatives."
    >
      <section className="grid gap-12 border-y py-14 md:grid-cols-2 md:gap-16">
        <div>
          <h2 className="font-display text-2xl">Our mission</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            To improve the lives of orphaned children and support their guardians through community-based initiatives, ensuring every child has access to safe housing, quality education, and healthcare services.
          </p>
        </div>
        <div>
          <h2 className="font-display text-2xl">Our vision</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            A world where every orphaned child has the opportunity to thrive, grow, and reach their full potential in a supportive and nurturing environment.
          </p>
        </div>
      </section>

      <section className="grid gap-12 py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div className="grid grid-cols-2 gap-3 self-start">
          {[a, b].filter(Boolean).map((p, i) => (
            <div key={p!.id} className={`relative overflow-hidden rounded-lg bg-muted ${i ? "mt-12 aspect-[3/4]" : "aspect-[3/4]"}`}>
              <Image src={p!.src} alt="Wamumbi Foundation volunteers at an outreach day" fill sizes="(min-width: 1024px) 22vw, 50vw"
                placeholder="blur" blurDataURL={p!.blurDataURL} className="object-cover" />
            </div>
          ))}
        </div>
        <div>
          <h2 className="text-display-sm">Our story</h2>
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
            <p>
              Wamumbi Charity Foundation was established with a deep commitment to making a lasting difference in the lives of orphaned children. Founded on the principles of compassion, community, and empowerment, we recognized the urgent need to provide comprehensive support to children who have lost their parents.
            </p>
            <p>
              Our journey began when a group of dedicated individuals came together, united by a shared vision of creating a better future for vulnerable children. We understood that addressing the needs of orphaned children required more than just providing basic necessities. It required a holistic approach that encompasses education, healthcare, emotional support, and community integration.
            </p>
            <p>
              Today, we work closely with local communities, guardians, and partners to ensure that every child under our care has access to the resources and opportunities they need to succeed. Through our various programs and initiatives, we continue to expand our reach and deepen our impact.
            </p>
          </div>
          <Link href="/events" className="group mt-8 inline-flex items-center gap-1.5 text-sm font-medium">
            {PAST_EVENTS.length} outreach events and counting
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      <section className="border-t py-24">
        <h2 className="text-display-sm">What we hold to</h2>
        <ol className="mt-12 grid gap-10 md:grid-cols-3">
          {values.map((v, i) => (
            <li key={v.name}>
              <p className="font-display tabular-nums text-muted-foreground">0{i + 1}</p>
              <h3 className="mt-3 font-display text-2xl">{v.name}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{v.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t pt-20">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="text-display-sm">Join us in making a difference.</h2>
            <p className="mt-4 text-lg text-muted-foreground">Together, we can transform the lives of orphaned children and give them the future they deserve.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 rounded-full px-7"><Link href="/donate">Donate now</Link></Button>
            <Button asChild size="lg" variant="outline" className="h-12 rounded-full px-7"><Link href="/volunteer-signup">Become a volunteer</Link></Button>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
