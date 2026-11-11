"use client"

import { useMemo, useState, type FormEvent } from "react"
import { format } from "date-fns"
import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, Select, TextArea } from "@/components/forms/fields"
import { CategoryField } from "@/components/dashboard/category-field"
import { trpc } from "@/app/_trpc/client"
import { useAuth } from "@/contexts/AuthContext"
import { Empty, ErrorText, Facts, Panel, Sheet as SheetShell, Skeleton, Status, Toolbar } from "@/components/dashboard/ui"

/** Teams: who leads what, and who is in each team. */
export function TeamsView() {
  const { has, user } = useAuth()
  const canCreate = has("teams:manage")
  const { data, isLoading, error } = trpc.teams.getAll.useQuery()
  const [q, setQ] = useState("")
  const [openId, setOpenId] = useState<number | null>(null)
  const [editing, setEditing] = useState<number | "new" | null>(null)

  const all = useMemo(() => data ?? [], [data])
  const rows = all.filter((t) => !q || `${t.name} ${t.category} ${t.leader?.name ?? ""}`.toLowerCase().includes(q.toLowerCase()))
  const canEdit = (leaderId?: number | null) => has("teams:manage") || (has("teams:manage_own") && !!user && leaderId === user.id)

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl tracking-tight md:text-4xl">Teams</h1>
          <p className="mt-2 text-muted-foreground">Who leads each team, and who is in it.</p>
        </div>
        {canCreate && <Button onClick={() => setEditing("new")}><Plus /> New team</Button>}
      </div>

      <Panel>
        <Toolbar count={rows.length}>
          <label htmlFor="team-search" className="sr-only">Search teams</label>
          <Input id="team-search" placeholder="Search team, category or leader" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
        </Toolbar>
        {error ? <ErrorText>{error.message}</ErrorText>
          : isLoading ? <Skeleton />
          : !rows.length ? <Empty>{all.length ? "No teams match your search." : canCreate ? "No teams yet. Create the first one, then add its members." : "No teams yet."}</Empty>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-5 py-2.5 font-normal">Team</th>
                    <th className="px-5 py-2.5 font-normal">Leader</th>
                    <th className="px-5 py-2.5 text-right font-normal">Members</th>
                    <th className="px-5 py-2.5 text-right font-normal">Projects</th>
                    <th className="px-5 py-2.5 font-normal">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((t) => (
                    <tr key={t.id} className="cursor-pointer hover:bg-accent/40" onClick={() => setOpenId(t.id)}>
                      <td className="max-w-[18rem] px-5 py-3">
                        <button className="block max-w-full truncate text-left hover:underline" onClick={(e) => { e.stopPropagation(); setOpenId(t.id) }}>{t.name}</button>
                        <p className="truncate text-xs text-muted-foreground">{t.category}</p>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground">{t.leader?.name || "No leader yet"}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{t.membersCount}{t.maxMembers ? <span className="text-muted-foreground"> / {t.maxMembers}</span> : null}</td>
                      <td className="px-5 py-3 text-right tabular-nums">{t.projectsCount}</td>
                      <td className="px-5 py-3"><Status value={t.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </Panel>

      <TeamDetail id={openId} onClose={() => setOpenId(null)} canEdit={canEdit} onEdit={(id) => { setOpenId(null); setEditing(id) }} />
      <TeamForm target={editing} onClose={() => setEditing(null)} />
    </div>
  )
}

function TeamDetail({ id, onClose, canEdit, onEdit }: {
  id: number | null; onClose: () => void; canEdit: (leaderId?: number | null) => boolean; onEdit: (id: number) => void
}) {
  const utils = trpc.useUtils()
  const { data: team, isLoading, error } = trpc.teams.getById.useQuery({ id: id ?? 0 }, { enabled: id !== null })
  const editable = !!team && canEdit(team.leader?.id)
  const { data: people = [] } = trpc.teams.people.useQuery(undefined, { enabled: editable })
  const [userId, setUserId] = useState("")
  const [role, setRole] = useState("")
  const [err, setErr] = useState<string | null>(null)
  const refresh = () => { utils.teams.getById.invalidate(); utils.teams.getAll.invalidate() }
  const add = trpc.teams.addMember.useMutation({ onSuccess: () => { setUserId(""); setRole(""); refresh() }, onError: (e) => setErr(e.message) })
  const remove = trpc.teams.removeMember.useMutation({ onSuccess: refresh, onError: (e) => setErr(e.message) })

  const memberIds = new Set(team?.members.map((m) => m.userId))
  const choices = people.filter((p) => !memberIds.has(p.id))
  const full = !!team?.maxMembers && team.members.length >= team.maxMembers

  return (
    <SheetShell open={id !== null} onClose={() => { setErr(null); onClose() }} title={team?.name ?? "Team"} description={team?.category}
      footer={editable && team ? <Button variant="outline" onClick={() => onEdit(team.id)}>Edit team</Button> : undefined}>
      {error ? <ErrorText>{error.message}</ErrorText> : isLoading || !team ? <Skeleton /> : (
        <div className="space-y-8">
          <Status value={team.status} />
          {team.description && <p className="whitespace-pre-line leading-relaxed text-muted-foreground">{team.description}</p>}
          <Facts items={[
            { label: "Leader", value: team.leader?.name || "No leader yet" },
            { label: "Members", value: <span className="tabular-nums">{team.members.length}{team.maxMembers ? ` of ${team.maxMembers}` : ""}</span> },
            { label: "Started", value: format(new Date(team.createdAt), "d MMM yyyy") },
            { label: "Projects", value: <span className="tabular-nums">{team.projects.length}</span> },
          ]} />

          <section>
            <h3 className="font-display text-lg">Members</h3>
            {!team.members.length ? <p className="mt-2 text-sm text-muted-foreground">No members yet.</p> : (
              <ul className="mt-3 divide-y rounded-md border">
                {team.members.map((m) => (
                  <li key={m.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                    <div className="min-w-0">
                      <p className="truncate">{m.name || m.email}{m.userId === team.leader?.id && <span className="ml-2 text-xs text-muted-foreground">Leader</span>}</p>
                      <p className="truncate text-xs text-muted-foreground">{[m.role, m.email].filter(Boolean).join(" · ")}</p>
                    </div>
                    {editable && m.userId !== team.leader?.id && (
                      <button aria-label={`Remove ${m.name || m.email}`} disabled={remove.isPending}
                        onClick={() => { if (window.confirm(`Remove ${m.name || m.email} from ${team.name}?`)) remove.mutate({ teamId: team.id, userId: m.userId }) }}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}

            {editable && (
              full ? <p className="mt-3 text-sm text-muted-foreground">This team is full. Raise the member limit under Edit team to add more people.</p> : (
                <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_10rem_auto] sm:items-end"
                  onSubmit={(e) => { e.preventDefault(); setErr(null); if (userId) add.mutate({ teamId: team.id, userId: Number(userId), role: role.trim() || undefined }) }}>
                  <Select label="Add a member" name="member" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder={choices.length ? "Choose a person" : "Nobody left to add"}
                    options={choices.map((p) => ({ value: String(p.id), label: `${p.name} · ${p.email}` }))} />
                  <Field label="Role (optional)" name="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="e.g. Driver" />
                  <Button type="submit" variant="outline" disabled={!userId || add.isPending}>{add.isPending ? "Adding…" : "Add"}</Button>
                </form>
              )
            )}
            {err && <p role="alert" className="mt-2 text-sm text-destructive">{err}</p>}
          </section>

          {!!team.projects.length && (
            <section>
              <h3 className="font-display text-lg">Projects</h3>
              <ul className="mt-3 divide-y rounded-md border">
                {team.projects.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                    <span className="truncate">{p.title}</span><Status value={p.status} />
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </SheetShell>
  )
}

type Form = { name: string; description: string; categoryId: string; leaderId: string; maxMembers: string; status: string }
const blank: Form = { name: "", description: "", categoryId: "", leaderId: "", maxMembers: "", status: "active" }

function TeamForm({ target, onClose }: { target: number | "new" | null; onClose: () => void }) {
  const { has } = useAuth()
  const manager = has("teams:manage")
  const utils = trpc.useUtils()
  const open = target !== null
  const isNew = target === "new"
  const { data: existing } = trpc.teams.getById.useQuery({ id: typeof target === "number" ? target : 0 }, { enabled: typeof target === "number" })
  const { data: categories = [] } = trpc.teams.getCategories.useQuery(undefined, { enabled: open })
  const { data: people = [] } = trpc.teams.people.useQuery(undefined, { enabled: open && manager })
  const [form, setForm] = useState<Form>(blank)
  const [loadedFor, setLoadedFor] = useState<string | null>(null)
  const [err, setErr] = useState<string | null>(null)

  const key = isNew ? "new" : existing ? `${existing.id}:${existing.updatedAt}` : null
  if (open && key && loadedFor !== key) {
    setForm(isNew || !existing ? blank : {
      name: existing.name, description: existing.description ?? "", categoryId: String(existing.categoryId),
      leaderId: existing.leader ? String(existing.leader.id) : "", maxMembers: existing.maxMembers ? String(existing.maxMembers) : "", status: existing.status,
    })
    setLoadedFor(key)
    setErr(null)
  }

  const close = () => { setLoadedFor(null); onClose() }
  const done = () => { utils.teams.getAll.invalidate(); utils.teams.getById.invalidate(); close() }
  const create = trpc.teams.create.useMutation({ onSuccess: done, onError: (e) => setErr(e.message) })
  const update = trpc.teams.update.useMutation({ onSuccess: done, onError: (e) => setErr(e.message) })
  const addCategory = trpc.teams.addCategory.useMutation({ onSuccess: () => utils.teams.getCategories.invalidate() })
  const pending = create.isPending || update.isPending
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    const base = {
      name: form.name.trim(), description: form.description.trim() || undefined, categoryId: Number(form.categoryId),
      maxMembers: form.maxMembers ? Number(form.maxMembers) : undefined,
      ...(manager && form.leaderId ? { teamLeaderId: Number(form.leaderId) } : {}),
    }
    if (isNew) create.mutate(base)
    else if (typeof target === "number") update.mutate({ ...base, id: target, status: form.status as "active" | "inactive" })
  }

  return (
    <SheetShell open={open} onClose={close} title={isNew ? "New team" : "Edit team"}
      description={manager ? "After choosing a leader, give them the Team Leader role in Users & roles." : undefined}
      footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button type="submit" form="team-form" disabled={pending}>{pending ? "Saving…" : isNew ? "Create team" : "Save changes"}</Button></>}>
      <form id="team-form" onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <Field className="sm:col-span-2" label="Team name" name="name" required value={form.name} onChange={set("name")} placeholder="Kiambu outreach" />
        <TextArea className="sm:col-span-2" label="What the team does" name="description" rows={3} value={form.description} onChange={set("description")} />
        <div className="sm:col-span-2">
          <CategoryField value={form.categoryId} onChange={(id) => setForm((f) => ({ ...f, categoryId: id }))} options={categories}
            canAdd={manager} adding={addCategory.isPending} onAdd={(name) => addCategory.mutateAsync({ name })} />
        </div>
        {manager && (
          <Select label="Team leader" name="leaderId" value={form.leaderId} onChange={set("leaderId")} placeholder="Choose later"
            options={people.map((p) => ({ value: String(p.id), label: `${p.name} · ${p.email}` }))} />
        )}
        <Field label="Member limit (optional)" name="maxMembers" type="number" min={1} value={form.maxMembers} onChange={set("maxMembers")} />
        {!isNew && (
          <Select label="Status" name="status" value={form.status} onChange={set("status")} options={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]} />
        )}
        {err && <p role="alert" className="text-sm text-destructive sm:col-span-2">{err}</p>}
      </form>
    </SheetShell>
  )
}

