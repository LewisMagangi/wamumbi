import { router } from "./trpc"

import { authRouter } from "./auth-router"
import { dashboardRouter } from "./dashboard-router"
import { campaignsRouter } from "./campaigns-router"
import { donationsRouter } from "./donations-router"
import { teamsRouter } from "./teams-router"
import { eventsRouter } from "./events-router"
import { volunteersRouter } from "./volunteers-router"
import { blogPostsRouter } from "./blog-posts-router"
import { partnershipRouter } from "./partnership-router"

export const appRouter = router({
  auth: authRouter,
  dashboard: dashboardRouter,
  campaigns: campaignsRouter,
  donations: donationsRouter,
  teams: teamsRouter,
  events: eventsRouter,
  volunteers: volunteersRouter,
  blogPosts: blogPostsRouter,
  partnership: partnershipRouter,
})

export type AppRouter = typeof appRouter
