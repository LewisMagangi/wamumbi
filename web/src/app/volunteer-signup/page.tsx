"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { PageShell } from "@/components/page-shell"
import { Button } from "@/components/ui/button"
import { Field, FormSection, FormStatus, Honeypot, TextArea } from "@/components/forms/fields"
import { trpc } from "@/app/_trpc/client"

export default function VolunteerSignupPage() {
  const [state, setState] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState<string>()
  const [errors, setErrors] = useState<Record<string, string>>({})
  const submit = trpc.inquiries.submitVolunteer.useMutation()

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = Object.fromEntries(new FormData(form)) as Record<string, string>
    setErrors({})
    try {
      const res = await submit.mutateAsync({
        firstName: f.firstName, lastName: f.lastName, email: f.email, phone: f.phone || undefined,
        location: f.location || undefined, availability: f.availability || undefined, skills: f.skills || undefined,
        experience: f.experience || undefined, motivation: f.motivation,
        emergencyContactName: f.emergencyContactName || undefined, emergencyContactPhone: f.emergencyContactPhone || undefined,
        emergencyContactRelationship: f.emergencyContactRelationship || undefined,
        consent: f.consent === "on" ? true : (false as unknown as true),
        company_website: f.company_website || undefined,
      })
      setState("success")
      setMessage(res.message)
      form.reset()
    } catch (err) {
      const zodIssues = (err as { data?: { zodError?: { fieldErrors?: Record<string, string[]> } } }).data?.zodError?.fieldErrors
      if (zodIssues) setErrors(Object.fromEntries(Object.entries(zodIssues).map(([k, v]) => [k, v?.[0] ?? ""])))
      setState("error")
      setMessage("Something didn't go through. Check the highlighted fields, or email us at wamumbifoundation@gmail.com.")
    }
  }

  if (state === "success") {
    return (
      <PageShell title="Thank you for stepping up." width="narrow"
        intro="We've received your application. Someone from the team will get in touch soon, usually by phone or email.">
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-full px-6"><Link href="/events">See upcoming events</Link></Button>
          <Button asChild variant="outline" className="rounded-full px-6"><Link href="/gallery">Browse the gallery</Link></Button>
        </div>
      </PageShell>
    )
  }

  return (
    <PageShell
      title="Become a volunteer"
      intro="Join our team and make a difference in the lives of orphaned children. It takes about five minutes."
    >
      <form onSubmit={onSubmit} noValidate className="relative max-w-4xl">
        <Honeypot />
        <FormSection title="About you" description="So we know who to welcome.">
          <Field label="First name" name="firstName" required autoComplete="given-name" error={errors.firstName} />
          <Field label="Last name" name="lastName" required autoComplete="family-name" error={errors.lastName} />
          <Field label="Email" name="email" type="email" required autoComplete="email" error={errors.email} />
          <Field label="Phone" name="phone" type="tel" autoComplete="tel" placeholder="+254 7…" />
          <Field label="Where are you based?" name="location" className="sm:col-span-2" placeholder="e.g. Ruiru, Nairobi" autoComplete="address-level2" />
        </FormSection>

        <FormSection title="How you'd help" description="There's no wrong answer here.">
          <TextArea label="When are you usually free?" name="availability" className="sm:col-span-2" rows={2} placeholder="e.g. Weekends, some weekday evenings" />
          <TextArea label="Skills you'd like to share" name="skills" className="sm:col-span-2" rows={2} placeholder="e.g. Teaching, cooking, first aid, photography" />
          <TextArea label="Any volunteering experience?" name="experience" className="sm:col-span-2" rows={3} />
          <TextArea label="Why do you want to volunteer with us?" name="motivation" required className="sm:col-span-2" error={errors.motivation} />
        </FormSection>

        <FormSection title="Emergency contact" description="Only used if something happens during an event.">
          <Field label="Name" name="emergencyContactName" />
          <Field label="Phone" name="emergencyContactPhone" type="tel" />
          <Field label="Relationship" name="emergencyContactRelationship" className="sm:col-span-2" placeholder="e.g. Parent, sibling, friend" />
        </FormSection>

        <div className="space-y-5 border-t pt-10 md:ml-[calc(14rem+3rem)]">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="consent" required className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]" />
            <span>I agree that Wamumbi Foundation may contact me about volunteering and keep these details for that purpose.</span>
          </label>
          {errors.consent && <p className="text-sm text-destructive">{errors.consent}</p>}
          <FormStatus state={state} message={message} />
          <Button type="submit" size="lg" className="h-12 rounded-full px-8" disabled={submit.isPending}>
            {submit.isPending ? "Sending…" : "Send application"}
          </Button>
        </div>
      </form>
    </PageShell>
  )
}
