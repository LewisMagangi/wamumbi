import { TRPCError, initTRPC } from "@trpc/server"
import { OpenApiMeta } from 'trpc-to-openapi'
import { currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma";

const t = initTRPC.meta<OpenApiMeta>().create()
const middleware = t.middleware

const isAuth = middleware(async (opts) => {
  const user = await currentUser()

  if (!user || !user.id) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  const dbUser = await prisma.user.findFirst({
    where: {
      email: user.emailAddresses[0].emailAddress,
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
export const procedure = t.procedure
export const publicProcedure = t.procedure
export const privateProcedure = t.procedure.use(isAuth)
