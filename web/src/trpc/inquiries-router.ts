import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { prisma } from "@/lib/prisma"
import { can } from "@/lib/rbac/permissions"
import { audit } from "@/server/audit"
import { notify } from "@/server/notify"
import { protectedProcedure, publicProcedure, router } from "./trpc"
import type { Prisma } from "@/generated/prisma"

const text = (max: number) => z.string().trim().max(max)
const optional = (max: number) => text(max).optional()

/** Honeypot field: real people leave it empty, most bots fill it. */
const honeypot = { company_website: z.string().max(0).optional() }

export const volunteerApplication = z.object({
  firstName: text(100).min(1, "First name is required"),
  lastName: text(100).min(1, "Last name is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: optional(40),
  location: optional(200),
  availability: optional(1000),
  skills: optional(1000),
  experience: optional(2000),
  motivation: text(2000).min(1, "Tell us a little about why you want to volunteer"),
  emergencyContactName: optional(200),
  emergencyContactPhone: optional(40),
  emergencyContactRelationship: optional(100),
  consent: z.literal(true, { message: "Please agree so we can contact you" }),
  ...honeypot,
})

export const partnershipInquiry = z.object({
  organizationName: text(200).min(1, "Organisation name is required"),
  contactPerson: text(200).min(1, "Contact person is required"),
  email: z.string().trim().email("Enter a valid email"),
  phone: optional(40),
  organizationType: optional(100),
  partnershipInterest: optional(100),
  message: optional(4000),
  website: optional(300),
  ...honeypot,
})

const ok = { success: true, message: "Thank you. We've received your message and will get back to you soon." }

/** Who may read which kind of submission. */
function canRead(role: Parameters<typeof can>[0], kind: "volunteer" | "partnership") {
  return kind === "volunteer" ? can(role, "volunteers:manage") : can(role, "users:manage")
}

/** Shared with the legacy partnership.submitInquiry procedure and /api/partnership route. */
export async function savePartnership(input: z.infer<typeof partnershipInquiry>) {
  if (input.company_website) return ok
    const { company_website: _hp, ...payload } = input
    const row = await prisma.inquiry.create({
      data: { kind: "partnership", name: `${input.organizationName} (${input.contactPerson})`, email: input.email, phone: input.phone, payload: payload as Prisma.InputJsonValue },
    })
    await notify({
      subject: `Partnership inquiry from ${input.organizationName}`,
      fields: { Organisation: input.organizationName, Contact: input.contactPerson, Email: input.email, Phone: input.phone, Type: input.organizationType, Interest: input.partnershipInterest, Website: input.website, Message: input.message },
      replyTo: input.email,
      link: `/dashboard/admin?tab=inbox&id=${row.id}`,
    })
  return ok
}

export const inquiriesRouter = router({
  submitVolunteer: publicProcedure.input(volunteerApplication).mutation(async ({ input }) => {
    if (input.company_website) return ok // bot: pretend success, store nothing
    const { company_website: _hp, consent: _c, ...payload } = input
    const name = `${input.firstName} ${input.lastName}`
    const row = await prisma.inquiry.create({
      data: { kind: "volunteer", name, email: input.email, phone: input.phone, payload: payload as Prisma.InputJsonValue },
    })
    await notify({
      subject: `New volunteer application: ${name}`,
      fields: { Name: name, Email: input.email, Phone: input.phone, Location: input.location, Availability: input.availability, Skills: input.skills, Motivation: input.motivation },
      replyTo: input.email,
      link: `/dashboard/admin?tab=inbox&id=${row.id}`,
    })
    return ok
  }),

  submitPartnership: publicProcedure.input(partnershipInquiry).mutation(({ input }) => savePartnership(input)),

  list: protectedProcedure
    .input(z.object({ kind: z.enum(["volunteer", "partnership"]), status: z.enum(["new", "in_review", "accepted", "declined", "archived"]).optional() }))
    .query(async ({ input, ctx }) => {
      if (!canRead(ctx.user.role, input.kind)) throw new TRPCError({ code: "FORBIDDEN" })
      const rows = await prisma.inquiry.findMany({
        where: { kind: input.kind, status: input.status ?? { not: "archived" } },
        orderBy: { created_at: "desc" },
        take: 200,
      })
      // Flatten Prisma's recursive JSON type: the form answers are plain strings.
      return rows.map((r) => ({
        id: r.id, kind: r.kind, name: r.name, email: r.email, phone: r.phone,
        status: r.status, created_at: r.created_at,
        payload: (r.payload ?? {}) as Record<string, string | undefined>,
      }))
    }),

  setStatus: protectedProcedure
    .input(z.object({ id: z.number().int(), status: z.enum(["new", "in_review", "accepted", "declined", "archived"]) }))
    .mutation(async ({ input, ctx }) => {
      const row = await prisma.inquiry.findUnique({ where: { id: input.id } })
      if (!row) throw new TRPCError({ code: "NOT_FOUND" })
      if (!canRead(ctx.user.role, row.kind)) throw new TRPCError({ code: "FORBIDDEN" })
      await prisma.inquiry.update({ where: { id: input.id }, data: { status: input.status, handled_by: ctx.user.id, handled_at: new Date() } })
      await audit({ userId: ctx.user.id, action: `inquiry_${input.status}`, entity: "inquiry", entityId: input.id })
      return { ok: true }
    }),
})
