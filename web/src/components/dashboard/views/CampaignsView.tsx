"use client"

import { useMemo, useState, type FormEvent } from "react"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, Select, TextArea } from "@/components/forms/fields"
import { trpc } from "@/app/_trpc/client"
import { useAuth } from "@/contexts/AuthContext"
import {
  Empty, ErrorText, Facts, Panel, Progress, Sheet, Skeleton, StatStrip, Status, Toolbar, fmt, selectClass,
} from "@/components/dashboard/ui"

type FormState = {
  title: string; description: string; goalAmount: string; categoryId: string; urgencyLevelId: string
  currencyId: string; startDate: string; endDate: string; imageUrl: string; targetBeneficiaries: string
}
const today = () => new Date().toISOString().split("T")[0]
const empty = (): FormState => ({
  title: "", description: "", goalAmount: "", categoryId: "", urgencyLevelId: "", currencyId: "",
  startDate: today(), endDate: "", imageUrl: "", targetBeneficiaries: "",
})

/**
 * Campaign management. Staff see drafts and campaigns awaiting review (the server
 * filters by role); creating a campaign without publish rights sends it to review.
 */
export function CampaignsView() {
  const { has } = useAuth()
  const utils = trpc.useUtils()
  const { data, isLoading, error } = trpc.campaigns.getAll.useQuery()
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")
  const [creating, setCreating] = useState(false)
  const [openId, setOpenId] = useState<number | null>(null)

  const rows = useMemo(() => (data ?? []).filter((c) =>
    (status === "all" || c.status === status) &&
    (!q || `${c.title} ${c.category}`.toLowerCase().includes(q.toLowerCase()))
  ), [data, q, status])
  const statuses = useMemo(() => Array.from(new Set((data ?? []).map((c) => c.status))), [data])

  const active = (data ?? []).filter((c) => c.status === "active")
  const raised = active.reduce((s, c) => s + c.currentAmount, 0)
  const goal = active.reduce((s, c) => s + c.goalAmount, 0)
  const waiting = (data ?? []).filter((c) => c.status === "pending_review" || c.status === "draft").length

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-display text-3xl tracking-tight md:text-4xl">Campaigns</h1>
          <p className="mt-2 text-muted-foreground">What we&apos;re raising for, and how close we are.</p>
        </div>
        {has("campaigns:create") && (
          <Button onClick={() => setCreating(true)}><Plus /> New campaign</Button>
        )}
      </div>

      <StatStrip
        loading={isLoading}
        stats={[
          { label: "Active campaigns", value: fmt(active.length) },
          { label: "Raised across active", value: fmt(raised), hint: goal ? `${Math.round((raised / goal) * 100)}% of ${fmt(goal)}` : undefined },
          { label: "Drafts and in review", value: fmt(waiting) },
        ]}
      />

      <Panel>
        <Toolbar count={rows.length}>
          <label htmlFor="campaign-search" className="sr-only">Search campaigns</label>
          <Input id="campaign-search" placeholder="Search title or category" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
          <label htmlFor="campaign-status" className="sr-only">Filter by status</label>
          <select id="campaign-status" value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
          </select>
        </Toolbar>

        {error ? <ErrorText>{error.message}</ErrorText>
          : isLoading ? <Skeleton />
          : !rows.length ? <Empty>{data?.length ? "No campaigns match your filters." : "No campaigns yet."}</Empty>
          : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-muted-foreground">
                  <tr className="border-b">
                    <th className="px-5 py-2.5 font-normal">Campaign</th>
                    <th className="px-5 py-2.5 font-normal">Status</th>
                    <th className="w-56 px-5 py-2.5 font-normal">Progress</th>
                    <th className="px-5 py-2.5 text-right font-normal">Gifts</th>
                    <th className="px-5 py-2.5 font-normal">Ends</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((c) => (
                    <tr key={c.id} className="cursor-pointer hover:bg-accent/40" onClick={() => setOpenId(c.id)}>
                      <td className="max-w-[18rem] px-5 py-3">
                        <button className="block max-w-full truncate text-left hover:underline" onClick={(e) => { e.stopPropagation(); setOpenId(c.id) }}>
                          {c.title}
                        </button>
                        <p className="text-xs text-muted-foreground">{c.category}</p>
                      </td>
                      <td className="px-5 py-3"><Status value={c.status} /></td>
                      <td className="px-5 py-3">
                        <Progress value={c.progressPercentage} label={`${c.title}: ${Math.round(c.progressPercentage)}% funded`} />
                        <p className="mt-1.5 text-xs tabular-nums text-muted-foreground">{fmt(c.currentAmount)} of {fmt(c.goalAmount)}</p>
                      </td>
                      <td className="px-5 py-3 text-right tabular-nums">{c.donationsCount}</td>
                      <td className="whitespace-nowrap px-5 py-3 tabular-nums text-muted-foreground">{c.endDate ? format(new Date(c.endDate), "d MMM yyyy") : "No end date"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </Panel>

      <CreateCampaign
        open={creating}
        onClose={() => setCreating(false)}
        onCreated={() => { utils.campaigns.getAll.invalidate(); setCreating(false) }}
        canPublish={has("campaigns:publish")}
      />
      <CampaignDetail id={openId} onClose={() => setOpenId(null)} />
    </div>
  )
}

function CreateCampaign({ open, onClose, onCreated, canPublish }: { open: boolean; onClose: () => void; onCreated: () => void; canPublish: boolean }) {
  const [form, setForm] = useState<FormState>(empty)
  const [err, setErr] = useState<string | null>(null)
  const { data: categories = [] } = trpc.campaigns.getCategories.useQuery(undefined, { enabled: open })
  const { data: urgency = [] } = trpc.campaigns.getUrgencyLevels.useQuery(undefined, { enabled: open })
  const { data: currencies = [] } = trpc.donations.getCurrencies.useQuery(undefined, { enabled: open })
  const create = trpc.campaigns.create.useMutation({
    onSuccess: () => { setForm(empty()); setErr(null); onCreated() },
    onError: (e) => setErr(e.message),
  })
  const set = (k: keyof FormState) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const submit = (e: FormEvent) => {
    e.preventDefault()
    setErr(null)
    create.mutate({
      title: form.title.trim(),
      description: form.description.trim(),
      goalAmount: Number(form.goalAmount),
      categoryId: Number(form.categoryId),
      urgencyLevelId: Number(form.urgencyLevelId),
      currencyId: Number(form.currencyId),
      startDate: new Date(form.startDate),
      endDate: form.endDate ? new Date(form.endDate) : undefined,
      imageUrl: form.imageUrl || undefined,
      targetBeneficiaries: form.targetBeneficiaries ? Number(form.targetBeneficiaries) : undefined,
    })
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="New campaign"
      description={canPublish ? "It goes live as soon as you save it." : "An approver reviews it before it goes live."}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" form="campaign-form" disabled={create.isPending}>{create.isPending ? "Saving…" : canPublish ? "Publish campaign" : "Submit for review"}</Button>
        </>
      }
    >
      <form id="campaign-form" onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <Field className="sm:col-span-2" label="Title" name="title" required value={form.title} onChange={set("title")} placeholder="School fees for 20 children" />
        <TextArea className="sm:col-span-2" label="What it's for" name="description" required value={form.description} onChange={set("description")} hint="Shown to donors on the campaign page." />
        <Field label="Goal" name="goalAmount" type="number" min={1} inputMode="numeric" required value={form.goalAmount} onChange={set("goalAmount")} />
        <Select label="Currency" name="currencyId" required value={form.currencyId} onChange={set("currencyId")} options={currencies.map((c) => ({ value: String(c.id), label: `${c.code} · ${c.name}` }))} />
        <Select label="Category" name="categoryId" required value={form.categoryId} onChange={set("categoryId")} options={categories.map((c) => ({ value: String(c.id), label: c.name }))} />
        <Select label="Urgency" name="urgencyLevelId" required value={form.urgencyLevelId} onChange={set("urgencyLevelId")} options={urgency.map((u) => ({ value: String(u.id), label: u.name }))} />
        <Field label="Starts" name="startDate" type="date" required value={form.startDate} onChange={set("startDate")} />
        <Field label="Ends" name="endDate" type="date" min={form.startDate} value={form.endDate} onChange={set("endDate")} />
        <Field label="People it will help" name="targetBeneficiaries" type="number" min={1} value={form.targetBeneficiaries} onChange={set("targetBeneficiaries")} />
        <Field label="Image URL" name="imageUrl" type="url" value={form.imageUrl} onChange={set("imageUrl")} placeholder="https://…" />
        {err && <p role="alert" className="text-sm text-destructive sm:col-span-2">{err}</p>}
      </form>
    </Sheet>
  )
}

function CampaignDetail({ id, onClose }: { id: number | null; onClose: () => void }) {
  const { data: c, isLoading, error } = trpc.campaigns.getById.useQuery({ id: id ?? 0 }, { enabled: id !== null })
  return (
    <Sheet open={id !== null} onClose={onClose} title={c?.title ?? "Campaign"} description={c ? `${c.category} · ${c.urgencyLevel} urgency` : undefined}>
      {error ? <p className="text-sm text-destructive">{error.message}</p>
        : isLoading || !c ? <Skeleton rows={6} />
        : (
          <div className="space-y-8">
            <div className="flex items-center gap-3"><Status value={c.status} /></div>
            <p className="leading-relaxed text-muted-foreground">{c.description}</p>

            <div>
              <div className="flex items-end justify-between">
                <p className="font-display text-3xl tabular-nums">{c.currency} {fmt(c.currentAmount)}</p>
                <p className="text-sm tabular-nums text-muted-foreground">of {fmt(c.goalAmount)}</p>
              </div>
              <div className="mt-3"><Progress value={c.progressPercentage} label={`${Math.round(c.progressPercentage)}% funded`} /></div>
            </div>

            <Facts items={[
              { label: "Gifts", value: <span className="tabular-nums">{c.donationsCount}</span> },
              { label: "Donors", value: <span className="tabular-nums">{c.uniqueDonorsCount}</span> },
              { label: "Average gift", value: <span className="tabular-nums">{fmt(c.averageDonation)}</span> },
              { label: "People it will help", value: c.targetBeneficiaries ?? "Not set" },
              { label: "Starts", value: format(new Date(c.startDate), "d MMM yyyy") },
              { label: "Ends", value: c.endDate ? format(new Date(c.endDate), "d MMM yyyy") : "No end date" },
            ]} />

            <div>
              <h3 className="font-sans text-sm font-medium">Recent gifts</h3>
              {c.recentDonations.length ? (
                <ul className="mt-3 divide-y rounded-lg border">
                  {c.recentDonations.slice(0, 6).map((d) => (
                    <li key={d.id} className="flex items-center justify-between px-4 py-2.5 text-sm">
                      <div>
                        <p>{d.donorName}</p>
                        <p className="text-xs tabular-nums text-muted-foreground">{format(new Date(d.donationDate), "d MMM yyyy")}</p>
                      </div>
                      <span className="tabular-nums">{fmt(d.amount)}</span>
                    </li>
                  ))}
                </ul>
              ) : <p className="mt-2 text-sm text-muted-foreground">No gifts yet.</p>}
            </div>
          </div>
        )}
    </Sheet>
  )
}
