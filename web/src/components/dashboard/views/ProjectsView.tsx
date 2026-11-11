"use client"

import { useMemo, useState, type FormEvent } from "react"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, Select, TextArea } from "@/components/forms/fields"
import type { inferRouterOutputs } from "@trpc/server"
import { trpc } from "@/app/_trpc/client"
import type { AppRouter } from "@/trpc"
import { useAuth } from "@/contexts/AuthContext"
import {
  Empty, ErrorText, Facts, Panel, Progress, Sheet, Skeleton, StatStrip, Status, Toolbar, fmt, selectClass,
} from "@/components/dashboard/ui"

type Form = {
  title: string; description: string; statusId: string; startDate: string; endDate: string
  teamId: string; campaignId: string; budget: string; currencyId: string; progress: string
}
const ymd = (d: Date | string) => format(new Date(d), "yyyy-MM-dd")
const blank = (): Form => ({
  title: "", description: "", statusId: "", startDate: ymd(new Date()), endDate: "",
  teamId: "", campaignId: "", budget: "", currencyId: "", progress: "0",
})
const num = (s: string) => (s === "" ? null : Number(s))

/** The foundation's ongoing work, from the database. */
export function ProjectsView() {
  const { hasAny } = useAuth()
  const canManage = hasAny(["teams:manage", "teams:manage_own"])
  const { data, isLoading, error } = trpc.projects.list.useQuery()
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")
  const [editing, setEditing] = useState<number | "new" | null>(null)
  const [openId, setOpenId] = useState<number | null>(null)

  const all = useMemo(() => data ?? [], [data])
  const rows = useMemo(() => all.filter((p) =>
    (status === "all" || p.status === status) &&
    (!q || `${p.title} ${p.team ?? ""} ${p.campaign ?? ""}`.toLowerCase().includes(q.toLowerCase()))
  ), [all, q, status])
  const statuses = useMemo(() => Array.from(new Set(all.map((p) => p.status))), [all])
  const active = all.filter((p) => p.status === "in_progress")
  const open = all.find((p) => p.id === openId) ?? null

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl tracking-tight md:text-4xl">Projects</h1>
          <p className="mt-2 text-muted-foreground">The work in progress, and how far along it is.</p>
        </div>
        {canManage && <Button onClick={() => setEditing("new")}><Plus /> New project</Button>}
      </div>

      <StatStrip
        loading={isLoading}
        stats={[
          { label: "In progress", value: fmt(active.length) },
          { label: "Average progress", value: active.length ? `${Math.round(active.reduce((s, p) => s + p.progress, 0) / active.length)}%` : "–" },
          { label: "Volunteer hours", value: fmt(all.reduce((s, p) => s + p.hoursLogged, 0)) },
        ]}
      />

      <Panel>
        <Toolbar count={rows.length}>
          <label htmlFor="project-search" className="sr-only">Search projects</label>
          <Input id="project-search" placeholder="Search title, team or campaign" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
          <label htmlFor="project-status" className="sr-only">Filter by status</label>
          <select id="project-status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
        </Toolbar>

        {error ? <ErrorText>{error.message}</ErrorText>
          : isLoading ? <Skeleton />
          : !rows.length ? <Empty>{all.length ? "No projects match your filters." : canManage ? "No projects yet. Add the first one to start tracking it." : "No projects yet."}</Empty>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-5 py-2.5 font-normal">Project</th>
                    <th className="px-5 py-2.5 font-normal">Status</th>
                    <th className="w-48 px-5 py-2.5 font-normal">Progress</th>
                    <th className="px-5 py-2.5 font-normal">Team</th>
                    <th className="px-5 py-2.5 font-normal">Dates</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((p) => (
                    <tr key={p.id} className="cursor-pointer hover:bg-accent/40" onClick={() => setOpenId(p.id)}>
                      <td className="max-w-[18rem] px-5 py-3">
                        <button className="block max-w-full truncate text-left hover:underline" onClick={(e) => { e.stopPropagation(); setOpenId(p.id) }}>{p.title}</button>
                        {p.campaign && <p className="truncate text-xs text-muted-foreground">{p.campaign}</p>}
                      </td>
                      <td className="px-5 py-3"><Status value={p.status} /></td>
                      <td className="px-5 py-3">
                        <Progress value={p.progress} label={`${p.title}: ${p.progress}% done`} />
                        <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">{p.progress}%</p>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{p.team ?? "No team"}</td>
                      <td className="whitespace-nowrap px-5 py-3 tabular-nums text-muted-foreground">
                        {format(new Date(p.startDate), "d MMM yyyy")}{p.endDate ? ` – ${format(new Date(p.endDate), "d MMM yyyy")}` : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </Panel>

      <ProjectForm target={editing} onClose={() => setEditing(null)} existing={typeof editing === "number" ? all.find((p) => p.id === editing) ?? null : null} />

      <Sheet
        open={!!open}
        onClose={() => setOpenId(null)}
        title={open?.title ?? "Project"}
        description={open ? [open.team, open.campaign].filter(Boolean).join(" · ") || undefined : undefined}
        footer={canManage && open ? <Button variant="outline" onClick={() => { setOpenId(null); setEditing(open.id) }}>Edit project</Button> : undefined}
      >
        {open && (
          <div className="space-y-8">
            <Status value={open.status} />
            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{open.description}</p>
            <div>
              <div className="flex items-end justify-between">
                <p className="font-display text-3xl tabular-nums">{open.progress}%</p>
                <p className="text-sm text-muted-foreground">done</p>
              </div>
              <div className="mt-3"><Progress value={open.progress} label={`${open.progress}% done`} /></div>
            </div>
            <Facts items={[
              { label: "Starts", value: format(new Date(open.startDate), "d MMM yyyy") },
              { label: "Ends", value: open.endDate ? format(new Date(open.endDate), "d MMM yyyy") : "Ongoing" },
              { label: "Team", value: open.team ?? "No team" },
              { label: "Campaign", value: open.campaign ?? "None" },
              { label: "Volunteers", value: <span className="tabular-nums">{open.volunteersCount}</span> },
              { label: "Hours logged", value: <span className="tabular-nums">{fmt(open.hoursLogged)}</span> },
              ...(open.budget != null ? [{ label: "Budget", value: <span className="tabular-nums">{open.currency ?? ""} {fmt(open.budget)}</span> }] : []),
            ]} />
          </div>
        )}
      </Sheet>
    </div>
  )
}

type Project = inferRouterOutputs<AppRouter>["projects"]["list"][number]

function ProjectForm({ target, onClose, existing }: { target: number | "new" | null; onClose: () => void; existing: Project | null }) {
  const { has, hasAny } = useAuth()
  const utils = trpc.useUtils()
  const open = target !== null
  const isNew = target === "new"
  const seesBudget = hasAny(["teams:manage", "reports:view_financial"])
  const { data: statuses = [] } = trpc.projects.getStatuses.useQuery(undefined, { enabled: open })
  const { data: teams = [] } = trpc.projects.assignableTeams.useQuery(undefined, { enabled: open })
  const { data: campaigns = [] } = trpc.campaigns.getAll.useQuery(undefined, { enabled: open })
  const { data: currencies = [] } = trpc.donations.getCurrencies.useQuery(undefined, { enabled: open && seesBudget })
  const [form, setForm] = useState<Form>(blank)
  const [loadedFor, setLoadedFor] = useState<number | "new" | null>(null)
  const [err, setErr] = useState<string | null>(null)

  if (open && loadedFor !== target) {
    setForm(isNew || !existing ? blank() : {
      title: existing.title, description: existing.description, statusId: String(existing.statusId),
      startDate: ymd(existing.startDate), endDate: existing.endDate ? ymd(existing.endDate) : "",
      teamId: existing.teamId ? String(existing.teamId) : "", campaignId: existing.campaignId ? String(existing.campaignId) : "",
      budget: existing.budget != null ? String(existing.budget) : "", currencyId: existing.currencyId ? String(existing.currencyId) : "",
      progress: String(existing.progress),
    })
    setLoadedFor(target)
    setErr(null)
  }

  const close = () => { setLoadedFor(null); onClose() }
  const done = () => { utils.projects.list.invalidate(); close() }
  const create = trpc.projects.create.useMutation({ onSuccess: done, onError: (e) => setErr(e.message) })
  const update = trpc.projects.update.useMutation({ onSuccess: done, onError: (e) => setErr(e.message) })
  const pending = create.isPending || update.isPending
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    const body = {
      title: form.title, description: form.description, statusId: Number(form.statusId),
      startDate: new Date(form.startDate), endDate: form.endDate ? new Date(form.endDate) : null,
      teamId: num(form.teamId), campaignId: num(form.campaignId), progress: Number(form.progress) || 0,
      ...(seesBudget && { budget: num(form.budget), currencyId: num(form.currencyId) }),
    }
    if (isNew) create.mutate(body)
    else if (typeof target === "number") update.mutate({ ...body, id: target })
  }

  const leaderOnly = !has("teams:manage")
  return (
    <Sheet
      open={open}
      onClose={close}
      title={isNew ? "New project" : "Edit project"}
      description={leaderOnly ? "Projects belong to one of the teams you lead." : undefined}
      footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button type="submit" form="project-form" disabled={pending}>{pending ? "Saving…" : isNew ? "Create project" : "Save changes"}</Button></>}
    >
      <form id="project-form" onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <Field className="sm:col-span-2" label="Title" name="title" required value={form.title} onChange={set("title")} placeholder="Water tank for Kabete home" />
        <TextArea className="sm:col-span-2" label="Description" name="description" required value={form.description} onChange={set("description")} />
        <Select label="Status" name="statusId" required value={form.statusId} onChange={set("statusId")} options={statuses.map((s) => ({ value: String(s.id), label: s.name.replace(/_/g, " ") }))} />
        <Field label="Progress (%)" name="progress" type="number" min={0} max={100} required value={form.progress} onChange={set("progress")} />
        <Field label="Starts" name="startDate" type="date" required value={form.startDate} onChange={set("startDate")} />
        <Field label="Ends" name="endDate" type="date" min={form.startDate} value={form.endDate} onChange={set("endDate")} />
        <Select label="Team" name="teamId" required={leaderOnly} value={form.teamId} onChange={set("teamId")} placeholder={leaderOnly ? "Choose a team" : "No team"} options={teams.map((t) => ({ value: String(t.id), label: t.name }))} />
        <Select label="Campaign" name="campaignId" value={form.campaignId} onChange={set("campaignId")} placeholder="None" options={campaigns.map((c) => ({ value: String(c.id), label: c.title }))} />
        {seesBudget && (
          <>
            <Field label="Budget" name="budget" type="number" min={0} value={form.budget} onChange={set("budget")} />
            <Select label="Currency" name="currencyId" value={form.currencyId} onChange={set("currencyId")} placeholder="Choose one" options={currencies.map((c) => ({ value: String(c.id), label: `${c.code} · ${c.name}` }))} />
          </>
        )}
        {err && <p role="alert" className="text-sm text-destructive sm:col-span-2">{err}</p>}
      </form>
    </Sheet>
  )
}
