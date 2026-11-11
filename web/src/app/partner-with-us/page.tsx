"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Field, FormSection, FormStatus, Honeypot, Select, TextArea } from "@/components/forms/fields"
import { trpc } from "@/app/_trpc/client"

const reasons = [
  { title: "Community impact", body: "Make a direct impact on the lives of orphaned children." },
  { title: "Brand visibility", body: "Showcase your commitment to social responsibility." },
  { title: "Collaborative projects", body: "Work together on meaningful initiatives." },
  { title: "Ongoing support", body: "Dedicated partnership management and reporting." },
]

const orgTypes = [
  { value: "corporate", label: "Corporate" },
  { value: "foundation", label: "Foundation" },
  { value: "nonprofit", label: "Non-profit" },
  { value: "government", label: "Government agency" },
  { value: "religious", label: "Religious organisation" },
  { value: "educational", label: "Educational institution" },
  { value: "other", label: "Other" },
]

const interests = [
  { value: "financial", label: "Financial sponsorship" },
  { value: "inkind", label: "In-kind donations" },
  { value: "volunteer", label: "Corporate volunteering" },
  { value: "event", label: "Event collaboration" },
  { value: "advocacy", label: "Advocacy partnership" },
  { value: "skills", label: "Skills-based partnership" },
  { value: "other", label: "Other" },
]

export default function PartnerWithUsPage() {
  const [state, setState] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const submit = trpc.inquiries.submitPartnership.useMutation()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>
    setErrors({})
    try {
      const res = await submit.mutateAsync({
        organizationName: f.organizationName, contactPerson: f.contactPerson, email: f.email,
        phone: f.phone || undefined, organizationType: f.organizationType || undefined,
        partnershipInterest: f.partnershipInterest || undefined, message: f.message || undefined,
        website: f.website || undefined, company_website: f.company_website || undefined,
      })
      setState("success")
      setMessage(res.message)
      form.reset()
    } catch (err) {
      const fe = (err as { data?: { zodError?: { fieldErrors?: Record<string, string[]> } } }).data?.zodError?.fieldErrors
      if (fe) setErrors(Object.fromEntries(Object.entries(fe).map(([k, v]) => [k, v?.[0] ?? ""])))
      setState("error")
      setMessage("Something didn't go through. Check the highlighted fields, or email us at wamumbifoundation@gmail.com.")
    }
  }

  if (state === "success") {
    return (
      <PageShell title="Thank you. We'll be in touch." width="narrow"
        intro="Your partnership inquiry reached the team. Someone will contact you within a few days, usually by email.">
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full px-6"><Link href="/">Back to the home page</Link></Button>
          <Button asChild variant="outline" className="rounded-full px-6"><Link href="/about">Read about our work</Link></Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell title="Partner with us" intro="Join us in creating lasting change for orphaned children.">
      <div className="grid gap-16 lg:grid-cols-[1fr_2fr]">
        <ul className="space-y-8 lg:sticky lg:top-28 lg:self-start">
          {reasons.map((r) => (
            <li key={r.title}>
              <h2 className="font-display text-xl">{r.title}</h2>
              <p className="mt-1.5 text-muted-foreground">{r.body}</p>
            </li>
          ))}
        </ul>

        <form onSubmit={onSubmit} noValidate className="relative">
          <Honeypot />
          <FormSection title="Organisation">
            <Field label="Organisation name" name="organizationName" required className="sm:col-span-2" autoComplete="organization" error={errors.organizationName} />
            <Select label="Type" name="organizationType" options={orgTypes} />
            <Field label="Website" name="website" type="url" placeholder="https://" />
          </FormSection>
          <FormSection title="Contact person">
            <Field label="Full name" name="contactPerson" required className="sm:col-span-2" autoComplete="name" error={errors.contactPerson} />
            <Field label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
            <Field label="Phone" name="phone" type="tel" autoComplete="tel" />
          </FormSection>
          <FormSection title="The partnership">
            <Select label="What kind of partnership?" name="partnershipInterest" options={interests} className="sm:col-span-2" />
            <TextArea label="Tell us about your goals" name="message" className="sm:col-span-2" rows={5} />
          </FormSection>
          <div className="space-y-5 border-t pt-10">
            <FormStatus state={state} message={message} />
            <Button type="submit" size="lg" className="h-12 rounded-full px-8" disabled={submit.isPending}>
              {submit.isPending ? "Sending…" : "Send inquiry"}
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  )
}
