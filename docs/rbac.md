# Role-based access control (RBAC)

Source of truth: `web/src/lib/rbac/permissions.ts`. Tests: `web/src/lib/rbac/__tests__/rbac.test.ts` (run `npm test`).

## How it works

- **Server first.** Every tRPC procedure is `publicProcedure`, `protectedProcedure` (signed in) or `permissionProcedure(...)` (signed in and holding one of the listed permissions). UI gates (`<PermissionGate>`) only hide controls; the API enforces the same rules.
- **Response shaping.** `redactOutput("donor")` strips donor email/phone/address unless the caller has `donors:view_contact`, and hides donor names without `donors:view_profile`. `redactOutput("people")` gives volunteers an anonymised view (first name + last initial, no contact data).
- **Scope.** Team leaders only see and change their own teams (`scopeToLedTeams`, `assertTeamAccess`). Donors only see their own donations.
- **Approval workflow.** Content created by non-admins is saved as `pending_review`. A Super Admin approves it in **Dashboard → Admin → Approvals**.
- **Audit.** Role changes, approvals and photo moderation write to `audit_logs`.

## First Super Admin

Set `SUPER_ADMIN_EMAILS=you@example.com` (comma separated) in Vercel and `.env.local`. That account becomes Super Admin on its next sign-in. Assign everyone else in **Dashboard → Admin → Users & roles**. New sign-ups start as **Donor**.

## Matrix

| Permission | Super Admin | Campaign Mgr | Event Coord | Volunteer Coord | Content Mgr | Finance Mgr | Team Leader | Volunteer | Donor |
|---|---|---|---|---|---|---|---|---|---|
| campaigns: create / update / delete | ✓ | ✓ | | | | | | | |
| campaigns / events / blog: publish | ✓ | | | | | | | | |
| donors: view profile | ✓ | ✓ | | | | ✓ | | | |
| donors: view contact | ✓ | | | | | ✓ | | | |
| donations: view all | ✓ | | | | | ✓ | | | |
| donations: view aggregate | ✓ | ✓ | | | | ✓ | | | |
| donations: view own | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| donations: manage | ✓ | | | | | ✓ | | | |
| reports: financial + export | ✓ | | | | | ✓ | | | |
| events: create / update / delete | ✓ | | ✓ | | | | | | |
| registrations: manage | ✓ | | ✓ | | | | team | | |
| volunteers: view | ✓ | | ✓ | ✓ | | | team | anonymised | |
| volunteers: manage | ✓ | | | ✓ | | | | | |
| volunteers: coordinate | ✓ | | ✓ | ✓ | | | | | |
| teams: view | ✓ | | ✓ | ✓ | | | ✓ | ✓ | |
| teams: manage | ✓ | | | ✓ | | | own team | | |
| blog: create / update / delete | ✓ | | | | ✓ | | | | |
| media: upload | ✓ | ✓ | ✓ | ✓ | ✓ | | ✓ | limited* | |
| media: moderate | ✓ | | | | ✓ | | | | |
| users & roles, audit log | ✓ | | | | | | | | |

\* Volunteers: photos only, max 10 MB, 10 per day, always reviewed before publishing.

## Photo uploads

Uploads go to Vercel Blob. Add a Blob store to the Vercel project (Storage → Blob); it sets `BLOB_READ_WRITE_TOKEN`. Pull it locally with `vercel env pull`.
