import { TRPCError, initTRPC } from "@trpc/server"
import { currentUser } from "@clerk/nextjs/server"
import { db } from "@/db"

const t = initTRPC.create()
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
  const user = await currentUser()

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  const dbUser = await db.user.findFirst({
    where: {
      id: user.emailAddresses[0].emailAddress,
    },
  })

  if (!dbUser) {
    throw new TRPCError({ code: "NOT_FOUND" })
  }

  return opts.next({
    ctx: {
      dbUser,
    },
  })
})

export const router = t.router
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)
