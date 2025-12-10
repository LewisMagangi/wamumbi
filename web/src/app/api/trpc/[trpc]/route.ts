import { appRouter } from "@/trpc"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"

// Force dynamic rendering to avoid build-time database connections
export const dynamic = 'force-dynamic'

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  })

export { handler as GET, handler as POST }
