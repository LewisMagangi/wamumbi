import { can, type Permission } from "./permissions"
import type { Role } from "./roles"

/**
 * Response shaping. Blocking a request is not enough: some roles may see a record
 * but not every field on it ("donor info, no contact"; "anonymised views").
 * These helpers walk any JSON-like result and strip fields by key name, so routers
 * only need `.use(redactOutput("donor"))` instead of per-handler edits.
 */

const DONOR_CONTACT_KEYS = /^(donor)?(email|phone|address|addressline|street.*|city|postalcode|postal_code|phonenumber)$/i
const PERSON_CONTACT_KEYS = /^(email|phone|phonenumber|address|emergencycontact|emergency_contact|emergencycontactphone|emergencycontactname|backgroundcheck.*|background_check.*)$/i
const LAST_NAME_KEYS = /^(last_name|lastname)$/i
const FULL_NAME_KEYS = /^(fullname|full_name|volunteername|membername|username|donorname)$/i

type Json = unknown

function walk(value: Json, fn: (key: string, v: Json, parent: Record<string, Json>) => Json): Json {
  if (Array.isArray(value)) return value.map((v) => walk(v, fn))
  if (value && typeof value === "object" && !(value instanceof Date)) {
    const out: Record<string, Json> = {}
    for (const [k, v] of Object.entries(value as Record<string, Json>)) {
      out[k] = fn(k, walk(v, fn), value as Record<string, Json>)
    }
    return out
  }
  return value
}

export function initials(full: string): string {
  const parts = full.trim().split(/\s+/).filter(Boolean)
  if (parts.length <= 1) return parts[0] ?? ""
  return `${parts[0]} ${parts[parts.length - 1][0]}.`
}

/** Remove donor contact details unless the role may see them. */
export function redactDonorContact<T>(data: T, role: Role | null): T {
  if (can(role, "donors:view_contact")) return data
  return walk(data, (k, v) => (DONOR_CONTACT_KEYS.test(k) ? null : v)) as T
}

/** Donor names hidden unless the role may see donor profiles. */
export function redactDonorIdentity<T>(data: T, role: Role | null): T {
  if (can(role, "donors:view_profile")) return redactDonorContact(data, role)
  return walk(redactDonorContact(data, role), (k, v) =>
    /^donorname$/i.test(k) && typeof v === "string" && v !== "Anonymous" ? "Supporter" : v
  ) as T
}

/** Volunteer-style anonymised view: first name + last initial, no contact data. */
export function anonymizePeople<T>(data: T): T {
  return walk(data, (k, v, parent) => {
    if (PERSON_CONTACT_KEYS.test(k)) return null
    if (LAST_NAME_KEYS.test(k) && typeof v === "string") return v ? `${v[0]}.` : v
    if (FULL_NAME_KEYS.test(k) && typeof v === "string") return initials(v)
    // a bare "name" is only a person's name on person-shaped objects
    if (k === "name" && typeof v === "string" && ("email" in parent || "userId" in parent || "user_id" in parent)) return initials(v)
    return v
  }) as T
}

export type RedactProfile = "donor" | "people"

export function applyProfile<T>(profile: RedactProfile, data: T, role: Role | null, fullAccess: Permission[]): T {
  if (fullAccess.some((p) => can(role, p))) {
    return profile === "donor" ? redactDonorContact(data, role) : data
  }
  return profile === "donor" ? redactDonorIdentity(data, role) : anonymizePeople(data)
}
