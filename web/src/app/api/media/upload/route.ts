import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { currentUser } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { can, RESTRICTED_UPLOAD } from "@/lib/rbac/permissions"
import { normalizeRole } from "@/lib/rbac/roles"
import { getOrCreateDbUser } from "@/server/current-user"

/**
 * Issues short-lived Vercel Blob upload tokens. The file goes straight from the browser
 * to Blob storage; the client then calls trpc.media.register, which writes the
 * moderation record. Requires BLOB_READ_WRITE_TOKEN in the environment.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const clerkUser = await currentUser()
        if (!clerkUser) throw new Error("Not signed in")
        const dbUser = await getOrCreateDbUser(clerkUser)
        const role = normalizeRole(dbUser?.role?.name)
        const full = can(role, "media:upload")
        if (!full && !can(role, "media:upload_restricted")) throw new Error("Not allowed to upload")
        return {
          allowedContentTypes: full
            ? [...RESTRICTED_UPLOAD.mimeTypes, "video/mp4", "video/webm"]
            : [...RESTRICTED_UPLOAD.mimeTypes],
          maximumSizeInBytes: full ? 200 * 1024 * 1024 : RESTRICTED_UPLOAD.maxBytes,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ userId: dbUser?.id }),
        }
      },
      onUploadCompleted: async () => {
        // The record is created by trpc.media.register (works in local dev too, where this callback cannot reach us).
      },
    })
    return NextResponse.json(json)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
