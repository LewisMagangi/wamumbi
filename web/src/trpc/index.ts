import { router } from "./trpc"

import { authRouter } from "./auth-router"

export const appRouter = router({
  auth: authRouter,
})

export type AppRouter = typeof appRouter
