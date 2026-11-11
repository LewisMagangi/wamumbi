#!/usr/bin/env python3
"""One-off: wire RBAC builders into the tRPC routers. Run from web/."""
import re, pathlib, sys

PUB = "publicProcedure"
DONOR_VIEW = 'permissionProcedure("donations:view_all", "donations:view_aggregate").use(redactOutput("donor", []))'
PEOPLE_VIEW = ('permissionProcedure("volunteers:view", "volunteers:view_team", "volunteers:view_anonymized")'
               '.use(scopeToLedTeams(["volunteers:view", "volunteers:view_anonymized"]))'
               '.use(redactOutput("people", ["volunteers:view", "volunteers:view_team"]))')

MAP = {
  "campaigns-router.ts": {
    "getActive": PUB, "getAll": PUB, "getById": PUB, "getCategories": PUB, "getStatuses": PUB,
    "getUrgencyLevels": PUB, "getCurrencies": PUB,
    "create": 'permissionProcedure("campaigns:create")',
    "update": 'permissionProcedure("campaigns:update")',
    "delete": 'permissionProcedure("campaigns:delete")',
  },
  "donations-router.ts": {
    "getRecent": DONOR_VIEW,
    "getAll": 'permissionProcedure("donations:view_all", "donations:view_aggregate", "donations:view_own").use(redactOutput("donor", []))',
    "getById": 'permissionProcedure("donations:view_all", "donations:view_aggregate", "donations:view_own").use(redactOutput("donor", []))',
    "create": "protectedProcedure",
    "update": 'permissionProcedure("donations:manage")',
    "delete": 'permissionProcedure("donations:manage")',
    "createDonor": "protectedProcedure",
    "getPaymentMethods": PUB, "getStatuses": PUB, "getRecurringFrequencies": PUB, "getCurrencies": PUB,
  },
  "dashboard-router.ts": {
    "getStats": 'permissionProcedure("dashboard:view")',
    "getRecentDonations": 'permissionProcedure("donations:view_all", "donations:view_aggregate").use(redactOutput("donor", []))',
    "getUpcomingEvents": PUB,
    "getActiveCampaigns": PUB,
    "getActiveProjects": 'permissionProcedure("dashboard:view")',
    "getRecentBlogPosts": PUB,
    "getNotifications": "protectedProcedure",
    "getMonthlyDonationTrend": 'permissionProcedure("reports:view_financial", "donations:view_aggregate")',
    "getCampaignPerformance": 'permissionProcedure("reports:view_financial", "donations:view_aggregate")',
  },
  "events-router.ts": {
    "getUpcoming": PUB, "getAll": PUB, "getById": PUB, "getCategories": PUB, "getStatuses": PUB,
    "create": 'permissionProcedure("events:create")',
    "update": 'permissionProcedure("events:update")',
    "delete": 'permissionProcedure("events:delete")',
    "register": "protectedProcedure",
    "cancelRegistration": "protectedProcedure",
  },
  "teams-router.ts": {
    "getAll": 'permissionProcedure("teams:view")',
    "getOverview": 'permissionProcedure("teams:view")',
    "getById": 'permissionProcedure("teams:view")',
    "getCategories": PUB,
    "create": 'permissionProcedure("teams:manage")',
    "delete": 'permissionProcedure("teams:manage")',
    "update": 'permissionProcedure("teams:manage", "teams:manage_own")',
    "addMember": 'permissionProcedure("teams:manage", "teams:manage_own")',
    "removeMember": 'permissionProcedure("teams:manage", "teams:manage_own")',
    "updateMember": 'permissionProcedure("teams:manage", "teams:manage_own")',
  },
  "volunteers-router.ts": {
    "getAll": PEOPLE_VIEW, "getById": PEOPLE_VIEW,
    "create": 'permissionProcedure("volunteers:manage")',
    "createWithUser": 'permissionProcedure("volunteers:manage")',
    "update": 'permissionProcedure("volunteers:manage")',
    "delete": 'permissionProcedure("volunteers:manage")',
    "logActivity": 'permissionProcedure("volunteers:manage", "volunteers:coordinate")',
    "getSkills": PUB, "getStatuses": PUB,
  },
  "blog-posts-router.ts": {
    "getAll": 'permissionProcedure("blog:create", "blog:update", "blog:publish")',
    "getPublished": PUB, "getById": PUB, "getCategories": PUB, "getStatuses": PUB,
    "create": 'permissionProcedure("blog:create")',
    "update": 'permissionProcedure("blog:update")',
    "delete": 'permissionProcedure("blog:delete")',
  },
  "partnership-router.ts": {"submitInquiry": PUB},
}

# exact handler edits: (file, old, new)
EDITS = [
  # --- approval workflow on create/update ---
  ("campaigns-router.ts", "status_id: activeStatus?.id || 1,", 'status_id: await reviewStatus("campaign", activeStatus?.id || 1, ctx.user),'),
  ("campaigns-router.ts", "created_by: input.createdBy", "created_by: ctx.user.id"),
  ("campaigns-router.ts", "if (statusId !== undefined) dataToUpdate.status_id = statusId;", 'if (statusId !== undefined) dataToUpdate.status_id = await reviewStatus("campaign", statusId, ctx.user);'),
  ("events-router.ts", "status_id: scheduledStatus?.id || 1,", 'status_id: await reviewStatus("event", scheduledStatus?.id || 1, ctx.user),'),
  ("events-router.ts", "created_by: input.createdBy", "created_by: ctx.user.id"),
  ("events-router.ts", "if (statusId !== undefined) dataToUpdate.status_id = statusId;", 'if (statusId !== undefined) dataToUpdate.status_id = await reviewStatus("event", statusId, ctx.user);'),
  ("blog-posts-router.ts", "status_id: statusId,", 'status_id: await reviewStatus("blog", statusId, ctx.user),'),
  ("blog-posts-router.ts", "author_id: input.authorId,", "author_id: ctx.user.id,"),
  ("blog-posts-router.ts", "if (statusId) dataToUpdate.status_id = statusId;", 'if (statusId) dataToUpdate.status_id = await reviewStatus("blog", statusId, ctx.user);'),
  # --- donors only see their own donations ---
  ("donations-router.ts@getAll", "      const donations = await prisma.donation.findMany({\n        include: {\n          donor: {\n            select: {\n              first_name: true,",
   "      const ownOnly = !canAny(ctx.user.role, [\"donations:view_all\", \"donations:view_aggregate\"]);\n      const donations = await prisma.donation.findMany({\n        where: ownOnly ? { donor: { user_id: ctx.user.id } } : undefined,\n        include: {\n          donor: {\n            select: {\n              first_name: true,"),
  ("donations-router.ts@getById", "      if (!donation) {\n        throw new Error('Donation not found');\n      }",
   "      if (!donation) {\n        throw new Error('Donation not found');\n      }\n\n      if (!canAny(ctx.user.role, [\"donations:view_all\", \"donations:view_aggregate\"]) && donation.donor?.user_id !== ctx.user.id) {\n        throw new TRPCError({ code: 'FORBIDDEN' });\n      }"),
]

# handlers that need ctx: (file, proc) -> make the first `async ({ input })` / `async ()` after `  proc:` take ctx
NEED_CTX = [
  ("campaigns-router.ts", "create"), ("campaigns-router.ts", "update"),
  ("events-router.ts", "create"), ("events-router.ts", "update"),
  ("blog-posts-router.ts", "create"), ("blog-posts-router.ts", "update"),
  ("donations-router.ts", "getAll"), ("donations-router.ts", "getById"),
  ("teams-router.ts", "update"), ("teams-router.ts", "addMember"), ("teams-router.ts", "removeMember"), ("teams-router.ts", "updateMember"),
]

TEAM_GUARD = {  # proc -> expression giving the team id
  "update": "input.id",
  "addMember": "input.teamId",
  "removeMember": "input.teamId",
}

def proc_span(src, proc):
    m = re.search(rf"^  {proc}: ", src, re.M)
    if not m: raise SystemExit(f"proc {proc} not found")
    nxt = re.search(r"^  [a-zA-Z]+: ", src[m.end():], re.M)
    end = m.end() + nxt.start() if nxt else len(src)
    return m.start(), end

def main():
    base = pathlib.Path("src/trpc")
    only = sys.argv[1:]
    for fname, procs in MAP.items():
        if only and fname not in only: continue
        p = base / fname
        src = p.read_text(encoding="utf-8")
        for proc, builder in procs.items():
            s, e = proc_span(src, proc)
            block = src[s:e]
            new_block, n = re.subn(rf"^  {proc}: (procedure|publicProcedure)\b", f"  {proc}: {builder}", block, count=1, flags=re.M)
            if n != 1: raise SystemExit(f"{fname}:{proc} builder not replaced")
            src = src[:s] + new_block + src[e:]
        for f, proc in NEED_CTX:
            if f != fname: continue
            s, e = proc_span(src, proc)
            block = src[s:e]
            new_block, n = re.subn(r"\.(query|mutation)\(async \(\{ input \}\) =>", r".\1(async ({ input, ctx }) =>", block, count=1)
            if n == 0:
                new_block, n = re.subn(r"\.(query|mutation)\(async \(\) =>", r".\1(async ({ ctx }) =>", block, count=1)
            if n != 1: raise SystemExit(f"{fname}:{proc} ctx not added")
            if fname == "teams-router.ts" and proc in TEAM_GUARD:
                new_block = re.sub(r"(\.mutation\(async \(\{ input, ctx \}\) => \{\n)", rf"\1      await assertTeamAccess(ctx.user, {TEAM_GUARD[proc]});\n", new_block, count=1)
            src = src[:s] + new_block + src[e:]
        for f, old, new in EDITS:
            fn, _, scope = f.partition("@")
            if fn != fname: continue
            s, e = proc_span(src, scope) if scope else (0, len(src))
            block = src[s:e]
            if block.count(old) != 1: raise SystemExit(f"{fname}: edit target found {block.count(old)} times: {old[:60]}")
            src = src[:s] + block.replace(old, new) + src[e:]
        # imports
        used = [b for b in ["publicProcedure", "protectedProcedure", "permissionProcedure", "redactOutput", "scopeToLedTeams"] if re.search(rf"\b{b}\b", src)]
        src, n = re.subn(r'import \{[^}]*\} from "\./trpc";?', f'import {{ {", ".join(used + ["router"])} }} from "./trpc";', src, count=1)
        if n != 1: raise SystemExit(f"{fname}: trpc import not found")
        extra = []
        if "reviewStatus(" in src or "assertTeamAccess(" in src:
            names = [x for x in ["reviewStatus", "assertTeamAccess"] if x + "(" in src]
            extra.append(f'import {{ {", ".join(names)} }} from "@/server/review";')
        if "canAny(" in src: extra.append('import { canAny } from "@/lib/rbac/permissions";')
        if "TRPCError" in src and "import { TRPCError" not in src: extra.append('import { TRPCError } from "@trpc/server";')
        if extra:
            src = src.replace(f'from "./trpc";', 'from "./trpc";\n' + "\n".join(extra), 1)
        if re.search(r"^  [a-zA-Z]+: procedure\b", src, re.M):
            raise SystemExit(f"{fname}: unguarded procedure left")
        p.write_text(src, encoding="utf-8")
        print("ok", fname)

if __name__ == "__main__":
    main()
