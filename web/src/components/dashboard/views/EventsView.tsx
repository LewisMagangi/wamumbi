"use client"

import { useMemo, useState, type FormEvent } from "react"
import Link from "next/link"
import { format, isPast } from "date-fns"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, Select, TextArea } from "@/components/forms/fields"
import { trpc } from "@/app/_trpc/client"
import { useAuth } from "@/contexts/AuthContext"
import {
  Empty, ErrorText, Facts, Panel, Progress, Sheet, Skeleton, StatStrip, Status, Toolbar, fmt,
} from "@/components/dashboard/ui"

type Form = {
  title: string; description: string; date: string; time: string; capacity: string; ticketPrice: string
  currencyId: string; categoryId: string; statusId: string; imageUrl: string; registrationDeadline: string
}
const blank = (): Form => ({
  title: "", description: "", date: "", time: "09:00", capacity: "50", ticketPrice: "0",
  currencyId: "", categoryId: "", statusId: "", imageUrl: "", registrationDeadline: "",
})
const ymd = (d: Date) => format(d, "yyyy-MM-dd")

/**
 * Event management: create and edit events, see who registered. The public
 * /events page shows upcoming events and the photo-led past events.
 */
export function EventsView() {
  const { has } = useAuth()
  const { data, isLoading, error } = trpc.events.getAll.useQuery()
  const [q, setQ] = useState("")
  const [when, setWhen] = useState<"upcoming" | "past">("upcoming")
  const [editing, setEditing] = useState<number | "new" | null>(null)
  const [openId, setOpenId] = useState<number | null>(null)

  const all = useMemo(() => data ?? [], [data])
  const upcoming = all.filter((e) => !isPast(new Date(e.eventDate)))
  const rows = useMemo(() => {
    const list = all.filter((e) => (when === "upcoming") === !isPast(new Date(e.eventDate)))
      .filter((e) => !q || `${e.title} ${e.category} ${e.location}`.toLowerCase().includes(q.toLowerCase()))
    return list.sort((a, b) => {
      const d = new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
      return when === "upcoming" ? d : -d
    })
  }, [all, q, when])

  const seats = upcoming.reduce((s, e) => s + e.capacity, 0)
  const registered = upcoming.reduce((s, e) => s + e.registrationsCount, 0)
  const next = [...upcoming].sort((a, b) => +new Date(a.eventDate) - +new Date(b.eventDate))[0]

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl tracking-tight md:text-4xl">Manage events</h1>
          <p className="mt-2 text-muted-foreground">
            Plan outreach days and see who&apos;s coming. <Link href="/events" className="underline underline-offset-4 hover:text-foreground">View the public page</Link>
          </p>
        </div>
        {has("events:create") && <Button onClick={() => setEditing("new")}><Plus /> New event</Button>}
      </div>

      <StatStrip
        loading={isLoading}
        stats={[
          { label: "Upcoming events", value: fmt(upcoming.length) },
          { label: "Registered", value: fmt(registered), hint: seats ? `${Math.round((registered / seats) * 100)}% of ${fmt(seats)} places` : undefined },
          { label: "Next event", value: next ? format(new Date(next.eventDate), "d MMM") : "None", hint: next?.title },
        ]}
      />

      <Panel>
        <Toolbar count={rows.length}>
          <div role="group" aria-label="Show" className="inline-flex rounded-md border p-0.5">
            {(["upcoming", "past"] as const).map((w) => (
              <button
                key={w}
                aria-pressed={when === w}
                onClick={() => setWhen(w)}
                className={`rounded px-3 py-1.5 text-sm capitalize transition-colors duration-fast ${when === w ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {w}
              </button>
            ))}
          </div>
          <label htmlFor="event-search" className="sr-only">Search events</label>
          <Input id="event-search" placeholder="Search title, category or place" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        </Toolbar>

        {error ? <ErrorText>{error.message}</ErrorText>
          : isLoading ? <Skeleton />
          : !rows.length ? <Empty>{q ? "No events match your search." : when === "upcoming" ? "Nothing scheduled. Create an event to open registrations." : "No past events recorded."}</Empty>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-5 py-2.5 font-normal">Date</th>
                    <th className="px-5 py-2.5 font-normal">Event</th>
                    <th className="px-5 py-2.5 font-normal">Status</th>
                    <th className="w-48 px-5 py-2.5 font-normal">Registrations</th>
                    <th className="px-5 py-2.5 text-right font-normal">Ticket</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((e) => (
                    <tr key={e.id} className="cursor-pointer hover:bg-accent/40" onClick={() => setOpenId(e.id)}>
                      <td className="whitespace-nowrap px-5 py-3 tabular-nums">
                        <p>{format(new Date(e.eventDate), "d MMM yyyy")}</p>
                        <p className="text-xs text-muted-foreground">{format(new Date(e.eventDate), "HH:mm")}</p>
                      </td>
                      <td className="max-w-[18rem] px-5 py-3">
                        <button className="block max-w-full truncate text-left hover:underline" onClick={(ev) => { ev.stopPropagation(); setOpenId(e.id) }}>{e.title}</button>
                        <p className="truncate text-xs text-muted-foreground">{e.category} · {e.location}</p>
                      </td>
                      <td className="px-5 py-3"><Status value={e.status} /></td>
                      <td className="px-5 py-3">
                        <Progress value={e.capacity ? (e.registrationsCount / e.capacity) * 100 : 0} label={`${e.registrationsCount} of ${e.capacity} places taken`} />
                        <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">{e.registrationsCount} of {e.capacity}</p>
                      </td>
                      <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums">{e.ticketPrice ? `${e.currency} ${fmt(e.ticketPrice)}` : "Free"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </Panel>

      <EventForm target={editing} onClose={() => setEditing(null)} />
      <EventDetail
        id={openId}
        onClose={() => setOpenId(null)}
        onEdit={has("events:update") ? (id) => { setOpenId(null); setEditing(id) } : undefined}
        showRegistrations={has("registrations:manage") || has("registrations:manage_team") || has("events:update")}
      />
    </div>
  )
}

function EventForm({ target, onClose }: { target: number | "new" | null; onClose: () => void }) {
  const isNew = target === "new"
  const id = typeof target === "number" ? target : null
  const { has } = useAuth()
  const utils = trpc.useUtils()
  const open = target !== null
  const { data: categories = [] } = trpc.events.getCategories.useQuery(undefined, { enabled: open })
  const { data: currencies = [] } = trpc.donations.getCurrencies.useQuery(undefined, { enabled: open })
  const { data: statuses = [] } = trpc.events.getStatuses.useQuery(undefined, { enabled: open && !isNew })
  const { data: existing } = trpc.events.getById.useQuery({ id: id ?? 0 }, { enabled: id !== null })
  const [form, setForm] = useState<Form>(blank)
  const [loadedFor, setLoadedFor] = useState<number | "new" | null>(null)
  const [err, setErr] = useState<string | null>(null)

  // Fill the form once per opened target (new, or an event once it has loaded).
  if (open && loadedFor !== target && (isNew || existing?.id === id)) {
    if (isNew) setForm(blank())
    else if (existing) {
      const d = new Date(existing.eventDate)
      setForm({
        title: existing.title, description: existing.description, date: ymd(d), time: format(d, "HH:mm"),
        capacity: String(existing.capacity), ticketPrice: String(existing.ticketPrice),
        currencyId: String(existing.currencyId), categoryId: String(existing.categoryId), statusId: String(existing.statusId),
        imageUrl: existing.imageUrl ?? "",
        registrationDeadline: existing.registrationDeadline ? ymd(new Date(existing.registrationDeadline)) : "",
      })
    }
    setLoadedFor(target)
    setErr(null)
  }

  const done = () => { utils.events.getAll.invalidate(); utils.events.getById.invalidate(); setLoadedFor(null); onClose() }
  const create = trpc.events.create.useMutation({ onSuccess: done, onError: (e) => setErr(e.message) })
  const update = trpc.events.update.useMutation({ onSuccess: done, onError: (e) => setErr(e.message) })
  const pending = create.isPending || update.isPending
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const close = () => { setLoadedFor(null); onClose() }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    const base = {
      title: form.title.trim(),
      description: form.description.trim(),
      eventDate: new Date(`${form.date}T${form.time || "09:00"}`),
      capacity: Number(form.capacity),
      ticketPrice: Number(form.ticketPrice) || 0,
      categoryId: Number(form.categoryId),
      imageUrl: form.imageUrl || undefined,
      registrationDeadline: form.registrationDeadline ? new Date(`${form.registrationDeadline}T23:59`) : undefined,
    }
    if (isNew) create.mutate({ ...base, currencyId: Number(form.currencyId) })
    else if (id) update.mutate({ ...base, id, statusId: form.statusId ? Number(form.statusId) : undefined })
  }

  const canPublish = has("events:publish")
  return (
    <Sheet
      open={open}
      onClose={close}
      title={isNew ? "New event" : "Edit event"}
      description={isNew ? (canPublish ? "Registrations open as soon as you save it." : "An approver reviews it before it goes live.") : existing?.title}
      footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button type="submit" form="event-form" disabled={pending || (!isNew && loadedFor !== target)}>{pending ? "Saving…" : isNew ? (canPublish ? "Create event" : "Submit for review") : "Save changes"}</Button></>}
    >
      {!isNew && loadedFor !== target ? <Skeleton rows={6} /> : (
        <form id="event-form" onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
          <Field className="sm:col-span-2" label="Title" name="title" required value={form.title} onChange={set("title")} placeholder="Christmas visit to Kabete" />
          <TextArea className="sm:col-span-2" label="Description" name="description" required value={form.description} onChange={set("description")} hint="What happens, who it's for, what to bring." />
          <Field label="Date" name="date" type="date" required value={form.date} onChange={set("date")} />
          <Field label="Start time" name="time" type="time" required value={form.time} onChange={set("time")} />
          <Field label="Places" name="capacity" type="number" min={1} required value={form.capacity} onChange={set("capacity")} />
          <Field label="Registration closes" name="registrationDeadline" type="date" max={form.date || undefined} value={form.registrationDeadline} onChange={set("registrationDeadline")} />
          <Select label="Category" name="categoryId" required value={form.categoryId} onChange={set("categoryId")} options={categories.map((c) => ({ value: String(c.id), label: c.name }))} />
          {isNew ? (
            <Select label="Currency" name="currencyId" required value={form.currencyId} onChange={set("currencyId")} options={currencies.map((c) => ({ value: String(c.id), label: `${c.code} · ${c.name}` }))} />
          ) : (
            <Select label="Status" name="statusId" required value={form.statusId} onChange={set("statusId")} options={statuses.map((s) => ({ value: String(s.id), label: s.name.replace(/_/g, " ") }))} hint={canPublish ? undefined : "Making it live sends it for approval."} />
          )}
          <Field label="Ticket price" name="ticketPrice" type="number" min={0} value={form.ticketPrice} onChange={set("ticketPrice")} hint="0 for a free event." />
          <Field label="Image URL" name="imageUrl" type="url" value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://…" />
          {err && <p role="alert" className="text-sm text-destructive sm:col-span-2">{err}</p>}
        </form>
      )}
    </Sheet>
  )
}

function EventDetail({ id, onClose, onEdit, showRegistrations }: { id: number | null; onClose: () => void; onEdit?: (id: number) => void; showRegistrations: boolean }) {
  const { data: e, isLoading, error } = trpc.events.getById.useQuery({ id: id ?? 0 }, { enabled: id !== null })
  const place = e?.address ? [e.address.street, e.address.city, e.address.country].filter(Boolean).join(", ") : "To be confirmed"

  return (
    <Sheet
      open={id !== null}
      onClose={onClose}
      title={e?.title ?? "Event"}
      description={e ? format(new Date(e.eventDate), "EEEE d MMMM yyyy, HH:mm") : undefined}
      footer={onEdit && e ? <Button variant="outline" onClick={() => onEdit(e.id)}>Edit event</Button> : undefined}
    >
      {error ? <p className="text-sm text-destructive">{error.message}</p>
        : isLoading || !e ? <Skeleton rows={6} />
        : (
          <div className="space-y-8">
            <Status value={e.status} />
            <p className="leading-relaxed text-muted-foreground">{e.description}</p>

            <div>
              <div className="flex items-end justify-between">
                <p className="font-display text-3xl tabular-nums">{e.registrationsCount}<span className="text-lg text-muted-foreground"> / {e.capacity}</span></p>
                <p className="text-sm text-muted-foreground">{e.availableSpots > 0 ? `${e.availableSpots} places left` : "Full"}</p>
              </div>
              <div className="mt-3"><Progress value={e.capacity ? (e.registrationsCount / e.capacity) * 100 : 0} label="Places taken" /></div>
            </div>

            <Facts items={[
              { label: "Where", value: place },
              { label: "Category", value: e.category },
              { label: "Ticket", value: e.ticketPrice ? `${e.currency} ${fmt(e.ticketPrice)}` : "Free" },
              { label: "Registration closes", value: e.registrationDeadline ? format(new Date(e.registrationDeadline), "d MMM yyyy") : "When full" },
              ...(e.creator ? [{ label: "Created by", value: e.creator.name || e.creator.email }] : []),
            ]} />

            {showRegistrations && (
              <div>
                <h3 className="font-sans text-sm font-medium">Registrations</h3>
                {e.registrations.length ? (
                  <ul className="mt-3 divide-y rounded-lg border">
                    {e.registrations.map((r) => (
                      <li key={r.id} className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm">
                        <div className="min-w-0">
                          <p className="truncate">{r.userName || r.userEmail}</p>
                          <p className="truncate text-xs text-muted-foreground">{r.userEmail} · {format(new Date(r.registrationDate), "d MMM")}</p>
                        </div>
                        <Status value={r.status} />
                      </li>
                    ))}
                  </ul>
                ) : <p className="mt-2 text-sm text-muted-foreground">No one has registered yet.</p>}
                {e.registrationsCount > e.registrations.length && (
                  <p className="mt-2 text-xs text-muted-foreground">Showing the latest {e.registrations.length} of {e.registrationsCount}.</p>
                )}
              </div>
            )}
          </div>
        )}
    </Sheet>
  )
}
