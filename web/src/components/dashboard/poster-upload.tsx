"use client"

import { useState } from "react"
import Image from "next/image"
import { upload } from "@vercel/blob/client"
import { ImageUp, X } from "lucide-react"

/**
 * Poster or cover image for a campaign or event. Uploads straight to Vercel Blob
 * and hands back the URL. Images only, up to 10 MB.
 */
export function PosterUpload({ label = "Poster or cover image", value, onChange }: { label?: string; value: string; onChange: (url: string) => void }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onFile(file?: File) {
    if (!file) return
    setError(null)
    if (!file.type.startsWith("image/")) return setError("Choose an image (JPG, PNG or WebP).")
    if (file.size > 10 * 1024 * 1024) return setError("That image is over 10 MB. Try a smaller one.")
    setBusy(true)
    try {
      const blob = await upload(`posters/${file.name}`, file, { access: "public", handleUploadUrl: "/api/media/upload" })
      onChange(blob.url)
    } catch (e) {
      setError((e as Error).message || "Upload failed. Try again.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="sm:col-span-2">
      <p className="mb-1.5 text-sm font-medium">{label} <span className="font-normal text-muted-foreground">(optional)</span></p>
      {value ? (
        <div className="relative overflow-hidden rounded-lg border">
          <div className="relative aspect-[16/9] bg-muted">
            <Image src={value} alt="" fill sizes="36rem" className="object-cover" unoptimized />
          </div>
          <button type="button" onClick={() => onChange("")} aria-label="Remove image" className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 hover:bg-background">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-4 py-8 text-center text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground">
          <ImageUp className="h-5 w-5" />
          {busy ? "Uploading…" : "Choose an image"}
          <span className="text-xs">JPG, PNG or WebP, up to 10 MB. Shown on the public page.</span>
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      )}
      {error && <p role="alert" className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  )
}
