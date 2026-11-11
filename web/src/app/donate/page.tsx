"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Check, Copy } from "lucide-react"
import { PageShell } from "@/components/page-shell"
import { photosFor } from "@/data/gallery"
import { PhotoStrip } from "@/components/photo-strip"

const TILL = "8392352"

const steps = [
  "Open M-Pesa on your phone",
  "Select “Lipa na M-Pesa”, then “Buy Goods and Services”",
  `Enter till number ${TILL}`,
  "Enter the amount you wish to give",
  "Enter your M-Pesa PIN and confirm",
]

const uses = [
  "School fees, uniforms and books",
  "Meals and essentials at outreach days",
  "Health check-ups and hygiene supplies",
]

export default function DonatePage() {
  const [copied, setCopied] = useState(false)
  const photo = photosFor("familia-moja-2024")[0]

  async function copyTill() {
    try {
      await navigator.clipboard.writeText(TILL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <PageShell
      title="Make a difference today."
      intro="Your generosity helps us provide hope and support to orphaned children."
    >
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        <section aria-labelledby="mpesa" className="rounded-lg border bg-card p-6 md:p-10">
          <h2 id="mpesa" className="font-display text-2xl">Give with M-Pesa</h2>
          <p className="mt-2 text-muted-foreground">Quick and secure, straight from your phone.</p>

          <div className="mt-8 rounded-lg bg-muted/60 p-6">
            <p className="text-sm text-muted-foreground">Till number · Wamumbi Blossoms</p>
            <div className="mt-2 flex flex-wrap items-center gap-4">
              <p className="font-display text-5xl tabular-nums tracking-tight md:text-6xl">{TILL}</p>
              <button
                onClick={copyTill}
                className="inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors duration-fast hover:bg-accent"
                aria-label="Copy till number"
              >
                {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <ol className="mt-8 space-y-4">
            {steps.map((s, i) => (
              <li key={s} className="grid grid-cols-[2rem_1fr] items-baseline">
                <span className="font-display tabular-nums text-muted-foreground">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>

          <p className="mt-10 border-t pt-6 text-sm text-muted-foreground">
            Card and online payments are coming. Until then, M-Pesa is the fastest way to give. Questions or receipts:{" "}
            <a className="underline underline-offset-4 hover:text-foreground" href="mailto:wamumbifoundation@gmail.com">wamumbifoundation@gmail.com</a>
          </p>
        </section>

        <aside className="space-y-8">
          {photo && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-muted">
              <Image src={photo.src} alt="Volunteers serving a meal at Familia Moja" fill sizes="(min-width: 1024px) 40vw, 100vw"
                placeholder="blur" blurDataURL={photo.blurDataURL} className="object-cover" />
            </div>
          )}
          <div>
            <h2 className="font-display text-2xl">Where your gift goes</h2>
            <ul className="mt-4 divide-y border-y">
              {uses.map((u) => <li key={u} className="py-3 text-muted-foreground">{u}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl">Your support in action</h2>
            <PhotoStrip
              className="mt-4 grid-cols-3 md:grid-cols-3"
              aspect="aspect-square"
              picks={[
                { slug: "uloma-primary-school-2026", index: 4, alt: "Preparing a meal for pupils at Uloma Primary School" },
                { slug: "familia-moja-2024", index: 0, alt: "Children at a meal during the Familia Moja outreach" },
                { slug: "uloma-primary-school-2026", index: 1, alt: "A mentoring session at Uloma Primary School" },
              ]}
            />
          </div>
          <p className="text-muted-foreground">
            Prefer to give time? <Link href="/volunteer-signup" className="text-foreground underline underline-offset-4">Volunteer with us</Link>.
          </p>
        </aside>
      </div>
    </PageShell>
  )
}
