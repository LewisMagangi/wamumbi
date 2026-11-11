import { z } from "zod"
import { TRPCError } from "@trpc/server"
import { prisma } from "@/lib/prisma"
import { can, canAny, RESTRICTED_UPLOAD } from "@/lib/rbac/permissions"
import { audit } from "@/server/audit"
import { permissionProcedure, protectedProcedure, publicProcedure, router } from "./trpc"
import { notifyPermission, notifyUsers } from "@/server/in-app"

const BLOB_HOST = /\.public\.blob\.vercel-storage\.com$/

function isAllowedUrl(url: string) {
  try {
    const u = new URL(url)
    return u.protocol === "https:" && BLOB_HOST.test(u.hostname)
  } catch {
    return false
  }
}

const startOfToday = () => {
  const d = new Date()
  d.setHours(0, 0, 0, 0)
  return d
}

export const mediaRouter = router({
  /** Approved photos for the public gallery (static past-event photos live in /public/media). */
  listApproved: publicProcedure
    .input(z.object({
      eventId: z.number().int().optional(),
      /** Slug of a past event (see data/past-events.ts). */
      album: z.string().max(100).optional(),
      limit: z.number().int().min(1).max(100).default(48),
    }).optional())
    .query(async ({ input }) => {
      const rows = await prisma.mediaAsset.findMany({
        where: { moderation_status: "approved", consent_confirmed: true, kind: "image", event_id: input?.eventId, album: input?.album },
        orderBy: [{ taken_at: "desc" }, { created_at: "desc" }],
        take: input?.limit ?? 48,
        select: { id: true, url: true, kind: true, width: true, height: true, alt: true, caption: true, album: true, event_id: true, taken_at: true },
      })
      return rows
    }),

  /** How many uploads the caller has left today (volunteers are limited). */
  uploadAllowance: protectedProcedure.input(z.void()).query(async ({ ctx }) => {
    if (can(ctx.user.role, "media:upload")) return { limited: false, remaining: null as number | null }
    if (!can(ctx.user.role, "media:upload_restricted")) return { limited: true, remaining: 0 }
    const used = await prisma.mediaAsset.count({ where: { uploaded_by: ctx.user.id, created_at: { gte: startOfToday() } } })
    return { limited: true, remaining: Math.max(0, RESTRICTED_UPLOAD.maxPerDay - used) }
  }),

  /** Register a file after it was uploaded to Vercel Blob via /api/media/upload. */
  register: permissionProcedure("media:upload", "media:upload_restricted")
    .input(
      z.object({
        url: z.string().url().max(500),
        kind: z.enum(["image", "video"]).default("image"),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
        bytes: z.number().int().positive().optional(),
        alt: z.string().trim().max(300).optional(),
        caption: z.string().trim().max(2000).optional(),
        eventId: z.number().int().optional(),
        /** Past-event slug, for photos from events held before the site tracked them. */
        album: z.string().trim().max(100).optional(),
        consentConfirmed: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (!isAllowedUrl(input.url)) throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown file location" })
      const restricted = !can(ctx.user.role, "media:upload")
      if (restricted) {
        if (input.kind !== "image") throw new TRPCError({ code: "FORBIDDEN", message: "Volunteers can upload photos only" })
        if (input.bytes && input.bytes > RESTRICTED_UPLOAD.maxBytes) throw new TRPCError({ code: "PAYLOAD_TOO_LARGE" })
        const used = await prisma.mediaAsset.count({ where: { uploaded_by: ctx.user.id, created_at: { gte: startOfToday() } } })
        if (used >= RESTRICTED_UPLOAD.maxPerDay) {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: `Daily limit of ${RESTRICTED_UPLOAD.maxPerDay} photos reached` })
        }
      }
      // Moderators' own uploads are approved immediately; everyone else goes to the queue.
      const autoApprove = can(ctx.user.role, "media:moderate") && input.consentConfirmed
      const row = await prisma.mediaAsset.create({
        data: {
          url: input.url,
          kind: input.kind,
          width: input.width,
          height: input.height,
          bytes: input.bytes,
          alt: input.alt,
          caption: input.caption,
          event_id: input.eventId,
          album: input.album,
          uploaded_by: ctx.user.id,
          consent_confirmed: input.consentConfirmed,
          moderation_status: autoApprove ? "approved" : "pending",
          moderated_by: autoApprove ? ctx.user.id : null,
          moderated_at: autoApprove ? new Date() : null,
        },
      })
      if (row.moderation_status === "pending") {
        await notifyPermission(["media:moderate"], { title: "Photo waiting for review", message: "A new photo was uploaded and needs review before it appears in the gallery.", eventId: input.eventId }, ctx.user.id)
      }
      return { id: row.id, status: row.moderation_status }
    }),

  myUploads: protectedProcedure.input(z.void()).query(({ ctx }) =>
    prisma.mediaAsset.findMany({
      where: { uploaded_by: ctx.user.id },
      orderBy: { created_at: "desc" },
      take: 100,
      select: { id: true, url: true, alt: true, moderation_status: true, rejection_reason: true, created_at: true },
    })
  ),

  queue: permissionProcedure("media:moderate")
    .input(z.object({ status: z.enum(["pending", "approved", "rejected"]).default("pending") }).optional())
    .query(({ input }) =>
      prisma.mediaAsset.findMany({
        where: { moderation_status: input?.status ?? "pending" },
        orderBy: { created_at: "asc" },
        take: 100,
        include: { uploader: { select: { first_name: true, last_name: true } }, event: { select: { id: true, title: true } } },
      })
    ),

  moderate: permissionProcedure("media:moderate")
    .input(
      z.object({
        id: z.number().int(),
        decision: z.enum(["approve", "reject"]),
        alt: z.string().trim().max(300).optional(),
        consentConfirmed: z.boolean().optional(),
        facesBlurred: z.boolean().optional(),
        reason: z.string().trim().max(300).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const asset = await prisma.mediaAsset.findUnique({ where: { id: input.id } })
      if (!asset) throw new TRPCError({ code: "NOT_FOUND" })
      const consent = input.consentConfirmed ?? asset.consent_confirmed
      const alt = input.alt ?? asset.alt
      if (input.decision === "approve" && (!consent || !alt)) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Approved photos need alt text and confirmed consent" })
      }
      await prisma.mediaAsset.update({
        where: { id: input.id },
        data: {
          moderation_status: input.decision === "approve" ? "approved" : "rejected",
          alt,
          consent_confirmed: consent,
          faces_blurred: input.facesBlurred ?? asset.faces_blurred,
          rejection_reason: input.decision === "reject" ? input.reason ?? null : null,
          moderated_by: ctx.user.id,
          moderated_at: new Date(),
        },
      })
      await audit({ userId: ctx.user.id, action: `media_${input.decision}`, entity: "media", entityId: input.id })
      if (asset.uploaded_by && asset.uploaded_by !== ctx.user.id) {
        await notifyUsers([asset.uploaded_by], input.decision === "approve"
          ? { title: "Your photo is live", message: "A photo you uploaded was approved and now appears in the gallery." }
          : { title: "Your photo wasn't approved", message: input.reason ? `Reason: ${input.reason}` : "A photo you uploaded wasn't approved for the gallery." })
      }
      return { ok: true }
    }),

  delete: protectedProcedure.input(z.object({ id: z.number().int() })).mutation(async ({ input, ctx }) => {
    const asset = await prisma.mediaAsset.findUnique({ where: { id: input.id } })
    if (!asset) throw new TRPCError({ code: "NOT_FOUND" })
    const own = asset.uploaded_by === ctx.user.id && asset.moderation_status === "pending"
    if (!own && !canAny(ctx.user.role, ["media:moderate"])) throw new TRPCError({ code: "FORBIDDEN" })
    await prisma.mediaAsset.delete({ where: { id: input.id } })
    await audit({ userId: ctx.user.id, action: "media_delete", entity: "media", entityId: input.id })
    return { ok: true }
  }),
})
