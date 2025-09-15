import { router } from "./trpc"

import { authRouter } from "./auth-router"
import { dashboardRouter } from "./dashboard-router"
import { campaignsRouter } from "./campaigns-router"
import { donationsRouter } from "./donations-router"
import { teamsRouter } from "./teams-router"

export const appRouter = router({
  auth: authRouter,
  dashboard: dashboardRouter,
  campaigns: campaignsRouter,
  donations: donationsRouter,
  teams: teamsRouter,
})

export type AppRouter = typeof appRouter
