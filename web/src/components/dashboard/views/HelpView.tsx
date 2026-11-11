"use client"

import type { ReactNode } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Panel } from "@/components/dashboard/ui"
import { useAuth } from "@/contexts/AuthContext"
import type { Role } from "@/lib/rbac/roles"

const MANUAL = "/docs/wamumbi-officials-manual.pdf"

type Guide = { role: Role; title: string; where: string; steps: ReactNode[] }

const b = (s: string) => <strong className="font-medium text-foreground">{s}</strong>

const GUIDES: Guide[] = [
  {
    role: "super_admin", title: "Super Admin", where: "Users & roles · Approvals · Inbox · Activity log",
    steps: [
      <>Give each person a role in {b("Users & roles")}: search their email, pick the role. Everyone starts as Donor.</>,
      <>New campaigns and events from managers wait in {b("Approvals")}: {b("Approve and publish")} or {b("Send back")}.</>,
      <>Partner inquiries and volunteer applications land in {b("Inbox")}. Reply, then mark them In review, Accepted or Declined.</>,
      <>{b("Activity log")} shows who did what. Filter it or export a CSV.</>,
      <>When someone becomes a team leader on the Teams page, give them the {b("Team Leader")} role.</>,
    ],
  },
  {
    role: "campaign_manager", title: "Campaign Manager", where: "Campaigns",
    steps: [
      <>{b("New campaign")}: title, what it’s for, goal and currency, category (or {b("Add a category")}), dates, people it helps.</>,
      <>Add a poster with {b("Choose an image")} (JPG, PNG or WebP, up to 10 MB).</>,
      <>{b("Submit for review")}. The bell tells you when it’s approved and live.</>,
      <>Open a campaign to see progress and gifts; {b("Edit campaign")} to change it or mark it completed.</>,
    ],
  },
  {
    role: "event_coordinator", title: "Event Coordinator", where: "Manage events",
    steps: [
      <>{b("New event")}: title, description, date and start time, places, registration closing date, category.</>,
      <>{b("Ticket price")}: 0 for free. Paid events: people register, then pay by M-Pesa till {b("8392352")}. Check the M-Pesa message at the door.</>,
      <>Add a poster, then {b("Submit for review")}.</>,
      <>Click an event to see registrations; the bell tells you each time someone registers.</>,
      <>After the event, upload photos under {b("Photos")} and choose this event.</>,
    ],
  },
  {
    role: "volunteer_coordinator", title: "Volunteer Coordinator", where: "Inbox · Volunteers · Teams · Projects",
    steps: [
      <>New volunteer applications arrive in {b("Inbox")}; contact the person by email or phone.</>,
      <>{b("Add volunteer")} under Volunteers: name, email, phone, availability, emergency contact.</>,
      <>{b("New team")} under Teams: name, category, leader, member limit. Open the team to add or remove members.</>,
      <>{b("New project")} under Projects: team, dates, progress, budget. {b("Edit project")} to update it.</>,
    ],
  },
  {
    role: "finance_manager", title: "Finance Manager", where: "Donations · Reports",
    steps: [
      <>{b("Record donation")} for every M-Pesa gift: donor, campaign, amount, and the {b("M-Pesa code")}. Keep a General fund campaign for general gifts.</>,
      <>Check the list against your M-Pesa statement weekly. {b("Export CSV")} for Excel or Sheets.</>,
      <>Under {b("Reports")}, download the campaign performance CSV for board meetings.</>,
    ],
  },
  {
    role: "content_manager", title: "Content Manager", where: "Moderation",
    steps: [
      <>The bell tells you when photos are waiting in {b("Moderation")}.</>,
      <>Check consent (children need a guardian’s permission) and that the photo suits a public site.</>,
      <>Write the {b("alt text")}: one sentence describing the photo. Then {b("Approve")}, or {b("Reject")} with a reason.</>,
    ],
  },
  {
    role: "team_leader", title: "Team Leader", where: "Teams · Projects",
    steps: [
      <>Open {b("Teams")}, click your team, and add or remove members from registered volunteers.</>,
      <>Under {b("Projects")}, update progress and status on your team’s projects.</>,
    ],
  },
  {
    role: "volunteer", title: "Volunteer", where: "Events · Photos",
    steps: [
      <>Register for events on the {b("Events")} page; paid events are paid by M-Pesa till {b("8392352")}.</>,
      <>Upload photos under {b("Photos")}: choose the event, add a caption, tick consent. Up to 10 a day, 10 MB each.</>,
    ],
  },
  {
    role: "donor", title: "Donor", where: "Your giving",
    steps: [<>Giving needs no account. Signed in, {b("Your giving")} shows the gifts recorded under your name.</>],
  },
]

function GuideCard({ g, open }: { g: Guide; open?: boolean }) {
  return (
    <details open={open} className="group border-b last:border-b-0">
      <summary className="flex cursor-pointer list-none items-baseline justify-between gap-4 px-5 py-4 hover:bg-accent/40 [&::-webkit-details-marker]:hidden">
        <span className="font-display text-lg">{g.title}</span>
        <span className="text-right text-xs text-muted-foreground">{g.where}</span>
      </summary>
      <ol className="list-decimal space-y-2 px-5 pb-5 pl-10 text-sm leading-relaxed text-muted-foreground">
        {g.steps.map((s, i) => <li key={i}>{s}</li>)}
      </ol>
    </details>
  )
}

/** Officials' quick reference: the full manual in short, the reader’s own role first. */
export function HelpView() {
  const { role } = useAuth()
  const mine = GUIDES.find((g) => g.role === role)
  const others = GUIDES.filter((g) => g !== mine)

  return (
    <div className="space-y-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl tracking-tight md:text-4xl">Help</h1>
          <p className="mt-2 max-w-prose text-muted-foreground">How to use the dashboard, role by role. The full manual has every step in detail.</p>
        </div>
        <Button asChild variant="outline"><a href={MANUAL} download><Download /> Full manual (PDF)</a></Button>
      </div>

      {mine && (
        <Panel title={`Your role: ${mine.title}`}>
          <ol className="list-decimal space-y-2 px-5 py-5 pl-10 text-sm leading-relaxed text-muted-foreground">
            {mine.steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        </Panel>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Panel title="Getting started">
          <ol className="list-decimal space-y-2 px-5 py-5 pl-10 text-sm leading-relaxed text-muted-foreground">
            <li>{b("Sign in → Sign up")} with Google or email, and confirm the code.</li>
            <li>Send the Super Admin the email you used. Everyone starts as Donor until given a role.</li>
            <li>Reload: the sidebar shows your parts of the dashboard. The {b("bell")} shows what needs you.</li>
          </ol>
        </Panel>
        <Panel title="Key facts">
          <ul className="list-disc space-y-2 px-5 py-5 pl-10 text-sm leading-relaxed text-muted-foreground">
            <li>Donations and paid tickets: Lipa na M-Pesa → Buy Goods → till {b("8392352")}.</li>
            <li>New campaigns and events from managers go live only after the Super Admin approves them.</li>
            <li>Approved photos appear on their event’s page and in the Gallery.</li>
            <li>Every action is recorded in the activity log.</li>
          </ul>
        </Panel>
      </div>

      <Panel title={mine ? "Other roles" : "Roles"}>
        {others.map((g) => <GuideCard key={g.role} g={g} />)}
      </Panel>

      <Panel title="Good practice">
        <ul className="list-disc space-y-2 px-5 py-5 pl-10 text-sm leading-relaxed text-muted-foreground">
          <li>Don’t share sign-ins; ask the Super Admin for your own account.</li>
          <li>Keep donor and volunteer contact details inside the dashboard, and delete exported CSVs when you’re done.</li>
          <li>Children’s photos need guardian consent. When in doubt, don’t upload.</li>
          <li>Something wrong? Tell the Super Admin the page, what you clicked, and send a screenshot.</li>
        </ul>
      </Panel>
    </div>
  )
}
