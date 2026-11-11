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
import { adminRouter } from "./admin-router"
import { mediaRouter } from "./media-router"
import { inquiriesRouter } from "./inquiries-router"
import { projectsRouter } from "./projects-router"
import { notificationsRouter } from "./notifications-router"

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
  admin: adminRouter,
  media: mediaRouter,
  inquiries: inquiriesRouter,
  projects: projectsRouter,
  notifications: notificationsRouter,
})

export type AppRouter = typeof appRouter
