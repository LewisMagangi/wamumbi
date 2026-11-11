import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react"
import { cn } from "@/lib/utils"

export const fieldClass =
  "w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground/70 transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 aria-[invalid=true]:border-destructive"

type Common = { label: string; name: string; hint?: string; error?: string; required?: boolean; className?: string }

function Wrap({ label, name, hint, error, required, className, children }: Common & { children: ReactNode }) {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium">
        {label}
        {!required && <span className="ml-1 font-normal text-muted-foreground">(optional)</span>}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-destructive">{error}</p>
      ) : hint ? (
        <p id={`${name}-hint`} className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  )
}

const describedBy = (name: string, error?: string, hint?: string) =>
  error ? `${name}-error` : hint ? `${name}-hint` : undefined

export function Field({ label, name, hint, error, required, className, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <Wrap {...{ label, name, hint, error, required, className }}>
      <input id={name} name={name} required={required} aria-invalid={!!error} aria-describedby={describedBy(name, error, hint)} className={fieldClass} {...props} />
    </Wrap>
  )
}

export function TextArea({ label, name, hint, error, required, className, ...props }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Wrap {...{ label, name, hint, error, required, className }}>
      <textarea id={name} name={name} required={required} rows={4} aria-invalid={!!error} aria-describedby={describedBy(name, error, hint)} className={fieldClass} {...props} />
    </Wrap>
  )
}

export function Select({ label, name, hint, error, required, className, options, placeholder, ...props }: Common & SelectHTMLAttributes<HTMLSelectElement> & { options: { value: string; label: string }[]; placeholder?: string }) {
  return (
    <Wrap {...{ label, name, hint, error, required, className }}>
      <select id={name} name={name} required={required} aria-invalid={!!error} className={fieldClass} {...props}>
        <option value="">{placeholder ?? "Choose one"}</option>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </Wrap>
  )
}

export function FormSection({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <fieldset className="grid gap-6 border-t py-10 first:border-t-0 first:pt-0 md:grid-cols-[14rem_1fr] md:gap-12">
      <legend className="sr-only">{title}</legend>
      <div aria-hidden>
        <p className="font-display text-xl">{title}</p>
        {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  )
}

/** Hidden field for bots. People never see or fill it. */
export function Honeypot() {
  return (
    <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="company_website">Leave this empty</label>
      <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
    </div>
  )
}

export function FormStatus({ state, message }: { state: "idle" | "success" | "error"; message?: string }) {
  if (state === "idle" || !message) return null
  return (
    <div role="status" aria-live="polite"
      className={cn("rounded-md border px-4 py-3 text-sm", state === "success" ? "border-success/40 bg-success/10" : "border-destructive/40 bg-destructive/10")}>
      {message}
    </div>
  )
}
