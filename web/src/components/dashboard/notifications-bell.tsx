"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns/formatDistanceToNow"
import { Bell } from "lucide-react"
import { trpc } from "@/app/_trpc/client"
import { cn } from "@/lib/utils"

/** Bell in the dashboard header: the signed-in person's own notifications. */
export function NotificationsBell() {
  const utils = trpc.useUtils()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const count = trpc.notifications.unreadCount.useQuery(undefined, { refetchInterval: 60_000 })
  const list = trpc.notifications.list.useQuery(undefined, { enabled: open })
  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => { utils.notifications.unreadCount.invalidate(); utils.notifications.list.invalidate() },
  })
  const unread = count.data ?? 0

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false) }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey) }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        aria-expanded={open}
        className="relative grid h-9 w-9 place-items-center rounded-md hover:bg-accent"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 text-[10px] font-medium tabular-nums text-brand-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-[22rem] max-w-[calc(100vw-2rem)] overflow-hidden rounded-lg border bg-popover shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-medium">Notifications</p>
            {unread > 0 && (
              <button onClick={() => markRead.mutate({})} className="text-xs text-muted-foreground hover:text-foreground">Mark all as read</button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {list.isLoading ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">Loading…</p>
            ) : !list.data?.length ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">Nothing yet. Approvals, new applications and registrations show up here.</p>
            ) : (
              <ul className="divide-y">
                {list.data.map((n) => {
                  const body = (
                    <>
                      <p className={cn("text-sm", !n.isRead && "font-medium")}>{n.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}</p>
                    </>
                  )
                  const cls = cn("block px-4 py-3 hover:bg-accent/50", !n.isRead && "bg-accent/30")
                  const onClick = () => { if (!n.isRead) markRead.mutate({ ids: [n.id] }); setOpen(false) }
                  return (
                    <li key={n.id}>
                      {n.href ? <Link href={n.href} className={cls} onClick={onClick}>{body}</Link> : <button className={cn(cls, "w-full text-left")} onClick={onClick}>{body}</button>}
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
