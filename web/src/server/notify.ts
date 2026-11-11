import "server-only"

/**
 * Email the team about a new form submission.
 * Uses Resend's HTTP API when RESEND_API_KEY is set (free tier, no SDK needed).
 * Recipients: NOTIFY_EMAIL, falling back to PARTNERSHIP_EMAIL.
 * Without configuration it does nothing: submissions are always saved in the
 * database and visible in Dashboard → Manage → Inbox, so nothing is lost.
 */
const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")

export async function notify(msg: {
  subject: string
  fields: Record<string, string | undefined>
  replyTo?: string
  link?: string
}) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_EMAIL || process.env.PARTNERSHIP_EMAIL
  if (!key || !to) return { sent: false as const }

  const rows = Object.entries(msg.fields)
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666;vertical-align:top">${escape(k)}</td><td style="padding:4px 0;white-space:pre-wrap">${escape(v!)}</td></tr>`)
    .join("")
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? ""
  const html = `<h2 style="font-family:Georgia,serif">${escape(msg.subject)}</h2><table style="font-family:sans-serif;font-size:14px">${rows}</table>${
    msg.link && site ? `<p><a href="${site}${msg.link}">Open in the dashboard</a></p>` : ""
  }`
  const text = Object.entries(msg.fields).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n")

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || "Wamumbi website <onboarding@resend.dev>",
        to: to.split(",").map((s) => s.trim()),
        reply_to: msg.replyTo,
        subject: msg.subject,
        html,
        text,
      }),
    })
    return { sent: res.ok }
  } catch (err) {
    console.error("notify failed", err)
    return { sent: false as const }
  }
}
