"use client"

import { Suspense, useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { upload } from "@vercel/blob/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DashboardShell } from "@/components/dashboard/shell"
import { useAuth } from "@/contexts/AuthContext"
import { trpc } from "@/app/_trpc/client"
import { ROLES, ROLE_META, type Role } from "@/lib/rbac/roles"
import type { Permission } from "@/lib/rbac/permissions"
import { cn } from "@/lib/utils"

type Tab = "approvals" | "users" | "moderation" | "uploads" | "inbox"

const TABS: { key: Tab; label: string; anyOf: Permission[] }[] = [
  { key: "inbox", label: "Inbox", anyOf: ["volunteers:manage", "users:manage"] },
  { key: "approvals", label: "Approvals", anyOf: ["campaigns:publish", "events:publish", "blog:publish"] },
  { key: "moderation", label: "Photo moderation", anyOf: ["media:moderate"] },
  { key: "uploads", label: "Upload photos", anyOf: ["media:upload", "media:upload_restricted"] },
  { key: "users", label: "Users & roles", anyOf: ["users:manage"] },
]

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-lg border border-dashed px-6 py-14 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  )
}

const STATUS_LABEL: Record<string, string> = { new: "New", in_review: "In review", accepted: "Accepted", declined: "Declined", archived: "Archived" }

function Inbox() {
  const { has } = useAuth()
  const kinds = ([
    has("volunteers:manage") && { key: "volunteer", label: "Volunteer applications" },
    has("users:manage") && { key: "partnership", label: "Partnership inquiries" },
  ].filter(Boolean)) as { key: "volunteer" | "partnership"; label: string }[]
  const [kind, setKind] = useState<"volunteer" | "partnership">(kinds[0]?.key ?? "volunteer")
  const utils = trpc.useUtils()
  const { data, isLoading } = trpc.inquiries.list.useQuery({ kind }, { enabled: kinds.length > 0 })
  const setStatus = trpc.inquiries.setStatus.useMutation({ onSuccess: () => utils.inquiries.list.invalidate() })

  return (
    <div className="space-y-6">
      {kinds.length > 1 && (
        <div className="flex gap-2">
          {kinds.map((k) => (
            <button key={k.key} onClick={() => setKind(k.key)} aria-pressed={kind === k.key}
              className={cn("rounded-full border px-4 py-2 text-sm", kind === k.key ? "border-foreground bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}>
              {k.label}
            </button>
          ))}
        </div>
      )}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !data?.length ? (
        <EmptyState title="Nothing here yet" body="Submissions from the website forms land here, so nothing gets lost." />
      ) : (
        <ul className="divide-y rounded-lg border">
          {data.map((q) => {
            const p = q.payload
            return (
              <li key={q.id} className="p-5">
                <details>
                  <summary className="flex cursor-pointer list-none flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                      <span className="font-medium">{q.name}</span>
                      <span className="text-muted-foreground"> · {new Date(q.created_at).toLocaleDateString()}</span>
                    </span>
                    <span className={cn("text-sm", q.status === "new" ? "text-foreground" : "text-muted-foreground")}>{STATUS_LABEL[q.status]}</span>
                  </summary>
                  <dl className="mt-4 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                    <div><dt className="text-muted-foreground">Email</dt><dd><a className="underline underline-offset-4" href={`mailto:${q.email}`}>{q.email}</a></dd></div>
                    {q.phone && <div><dt className="text-muted-foreground">Phone</dt><dd><a className="underline underline-offset-4" href={`tel:${q.phone}`}>{q.phone}</a></dd></div>}
                    {Object.entries(p).filter(([k, v]) => v && !["email", "phone", "firstName", "lastName", "organizationName", "contactPerson"].includes(k)).map(([k, v]) => (
                      <div key={k} className="sm:col-span-2"><dt className="text-muted-foreground">{k.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase())}</dt><dd className="whitespace-pre-wrap">{v}</dd></div>
                    ))}
                  </dl>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {(["in_review", "accepted", "declined", "archived"] as const).filter((s) => s !== q.status).map((s) => (
                      <Button key={s} size="sm" variant={s === "accepted" ? "default" : "outline"} disabled={setStatus.isPending}
                        onClick={() => setStatus.mutate({ id: q.id, status: s })}>
                        {s === "archived" ? "Archive" : `Mark ${STATUS_LABEL[s].toLowerCase()}`}
                      </Button>
                    ))}
                  </div>
                </details>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function Approvals() {
  const utils = trpc.useUtils()
  const { data, isLoading } = trpc.admin.pendingContent.useQuery()
  const review = trpc.admin.reviewContent.useMutation({ onSuccess: () => utils.admin.pendingContent.invalidate() })

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (!data?.length) return <EmptyState title="Nothing waiting" body="Campaigns, events and posts submitted for review will appear here." />

  return (
    <ul className="divide-y rounded-lg border">
      {data.map((item) => (
        <li key={`${item.kind}-${item.id}`} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted-foreground">
              <span className="capitalize">{item.kind}</span> · submitted by {item.by} · {new Date(item.updatedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={review.isPending}
              onClick={() => review.mutate({ kind: item.kind, id: item.id, decision: "reject" })}>
              Send back
            </Button>
            <Button size="sm" disabled={review.isPending}
              onClick={() => review.mutate({ kind: item.kind, id: item.id, decision: "approve" })}>
              Approve and publish
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}

function UsersAndRoles() {
  const [search, setSearch] = useState("")
  const utils = trpc.useUtils()
  const { data, isLoading } = trpc.admin.listUsers.useQuery({ search: search || undefined })
  const assign = trpc.admin.assignRole.useMutation({ onSuccess: () => utils.admin.listUsers.invalidate() })

  return (
    <div className="space-y-4">
      <div className="max-w-sm">
        <label htmlFor="user-search" className="sr-only">Search users</label>
        <Input id="user-search" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {assign.error && <p role="alert" className="text-sm text-destructive">{assign.error.message}</p>}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !data?.length ? (
        <EmptyState title="No users found" body="People appear here after they sign in for the first time." />
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Person</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.name}</p>
                    <p className="text-muted-foreground">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{u.status}</td>
                  <td className="px-4 py-3">
                    <label htmlFor={`role-${u.id}`} className="sr-only">Role for {u.name}</label>
                    <select
                      id={`role-${u.id}`}
                      className="h-9 rounded-md border bg-background px-2"
                      value={u.role}
                      disabled={assign.isPending}
                      onChange={(e) => assign.mutate({ userId: u.id, role: e.target.value as Role })}
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{ROLE_META[r].label}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <details className="rounded-lg border p-4 text-sm">
        <summary className="cursor-pointer font-medium">What each role can do</summary>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {ROLES.map((r) => (
            <div key={r}>
              <dt className="font-medium">{ROLE_META[r].label}</dt>
              <dd className="text-muted-foreground">{ROLE_META[r].description}</dd>
            </div>
          ))}
        </dl>
      </details>
    </div>
  )
}

function Moderation() {
  const utils = trpc.useUtils()
  const { data, isLoading } = trpc.media.queue.useQuery({ status: "pending" })
  const moderate = trpc.media.moderate.useMutation({ onSuccess: () => utils.media.queue.invalidate() })
  const [alt, setAlt] = useState<Record<number, string>>({})
  const [consent, setConsent] = useState<Record<number, boolean>>({})

  if (isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>
  if (!data?.length) return <EmptyState title="Queue is clear" body="Photos uploaded by volunteers and staff wait here until approved." />

  return (
    <div className="space-y-4">
      {moderate.error && <p role="alert" className="text-sm text-destructive">{moderate.error.message}</p>}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((m) => (
          <li key={m.id} className="overflow-hidden rounded-lg border bg-card">
            <div className="relative aspect-[4/3] bg-muted">
              <Image src={m.url} alt={m.alt ?? "Uploaded photo awaiting review"} fill className="object-cover" sizes="(min-width: 1024px) 33vw, 50vw" />
            </div>
            <div className="space-y-3 p-4 text-sm">
              <p className="text-muted-foreground">
                From {[m.uploader?.first_name, m.uploader?.last_name].filter(Boolean).join(" ") || "unknown"}
                {m.event ? ` · ${m.event.title}` : ""}
              </p>
              <div>
                <label htmlFor={`alt-${m.id}`} className="mb-1 block font-medium">Describe the photo</label>
                <Input id={`alt-${m.id}`} placeholder="e.g. Volunteers serving lunch at Kabete"
                  value={alt[m.id] ?? m.alt ?? ""} onChange={(e) => setAlt({ ...alt, [m.id]: e.target.value })} />
              </div>
              <label className="flex items-start gap-2">
                <input type="checkbox" className="mt-0.5" checked={consent[m.id] ?? m.consent_confirmed}
                  onChange={(e) => setConsent({ ...consent, [m.id]: e.target.checked })} />
                <span>Consent confirmed for everyone identifiable (guardian consent for children)</span>
              </label>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={moderate.isPending}
                  onClick={() => moderate.mutate({ id: m.id, decision: "reject", reason: "Not suitable for publishing" })}>
                  Reject
                </Button>
                <Button size="sm" disabled={moderate.isPending}
                  onClick={() => moderate.mutate({ id: m.id, decision: "approve", alt: alt[m.id] ?? m.alt ?? undefined, consentConfirmed: consent[m.id] ?? m.consent_confirmed })}>
                  Approve
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Uploads() {
  const utils = trpc.useUtils()
  const allowance = trpc.media.uploadAllowance.useQuery()
  const mine = trpc.media.myUploads.useQuery()
  const register = trpc.media.register.useMutation()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [consent, setConsent] = useState(false)

  async function onFiles(files: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    setError(null)
    try {
      for (const file of Array.from(files)) {
        const blob = await upload(`uploads/${file.name}`, file, { access: "public", handleUploadUrl: "/api/media/upload" })
        await register.mutateAsync({
          url: blob.url,
          kind: file.type.startsWith("video") ? "video" : "image",
          bytes: file.size,
          consentConfirmed: consent,
        })
      }
      await Promise.all([utils.media.myUploads.invalidate(), utils.media.uploadAllowance.invalidate()])
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setBusy(false)
    }
  }

  const remaining = allowance.data?.remaining
  const blocked = allowance.data?.limited && remaining === 0

  return (
    <div className="space-y-6">
      <div className="rounded-lg border p-5">
        <p className="font-medium">Share photos from an event</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Photos are reviewed before they appear in the gallery.
          {allowance.data?.limited && remaining != null ? ` You can upload ${remaining} more today.` : ""}
        </p>
        <label className="mt-4 flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-0.5" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>Everyone identifiable in these photos agreed to be photographed (guardian consent for children).</span>
        </label>
        <div className="mt-4">
          <label htmlFor="photo-upload" className={cn("inline-flex h-10 cursor-pointer items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground", (busy || blocked) && "pointer-events-none opacity-50")}>
            {busy ? "Uploading…" : "Choose photos"}
          </label>
          <input id="photo-upload" type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only"
            disabled={busy || blocked} onChange={(e) => onFiles(e.target.files)} />
        </div>
        {error && <p role="alert" className="mt-3 text-sm text-destructive">{error}</p>}
      </div>

      <div>
        <h3 className="mb-3 font-sans text-sm font-medium">Your uploads</h3>
        {!mine.data?.length ? (
          <EmptyState title="No uploads yet" body="Your photos and their review status will show here." />
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {mine.data.map((m) => (
              <li key={m.id} className="overflow-hidden rounded-md border">
                <div className="relative aspect-square bg-muted">
                  <Image src={m.url} alt={m.alt ?? "Your upload"} fill className="object-cover" sizes="25vw" />
                </div>
                <p className={cn("px-2 py-1.5 text-xs capitalize",
                  m.moderation_status === "approved" ? "text-success" : m.moderation_status === "rejected" ? "text-destructive" : "text-muted-foreground")}>
                  {m.moderation_status}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

function AdminInner() {
  const params = useSearchParams()
  const router = useRouter()
  const { hasAny } = useAuth()
  const tabs = TABS.filter((t) => hasAny(t.anyOf))
  const requested = params?.get("tab") as Tab | null
  const active = tabs.find((t) => t.key === requested)?.key ?? tabs[0]?.key

  if (!tabs.length) {
    return <EmptyState title="Nothing to manage here" body="Your role doesn't include admin tools." />
  }

  return (
    <div>
      <div role="tablist" aria-label="Admin sections" className="flex gap-1 overflow-x-auto border-b">
        {tabs.map((t) => (
          <button key={t.key} role="tab" aria-selected={active === t.key}
            onClick={() => router.replace(`/dashboard/admin?tab=${t.key}`)}
            className={cn("-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm transition-colors",
              active === t.key ? "border-foreground text-foreground" : "border-transparent text-muted-foreground hover:text-foreground")}>
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="pt-8">
        {active === "inbox" && <Inbox />}
        {active === "approvals" && <Approvals />}
        {active === "users" && <UsersAndRoles />}
        {active === "moderation" && <Moderation />}
        {active === "uploads" && <Uploads />}
      </div>
    </div>
  )
}

export default function AdminPage() {
  return (
    <DashboardShell title="Manage" description="Approvals, people, photos and messages.">
      <Suspense fallback={null}>
        <AdminInner />
      </Suspense>
    </DashboardShell>
  )
}
