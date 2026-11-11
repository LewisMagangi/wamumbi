import { NextRequest, NextResponse } from "next/server"
import { partnershipInquiry, savePartnership } from "@/trpc/inquiries-router"

// REST endpoint kept for compatibility. Saves the inquiry (Dashboard → Manage → Inbox)
// and emails the team when RESEND_API_KEY is configured.
export async function POST(request: NextRequest) {
  const parsed = partnershipInquiry.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid request" }, { status: 400 })
  }
  try {
    return NextResponse.json(await savePartnership(parsed.data))
  } catch (err) {
    console.error("partnership inquiry failed", err)
    return NextResponse.json({ error: "Could not save your inquiry. Please email us instead." }, { status: 500 })
  }
}
