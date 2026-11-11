"use client"

import { useMemo, useState, type FormEvent } from "react"
import { format } from "date-fns"
import { Download, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, Select, TextArea } from "@/components/forms/fields"
import { Sheet } from "@/components/dashboard/ui"
import { trpc } from "@/app/_trpc/client"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"

const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })

/**
 * Donations, from the database. The server decides what each role sees:
 * finance sees everything, campaign managers see names without contact details,
 * everyone else sees only their own donations.
 */
export function DonationsView() {
  const { has, hasAny } = useAuth()
  const { data, isLoading, error } = trpc.donations.getAll.useQuery()
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("all")

  const rows = useMemo(() => {
    const list = data ?? []
    return list.filter((d) =>
      (status === "all" || d.status === status) &&
      (!q || `${d.donorName} ${d.campaignTitle}`.toLowerCase().includes(q.toLowerCase()))
    )
  }, [data, q, status])

  const statuses = useMemo(() => Array.from(new Set((data ?? []).map((d) => d.status))), [data])
  const completed = (data ?? []).filter((d) => d.status === "completed")
  const total = completed.reduce((s, d) => s + d.amount, 0)
  const donors = new Set(completed.map((d) => d.donorName)).size
  const own = !hasAny(["donations:view_all", "donations:view_aggregate"])
  const showEmail = has("donors:view_contact")

  const canRecord = has("donations:manage")
  const [recording, setRecording] = useState(false)

  function exportCsv() {
    const header = ["Date", ...(own ? [] : ["Donor"]), ...(showEmail ? ["Email"] : []), "Campaign", "Method", "Reference", "Status", "Currency", "Amount"]
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`
    const lines = rows.map((d) => [
      format(new Date(d.donationDate), "yyyy-MM-dd"),
      ...(own ? [] : [d.donorName]),
      ...(showEmail ? [d.donorEmail ?? ""] : []),
      d.campaignTitle, d.paymentMethod, d.paymentReference ?? "", d.status, d.currency, d.amount,
    ].map(esc).join(","))
    const blob = new Blob([[header.map(esc).join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `wamumbi-donations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2">
        <Button variant="outline" onClick={exportCsv} disabled={!rows.length}><Download /> Export CSV</Button>
        {canRecord && <Button onClick={() => setRecording(true)}><Plus /> Record donation</Button>}
      </div>
      <RecordDonation open={recording} onClose={() => setRecording(false)} />
      <dl className="grid overflow-hidden rounded-lg border bg-card sm:grid-cols-3">
        {[
          { label: own ? "You've given" : "Completed donations", value: fmt(total) },
          { label: own ? "Donations" : "Donors", value: fmt(own ? completed.length : donors) },
          { label: "Average gift", value: fmt(completed.length ? total / completed.length : 0) },
        ].map((s, i) => (
          <div key={s.label} className={cn("px-5 py-5", i > 0 && "border-t sm:border-l sm:border-t-0")}>
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="mt-2 font-display text-3xl tabular-nums tracking-tight">{isLoading ? "…" : s.value}</dd>
          </div>
        ))}
      </dl>

      <section className="rounded-lg border bg-card">
        <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center">
          <label htmlFor="donation-search" className="sr-only">Search donations</label>
          <Input id="donation-search" placeholder="Search donor or campaign" value={q} onChange={(e) => setQ(e.target.value)} className="sm:max-w-xs" />
          <label htmlFor="donation-status" className="sr-only">Filter by status</label>
          <select id="donation-status" value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md border bg-background px-2 text-sm">
            <option value="all">All statuses</option>
            {statuses.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
          <p className="text-sm text-muted-foreground sm:ml-auto">{rows.length} shown</p>
        </div>

        {error ? (
          <p className="px-5 py-10 text-center text-sm text-destructive">{error.message}</p>
        ) : isLoading ? (
          <div className="space-y-3 p-5" aria-hidden>{[0, 1, 2, 3].map((i) => <div key={i} className="h-4 animate-pulse rounded bg-muted" />)}</div>
        ) : !rows.length ? (
          <p className="px-5 py-12 text-center text-sm text-muted-foreground">{data?.length ? "No donations match your filters." : "No donations recorded yet."}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="px-5 py-2.5 font-normal">Date</th>
                  {!own && <th className="px-5 py-2.5 font-normal">Donor</th>}
                  <th className="px-5 py-2.5 font-normal">Campaign</th>
                  <th className="px-5 py-2.5 font-normal">Method</th>
                  <th className="px-5 py-2.5 font-normal">Status</th>
                  <th className="px-5 py-2.5 text-right font-normal">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {rows.map((d) => (
                  <tr key={d.id} className="hover:bg-accent/40">
                    <td className="whitespace-nowrap px-5 py-3 tabular-nums text-muted-foreground">{format(new Date(d.donationDate), "d MMM yyyy")}</td>
                    {!own && (
                      <td className="px-5 py-3">
                        <p>{d.donorName}</p>
                        {showEmail && d.donorEmail && <p className="text-xs text-muted-foreground">{d.donorEmail}</p>}
                      </td>
                    )}
                    <td className="max-w-[14rem] truncate px-5 py-3">{d.campaignTitle}</td>
                    <td className="px-5 py-3 text-muted-foreground">{d.paymentMethod}{d.isRecurring ? " · recurring" : ""}</td>
                    <td className="px-5 py-3">
                      <span className={cn("capitalize", d.status === "completed" ? "text-success" : d.status === "failed" ? "text-destructive" : "text-muted-foreground")}>{d.status}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right tabular-nums">{d.currency} {fmt(d.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  )
}

type RecordForm = { firstName: string; lastName: string; email: string; phone: string; anonymous: boolean; campaignId: string; amount: string; currencyId: string; paymentMethodId: string; reference: string; notes: string }
const blankRecord = (): RecordForm => ({ firstName: "", lastName: "", email: "", phone: "", anonymous: false, campaignId: "", amount: "", currencyId: "", paymentMethodId: "", reference: "", notes: "" })

/**
 * Finance records a gift that came in outside the website (usually the M-Pesa till).
 * Creates or reuses the donor by email, then records the donation against a campaign.
 */
function RecordDonation({ open, onClose }: { open: boolean; onClose: () => void }) {
  const utils = trpc.useUtils()
  const [form, setForm] = useState<RecordForm>(blankRecord)
  const [err, setErr] = useState<string | null>(null)
  const { data: campaigns = [] } = trpc.campaigns.getAll.useQuery(undefined, { enabled: open })
  const { data: currencies = [] } = trpc.donations.getCurrencies.useQuery(undefined, { enabled: open })
  const { data: methods = [] } = trpc.donations.getPaymentMethods.useQuery(undefined, { enabled: open })
  const createDonor = trpc.donations.createDonor.useMutation()
  const create = trpc.donations.create.useMutation()
  const busy = createDonor.isPending || create.isPending
  const set = (k: keyof RecordForm) => (e: { target: { value: string } }) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // Sensible defaults once the lists load: KES and M-Pesa.
  if (open && !form.currencyId && currencies.length) {
    const kes = currencies.find((c) => c.code === "KES") ?? currencies[0]
    setForm((f) => ({ ...f, currencyId: String(kes.id) }))
  }
  if (open && !form.paymentMethodId && methods.length) {
    const mpesa = methods.find((m) => /m-?pesa/i.test(m.name)) ?? methods[0]
    setForm((f) => ({ ...f, paymentMethodId: String(mpesa.id) }))
  }

  const close = () => { setForm(blankRecord()); setErr(null); onClose() }

  async function submit(e: FormEvent) {
    e.preventDefault()
    setErr(null)
    try {
      const donor = await createDonor.mutateAsync({
        firstName: form.firstName.trim() || undefined,
        lastName: form.lastName.trim() || undefined,
        email: form.email.trim() || undefined,
        phone: form.phone.trim() || undefined,
        isAnonymous: form.anonymous,
      })
      await create.mutateAsync({
        donorId: donor.id,
        campaignId: Number(form.campaignId),
        amount: Number(form.amount),
        currencyId: Number(form.currencyId),
        paymentMethodId: Number(form.paymentMethodId),
        paymentReference: form.reference.trim() || undefined,
        notes: form.notes.trim() || undefined,
        isAnonymous: form.anonymous,
        isRecurring: false,
      })
      await Promise.all([utils.donations.getAll.invalidate(), utils.campaigns.getAll.invalidate()])
      close()
    } catch (e) {
      setErr((e as Error).message)
    }
  }

  return (
    <Sheet
      open={open}
      onClose={close}
      title="Record a donation"
      description="For gifts received outside the website, like the M-Pesa till. It counts towards the campaign straight away."
      footer={<><Button variant="ghost" onClick={close}>Cancel</Button><Button type="submit" form="record-donation" disabled={busy}>{busy ? "Saving…" : "Record donation"}</Button></>}
    >
      <form id="record-donation" onSubmit={submit} className="grid gap-5 sm:grid-cols-2">
        <p className="text-sm font-medium sm:col-span-2">Donor</p>
        <Field label="First name" name="firstName" value={form.firstName} onChange={set("firstName")} />
        <Field label="Last name" name="lastName" value={form.lastName} onChange={set("lastName")} />
        <Field label="Email" name="email" type="email" value={form.email} onChange={set("email")} hint="Links repeat gifts to the same donor." />
        <Field label="Phone" name="phone" type="tel" value={form.phone} onChange={set("phone")} placeholder="+254 7…" />
        <label className="flex items-center gap-2 text-sm sm:col-span-2">
          <input type="checkbox" checked={form.anonymous} onChange={(e) => setForm((f) => ({ ...f, anonymous: e.target.checked }))} />
          The donor wants to stay anonymous
        </label>

        <p className="pt-2 text-sm font-medium sm:col-span-2">Gift</p>
        <Select className="sm:col-span-2" label="Campaign" name="campaignId" required value={form.campaignId} onChange={set("campaignId")}
          hint="For gifts not meant for one campaign, create a 'General fund' campaign and use it here."
          options={campaigns.filter((c) => c.status === "active" || c.status === "completed").map((c) => ({ value: String(c.id), label: c.title }))} />
        <Field label="Amount" name="amount" type="number" min={1} step="any" required value={form.amount} onChange={set("amount")} />
        <Select label="Currency" name="currencyId" required value={form.currencyId} onChange={set("currencyId")} options={currencies.map((c) => ({ value: String(c.id), label: `${c.code} · ${c.name}` }))} />
        <Select label="Paid with" name="paymentMethodId" required value={form.paymentMethodId} onChange={set("paymentMethodId")} options={methods.map((m) => ({ value: String(m.id), label: m.name }))} />
        <Field label="M-Pesa or receipt code" name="reference" value={form.reference} onChange={set("reference")} placeholder="e.g. SKL4X9ABC2" />
        <TextArea className="sm:col-span-2" label="Notes" name="notes" rows={2} value={form.notes} onChange={set("notes")} />
        {err && <p role="alert" className="text-sm text-destructive sm:col-span-2">{err}</p>}
      </form>
    </Sheet>
  )
}
