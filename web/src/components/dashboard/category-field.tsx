"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Select, fieldClass } from "@/components/forms/fields"
import { Button } from "@/components/ui/button"

/** Category select with an inline "Add a category" for people allowed to create one. */
export function CategoryField({ value, onChange, options, canAdd, onAdd, adding }: {
  value: string
  onChange: (id: string) => void
  options: { id: number; name: string }[]
  canAdd: boolean
  onAdd: (name: string) => Promise<{ id: number }>
  adding: boolean
}) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [err, setErr] = useState<string | null>(null)

  async function add() {
    setErr(null)
    if (name.trim().length < 2) return setErr("Give the category a name.")
    try {
      const c = await onAdd(name.trim())
      onChange(String(c.id))
      setName("")
      setOpen(false)
    } catch (e) {
      setErr((e as Error).message)
    }
  }

  return (
    <div>
      <Select label="Category" name="categoryId" required value={value} onChange={(e) => onChange(e.target.value)} options={options.map((c) => ({ value: String(c.id), label: c.name }))} />
      {canAdd && !open && (
        <button type="button" onClick={() => setOpen(true)} className="mt-1.5 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <Plus className="h-3.5 w-3.5" /> Add a category
        </button>
      )}
      {open && (
        <div className="mt-2 flex gap-2">
          <label htmlFor="new-category" className="sr-only">New category name</label>
          <input id="new-category" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Medical support" className={fieldClass}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add() } }} />
          <Button type="button" variant="outline" onClick={add} disabled={adding}>{adding ? "Adding…" : "Add"}</Button>
          <Button type="button" variant="ghost" onClick={() => { setOpen(false); setErr(null) }}>Cancel</Button>
        </div>
      )}
      {err && <p role="alert" className="mt-1.5 text-sm text-destructive">{err}</p>}
    </div>
  )
}
