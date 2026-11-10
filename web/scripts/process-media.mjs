#!/usr/bin/env node
/**
 * Media pipeline for the gallery and past events.
 *
 *   node scripts/process-media.mjs extract   # unpack *.tar from media-inbox/
 *   node scripts/process-media.mjs process   # resize, strip EXIF/GPS, build catalog + contact sheets
 *   node scripts/process-media.mjs publish   # copy curated photos (src/data/gallery-selection.json) to public/media
 *
 * Raw files stay in media-inbox/ (gitignored). Only curated, optimised WebP files are committed.
 */
import { execFileSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"
import sharp from "sharp"

const ROOT = process.cwd()
const INBOX = path.join(ROOT, "media-inbox")
const EXTRACTED = path.join(INBOX, "extracted")
const PROCESSED = path.join(INBOX, "processed")
const SHEETS = path.join(INBOX, "sheets")
const CATALOG = path.join(INBOX, "catalog.json")
const SELECTION = path.join(ROOT, "src", "data", "gallery-selection.json")
const PUBLIC_DIR = path.join(ROOT, "public", "media")
const GENERATED = path.join(ROOT, "src", "data", "gallery.generated.json")

const WIDTHS = [640, 1280, 1920]

function extract() {
  fs.mkdirSync(EXTRACTED, { recursive: true })
  for (const f of fs.readdirSync(INBOX).filter((f) => f.endsWith(".tar"))) {
    const name = f.includes("telegram") ? "telegram" : f.includes("albums") ? "albums" : path.basename(f, ".tar")
    const dest = path.join(EXTRACTED, name)
    fs.mkdirSync(dest, { recursive: true })
    execFileSync("tar", ["-xf", path.join(INBOX, f), "-C", dest])
    console.log("extracted", f, "->", path.relative(ROOT, dest))
  }
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name)
    return d.isDirectory() ? walk(p) : [p]
  })
}

function readManifest(dir) {
  const m = path.join(dir, "manifest.json")
  return fs.existsSync(m) ? JSON.parse(fs.readFileSync(m, "utf8")) : []
}

async function processAll() {
  fs.mkdirSync(PROCESSED, { recursive: true })
  fs.mkdirSync(SHEETS, { recursive: true })
  const catalog = []
  for (const source of fs.readdirSync(EXTRACTED)) {
    const dir = path.join(EXTRACTED, source)
    const manifest = new Map(readManifest(dir).map((m) => [m.name, m]))
    const files = walk(dir).filter((f) => /\.(jpe?g|png|webp)$/i.test(f)).sort()
    for (const file of files) {
      const rel = path.relative(dir, file).split(path.sep).join("/")
      const meta = manifest.get(rel) ?? {}
      const id = `${source === "telegram" ? "tg" : "gp"}-${rel.replace(/\.[^.]+$/, "").replace(/[^a-z0-9]+/gi, "-")}`.toLowerCase()
      try {
        const img = sharp(file, { failOn: "none" }).rotate() // apply EXIF orientation; output drops EXIF/GPS
        const { width, height } = await img.metadata()
        if (!width || !height || Math.min(width, height) < 300) continue
        const out = path.join(PROCESSED, id)
        fs.mkdirSync(out, { recursive: true })
        for (const w of WIDTHS) {
          if (w > width && w !== WIDTHS[0]) continue
          await sharp(file, { failOn: "none" }).rotate().resize({ width: Math.min(w, width), withoutEnlargement: true })
            .webp({ quality: 72, effort: 5 }).toFile(path.join(out, `${w}.webp`))
        }
        const blur = await sharp(file, { failOn: "none" }).rotate().resize(16).webp({ quality: 40 }).toBuffer()
        const oriented = (await sharp(file, { failOn: "none" }).rotate().toBuffer({ resolveWithObject: true })).info
        catalog.push({
          id,
          source,
          album: meta.album ?? (source === "telegram" ? "Telegram" : rel.split("/")[0]),
          date: meta.date ?? null,
          post: meta.post ?? null,
          width: oriented.width,
          height: oriented.height,
          widths: WIDTHS.filter((w) => fs.existsSync(path.join(out, `${w}.webp`))),
          blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
        })
      } catch (e) {
        console.warn("skip", rel, e.message)
      }
    }
  }
  catalog.sort((a, b) => (a.album + a.id).localeCompare(b.album + b.id))
  fs.writeFileSync(CATALOG, JSON.stringify(catalog, null, 1))
  console.log("catalog:", catalog.length, "images")
  await contactSheets(catalog)
}

/** 6x4 grids of numbered thumbnails, one album at a time, for curation. */
async function contactSheets(catalog) {
  const cols = 6, rows = 4, cell = 220, pad = 4, label = 22
  const byAlbum = Object.groupBy ? Object.groupBy(catalog, (c) => c.album) : catalog.reduce((a, c) => ((a[c.album] ??= []).push(c), a), {})
  let n = 0
  const index = []
  for (const [album, items] of Object.entries(byAlbum)) {
    for (let i = 0; i < items.length; i += cols * rows) {
      const page = items.slice(i, i + cols * rows)
      const composites = []
      for (const [k, it] of page.entries()) {
        const x = (k % cols) * (cell + pad), y = Math.floor(k / cols) * (cell + label + pad)
        const thumb = await sharp(path.join(PROCESSED, it.id, "640.webp")).resize(cell, cell, { fit: "cover" }).toBuffer()
        composites.push({ input: thumb, left: x, top: y + label })
        const svg = `<svg width="${cell}" height="${label}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#111"/><text x="4" y="16" font-family="sans-serif" font-size="14" fill="#fff">${it.id.slice(0, 26)}</text></svg>`
        composites.push({ input: Buffer.from(svg), left: x, top: y })
      }
      const W = cols * (cell + pad), H = rows * (cell + label + pad)
      const file = path.join(SHEETS, `sheet-${String(++n).padStart(2, "0")}.jpg`)
      await sharp({ create: { width: W, height: H, channels: 3, background: "#222" } }).composite(composites).jpeg({ quality: 70 }).toFile(file)
      index.push({ sheet: path.basename(file), album, count: page.length })
    }
  }
  fs.writeFileSync(path.join(SHEETS, "index.json"), JSON.stringify(index, null, 1))
  console.log("contact sheets:", n)
}

function publish() {
  const catalog = new Map(JSON.parse(fs.readFileSync(CATALOG, "utf8")).map((c) => [c.id, c]))
  const selection = JSON.parse(fs.readFileSync(SELECTION, "utf8"))
  fs.rmSync(PUBLIC_DIR, { recursive: true, force: true })
  const out = { hero: selection.hero ?? null, events: {} }
  for (const [eventSlug, ids] of Object.entries(selection.events)) {
    out.events[eventSlug] = []
    for (const id of ids) {
      const c = catalog.get(id)
      if (!c) { console.warn("unknown id", id); continue }
      const dest = path.join(PUBLIC_DIR, eventSlug)
      fs.mkdirSync(dest, { recursive: true })
      for (const w of c.widths) fs.copyFileSync(path.join(PROCESSED, id, `${w}.webp`), path.join(dest, `${id}-${w}.webp`))
      out.events[eventSlug].push({
        id, width: c.width, height: c.height, blurDataURL: c.blurDataURL,
        src: `/media/${eventSlug}/${id}-${c.widths.at(-1)}.webp`,
        srcSet: c.widths.map((w) => `/media/${eventSlug}/${id}-${w}.webp ${w}w`).join(", "),
        date: c.date,
      })
    }
  }
  fs.writeFileSync(GENERATED, JSON.stringify(out, null, 1) + "\n")
  console.log("published", Object.values(out.events).flat().length, "photos")
}

const cmd = process.argv[2]
if (cmd === "extract") extract()
else if (cmd === "process") await processAll()
else if (cmd === "publish") publish()
else console.log("usage: process-media.mjs extract|process|publish")
