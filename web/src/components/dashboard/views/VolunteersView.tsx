"use client"

import { useMemo, useState, type FormEvent } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, Select, TextArea } from "@/components/forms/fields"
import { trpc } from "@/app/_trpc/client"
import { useAuth } from "@/contexts/AuthContext"
import {
  Empty, ErrorText, Facts, Panel, Sheet, Skeleton, StatStrip, Status, Toolbar, fmt, selectClass,
} from "@/components/dashboard/ui"

const hours = (v: unknown) => Number(v) || 0

function Avatar({ name, src }: { name: string; src: string | null }) {
  const initials = name.split(" ").map((p) => p[0]).filter(Boolean).slice(0, 2).join("").toUpperCase()
  return src ? (
    <Image src={src} alt="" width={32} height={32} className="h-8 w-8 shrink-0 rounded-full object-cover" />
  ) : (
    <span aria-hidden className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-muted text-xs text-muted-foreground">{initials || "?"}</span>
  )
}

/**
 * Volunteers. The server scopes the list by role: team leads see their teams,
 * some roles see anonymized records (no contact details).
 */
export function VolunteersView() {
  const { has } = useAuth()
  const canManage = has("volunteers:manage")
  const { data, isLoading, error } = trpc.volunteers.getAll.useQuery()
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")
  const [adding, setAdding] = useState(false)
  const [openId, setOpenId] = useState<number | null>(null)

  const rows = useMemo(() => (data ?? []).filter((v) =>
    (status === "all" || v.status === status) &&
    (!q || `${v.name} ${v.email} ${v.skills.join(" ")}`.toLowerCase().includes(q.toLowerCase()))
  ), [data, q, status])
  const statuses = useMemo(() => Array.from(new Set((data ?? []).map((v) => v.status))), [data])

  const all = data ?? []
  const total = all.reduce((s, v) => s + hours(v.totalHours), 0)
  const active = all.filter((v) => v.status === "active").length
  const showContact = all.some((v) => v.email)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl tracking-tight md:text-4xl">Volunteers</h1>
          <p className="mt-2 text-muted-foreground">The people who show up, and the hours they give.</p>
        </div>
        {canManage && <Button onClick={() => setAdding(true)}><Plus /> Add volunteer</Button>}
      </div>

      <StatStrip
        loading={isLoading}
        stats={[
          { label: "Volunteers", value: fmt(all.length) },
          { label: "Active", value: fmt(active) },
          { label: "Hours given", value: fmt(total) },
          { label: "Average per volunteer", value: all.length ? (total / all.length).toFixed(1) : "0" },
        ]}
      />

      <Panel>
        <Toolbar count={rows.length}>
          <label htmlFor="volunteer-search" className="sr-only">Search volunteers</label>
          <Input id="volunteer-search" placeholder="Search name, email or skill" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
          <label htmlFor="volunteer-status" className="sr-only">Filter by status</label>
          <select id="volunteer-status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </Toolbar>

        {error ? <ErrorText>{error.message}</ErrorText>
          : isLoading ? <Skeleton />
          : !rows.length ? <Empty>{all.length ? "No volunteers match your filters." : "No volunteers yet. People who sign up on the website appear in the Inbox first."}</Empty>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-5 py-2.5 font-normal">Volunteer</th>
                    {showContact && <th className="px-5 py-2.5 font-normal">Contact</th>}
                    <th className="px-5 py-2.5 font-normal">Skills</th>
                    <th className="px-5 py-2.5 font-normal">Status</th>
                    <th className="px-5 py-2.5 text-right font-normal">Hours</th>
                    <th className="px-5 py-2.5 text-right font-normal">Activities</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((v) => (
                    <tr key={v.id} className="cursor-pointer hover:bg-accent/40" onClick={() => setOpenId(v.id)}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={v.name} src={v.profileImage} />
                          <button className="text-left hover:underline" onClick={(e) => { e.stopPropagation(); setOpenId(v.id) }}>{v.name}</button>
                        </div>
                      </td>
                      {showContact && (
                        <td className="px-5 py-3">
                          <p className="max-w-[14rem] truncate">{v.email}</p>
                          {v.phone && <p className="text-xs text-muted-foreground">{v.phone}</p>}
                        </td>
                      )}
                      <td className="max-w-[14rem] truncate px-5 py-3 text-muted-foreground">{v.skills.length ? v.skills.join(", ") : "None listed"}</td>
                      <td className="px-5 py-3"><Status value={v.status} /></td>
                      <td className="px-5 py-3 text-right tabular-nums">{hours(v.totalHours).toFixed(1)}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{v.activitiesCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </Panel>

      <AddVolunteer open={adding} onClose={() => setAdding(false)} />
      <VolunteerDetail id={openId} onClose={() => setOpenId(null)} canManage={canManage} />
    </div>
  )
}

const blank = { firstName: "", lastName: "", email: "", phone: "", availability: "", emergencyContactName: "", emergencyContactPhone: "", emergencyContactRelationship: "" }

function AddVolunteer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const utils = trpc.useUtils()
  const [form, setForm] = useState(blank)
  const [err, setErr] = useState<string | null>(null)
  const create = trpc.volunteers.createWithUser.useMutation({
    onSuccess: () => { utils.volunteers.getAll.invalidate(); setForm(blank); onClose() },
    onError: (e) => setErr(e.message),
  })
  const set = (k: keyof typeof blank) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))
  const opt = (s: string) => s.trim() || undefined

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    create.mutate({
      firstName: form.firstName.trim(), lastName: form.lastName.trim(), email: form.email.trim(),
      phone: opt(form.phone), availability: opt(form.availability),
      emergencyContactName: opt(form.emergencyContactName), emergencyContactPhone: opt(form.emergencyContactPhone),
      emergencyContactRelationship: opt(form.emergencyContactRelationship),
    })
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Add volunteer"
      description="Creates their account. They can sign in with this email."
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button type="submit" form="volunteer-form" disabled={create.isPending}>{create.isPending ? "Saving…" : "Add volunteer"}</Button></>}
    >
      <form id="volunteer-form" onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" name="firstName" required autoComplete="off" value={form.firstName} onChange={set("firstName")} />
        <Field label="Last name" name="lastName" required autoComplete="off" value={form.lastName} onChange={set("lastName")} />
        <Field label="Email" name="email" type="email" required autoComplete="off" value={form.email} onChange={set("email")} />
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+254 7…" />
        <TextArea className="sm:col-span-2" label="Availability" name="availability" rows={2} value={form.availability} onChange={set("availability")} placeholder="Weekends, school holidays" />
        <p className="pt-2 text-sm font-medium sm:col-span-2">Emergency contact</p>
        <Field label="Name" name="emergencyContactName" value={form.emergencyContactName} onChange={set("emergencyContactName")} />
        <Field label="Phone" name="emergencyContactPhone" type="tel" value={form.emergencyContactPhone} onChange={set("emergencyContactPhone")} />
        <Field label="Relationship" name="emergencyContactRelationship" value={form.emergencyContactRelationship} onChange={set("emergencyContactRelationship")} placeholder="Parent, spouse…" />
        {err && <p role="alert" className="text-sm text-destructive sm:col-span-2">{err}</p>}
      </form>
    </Sheet>
  )
}

function VolunteerDetail({ id, onClose, canManage }: { id: number | null; onClose: () => void; canManage: boolean }) {
  const utils = trpc.useUtils()
  const { data: v, isLoading, error } = trpc.volunteers.getById.useQuery({ id: id ?? 0 }, { enabled: id !== null })
  const { data: statuses = [] } = trpc.volunteers.getStatuses.useQuery(undefined, { enabled: id !== null && canManage })
  const [editing, setEditing] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const done = () => { utils.volunteers.getAll.invalidate(); utils.volunteers.getById.invalidate(); setEditing(false); setErr(null) }
  const update = trpc.volunteers.update.useMutation({ onSuccess: done, onError: (e) => setErr(e.message) })
  const remove = trpc.volunteers.delete.useMutation({ onSuccess: () => { done(); close() }, onError: (e) => setErr(e.message) })
  const close = () => { setEditing(false); setConfirmDelete(false); setErr(null); onClose() }

  const save = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const statusId = Number(f.get("statusId"))
    update.mutate({ id: id!, availability: String(f.get("availability") ?? ""), statusId: statusId || undefined })
  }

  const st = v?.statistics as { total_hours?: unknown; activities_count?: number; events_count?: number; projects_count?: number } | null | undefined

  return (
    <Sheet
      open={id !== null}
      onClose={close}
      title={v?.name ?? "Volunteer"}
      description={v ? `Joined ${format(new Date(v.joinedAt), "MMMM yyyy")}` : undefined}
      footer={canManage && v ? (
        editing ? (
          <><Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button><Button type="submit" form="volunteer-edit" disabled={update.isPending}>{update.isPending ? "Saving…" : "Save"}</Button></>
        ) : confirmDelete ? (
          <>
            <p className="mr-auto self-center text-sm text-muted-foreground">Remove {v.name}? Their logged hours go too.</p>
            <Button variant="ghost" onClick={() => setConfirmDelete(false)}>Keep</Button>
            <Button variant="destructive" onClick={() => remove.mutate({ id: v.id })} disabled={remove.isPending}>{remove.isPending ? "Removing…" : "Remove"}</Button>
          </>
        ) : (
          <><Button variant="ghost" className="mr-auto text-destructive hover:text-destructive" onClick={() => setConfirmDelete(true)}>Remove</Button><Button variant="outline" onClick={() => setEditing(true)}>Edit</Button></>
        )
      ) : undefined}
    >
      {error ? <p className="text-sm text-destructive">{error.message}</p>
        : isLoading || !v ? <Skeleton rows={6} />
        : editing ? (
          <form id="volunteer-edit" onSubmit={save} className="grid gap-5">
            <Select label="Status" name="statusId" required defaultValue={String(statuses.find((s) => s.name === v.status)?.id ?? "")} options={statuses.map((s) => ({ value: String(s.id), label: s.name }))} />
            <TextArea label="Availability" name="availability" rows={3} defaultValue={v.availability ?? ""} />
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          </form>
        ) : (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <Avatar name={v.name} src={v.profileImage} />
              <div className="min-w-0">
                {v.email && <a href={`mailto:${v.email}`} className="block truncate text-sm hover:underline">{v.email}</a>}
                {v.phone && <a href={`tel:${v.phone}`} className="block text-sm text-muted-foreground hover:text-foreground">{v.phone}</a>}
              </div>
              <div className="ml-auto"><Status value={v.status} /></div>
            </div>

            <StatStrip stats={[
              { label: "Hours", value: hours(st?.total_hours).toFixed(1) },
              { label: "Activities", value: fmt(st?.activities_count ?? 0) },
              { label: "Events", value: fmt(st?.events_count ?? 0) },
            ]} />

            <Facts items={[
              { label: "Availability", value: v.availability || "Not given" },
              { label: "Skills", value: v.skills.length ? v.skills.join(", ") : "None listed" },
              ...(v.emergencyContact ? [{ label: "Emergency contact", value: <>{v.emergencyContact.name} <span className="text-muted-foreground">({v.emergencyContact.relationship})</span><br />{v.emergencyContact.phone}</> }] : []),
            ]} />

            <div>
              <h3 className="font-sans text-sm font-medium">Recent activity</h3>
              {v.recentActivities.length ? (
                <ul className="mt-3 divide-y rounded-lg border">
                  {v.recentActivities.slice(0, 6).map((a) => (
                    <li key={a.id} className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm">
                      <div className="min-w-0">
                        <p className="truncate">{a.description}</p>
                        <p className="text-xs text-muted-foreground">{a.eventTitle || a.projectTitle || a.activityType} · {format(new Date(a.activityDate), "d MMM yyyy")}</p>
                      </div>
                      <span className="whitespace-nowrap tabular-nums">{a.hoursLogged} h</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-2 text-sm text-muted-foreground">Nothing logged yet.</p>}
            </div>
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
          </div>
        )}
    </Sheet>
  )
}
