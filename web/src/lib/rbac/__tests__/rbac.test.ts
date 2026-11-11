import { describe, expect, it } from "vitest"
import { ROLES, normalizeRole, type Role } from "../roles"
import { PERMISSIONS, ROLE_PERMISSIONS, can, type Permission } from "../permissions"
import { anonymizePeople, redactDonorContact, redactDonorIdentity } from "../redact"

/**
 * The expected matrix, written out by hand from the brief so a change to
 * permissions.ts that drifts from the agreed rules fails loudly.
 */
const EXPECT: Record<Role, Permission[]> = {
  super_admin: [...PERMISSIONS],
  campaign_manager: ["dashboard:view", "campaigns:create", "campaigns:update", "campaigns:delete", "donors:view_profile", "donations:view_aggregate", "donations:view_own", "media:upload"],
  event_coordinator: ["dashboard:view", "events:create", "events:update", "events:delete", "registrations:manage", "volunteers:view", "volunteers:coordinate", "teams:view", "donations:view_own", "media:upload"],
  volunteer_coordinator: ["dashboard:view", "volunteers:view", "volunteers:manage", "volunteers:coordinate", "teams:view", "teams:manage", "donations:view_own", "media:upload"],
  content_manager: ["dashboard:view", "blog:create", "blog:update", "blog:delete", "media:upload", "media:moderate", "donations:view_own"],
  finance_manager: ["dashboard:view", "donors:view_profile", "donors:view_contact", "donations:view_all", "donations:view_aggregate", "donations:view_own", "donations:manage", "reports:view_financial", "reports:export"],
  team_leader: ["dashboard:view", "teams:view", "teams:manage_own", "volunteers:view_team", "registrations:manage_team", "donations:view_own", "media:upload"],
  volunteer: ["dashboard:view", "volunteers:view_anonymized", "teams:view", "donations:view_own", "media:upload_restricted"],
  donor: ["donations:view_own"],
}

describe("permission matrix", () => {
  for (const role of ROLES) {
    for (const p of PERMISSIONS) {
      const expected = EXPECT[role].includes(p)
      it(`${role} ${expected ? "can" : "cannot"} ${p}`, () => {
        expect(can(role, p)).toBe(expected)
      })
    }
  }

  it("has no unknown permissions in any role", () => {
    for (const role of ROLES) for (const p of ROLE_PERMISSIONS[role]) expect(PERMISSIONS).toContain(p)
  })
})

describe("brief rules", () => {
  it("only Super Admin approves content", () => {
    for (const role of ROLES) {
      const approves = can(role, "campaigns:publish") || can(role, "events:publish") || can(role, "blog:publish")
      expect(approves).toBe(role === "super_admin")
    }
  })
  it("campaign manager sees donor info but not contact", () => {
    expect(can("campaign_manager", "donors:view_profile")).toBe(true)
    expect(can("campaign_manager", "donors:view_contact")).toBe(false)
  })
  it("volunteer coordinator has no financial access", () => {
    for (const p of ["donations:view_all", "donations:view_aggregate", "donations:manage", "reports:view_financial", "donors:view_profile"] as Permission[]) {
      expect(can("volunteer_coordinator", p)).toBe(false)
    }
  })
  it("finance manager cannot create campaigns", () => {
    expect(can("finance_manager", "campaigns:create")).toBe(false)
  })
  it("volunteer uploads are restricted", () => {
    expect(can("volunteer", "media:upload")).toBe(false)
    expect(can("volunteer", "media:upload_restricted")).toBe(true)
  })
  it("donor only sees own donations", () => {
    expect(ROLE_PERMISSIONS.donor).toEqual(["donations:view_own"])
  })
})

describe("legacy role names", () => {
  it("maps old roles", () => {
    expect(normalizeRole("admin")).toBe("super_admin")
    expect(normalizeRole("staff")).toBe("volunteer_coordinator")
    expect(normalizeRole("Volunteer")).toBe("volunteer")
    expect(normalizeRole(null)).toBe("donor")
    expect(normalizeRole("something-else")).toBe("donor")
  })
})

describe("redaction", () => {
  const donation = [{ id: 1, donorName: "Jane Wanjiru", donorEmail: "jane@example.com", amount: 500, donor: { email: "jane@example.com", phone: "0700", first_name: "Jane" } }]

  it("strips donor contact for campaign managers but keeps names", () => {
    const out = redactDonorIdentity(donation, "campaign_manager") as typeof donation
    expect(out[0].donorName).toBe("Jane Wanjiru")
    expect(out[0].donorEmail).toBeNull()
    expect(out[0].donor.email).toBeNull()
    expect(out[0].donor.phone).toBeNull()
    expect(out[0].amount).toBe(500)
  })

  it("keeps everything for finance managers", () => {
    const out = redactDonorContact(donation, "finance_manager") as typeof donation
    expect(out[0].donorEmail).toBe("jane@example.com")
  })

  it("hides donor names from roles without donor profile access", () => {
    const out = redactDonorIdentity(donation, "volunteer") as typeof donation
    expect(out[0].donorName).toBe("Supporter")
    expect(out[0].donorEmail).toBeNull()
  })

  it("anonymises people for volunteers", () => {
    const vols = [{ id: 2, userId: 9, name: "Peter Kamau Otieno", email: "p@example.com", phone: "0711", status: "active", skills: ["First aid"] }]
    const out = anonymizePeople(vols) as typeof vols
    expect(out[0].name).toBe("Peter O.")
    expect(out[0].email).toBeNull()
    expect(out[0].phone).toBeNull()
    expect(out[0].status).toBe("active")
    expect(out[0].skills).toEqual(["First aid"])
  })

  it("does not touch non-person names", () => {
    const campaign = { id: 1, name: "School fees drive", status: { name: "active" } }
    expect(anonymizePeople(campaign)).toEqual(campaign)
  })

  it("keeps dates intact", () => {
    const d = new Date("2024-01-01")
    const out = anonymizePeople([{ userId: 1, name: "A B", joinedAt: d }]) as Array<{ joinedAt: Date }>
    expect(out[0].joinedAt).toBe(d)
  })
})
