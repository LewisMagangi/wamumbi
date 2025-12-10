import { currentUser } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { publicProcedure, router } from "./trpc"

export const authRouter = router({
  authCallback: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/auth/callback',
        tags: ['auth'],
        summary: 'Authentication callback',
        description: 'Validates Clerk authentication and returns current user data'
      }
    })
    .input(z.void())
    .output(z.object({
      user: z.object({
        id: z.string(),
        email: z.string(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        imageUrl: z.string().nullable(),
        fullName: z.string().nullable()
      })
    }))
    .mutation(async () => {
      const user = await currentUser()

      if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })

      const email = user.primaryEmailAddress?.emailAddress ?? 
                    user.emailAddresses[0]?.emailAddress ?? '';

      return {
        user: {
          id: user.id,
          email,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          fullName: user.fullName
        }
      }
    }),

  // Get current authenticated user
  getUser: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/auth/user',
        tags: ['auth'],
        summary: 'Get current user',
        description: 'Returns the currently authenticated Clerk user'
      }
    })
    .input(z.void())
    .output(z.object({
      user: z.object({
        id: z.string(),
        email: z.string(),
        firstName: z.string().nullable(),
        lastName: z.string().nullable(),
        imageUrl: z.string().nullable(),
        fullName: z.string().nullable()
      }).nullable()
    }))
    .query(async () => {
      const user = await currentUser()

      if (!user) {
        return { user: null }
      }

      const email = user.primaryEmailAddress?.emailAddress ?? 
                    user.emailAddresses[0]?.emailAddress ?? '';

      return {
        user: {
          id: user.id,
          email,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          fullName: user.fullName
        }
      }
    }),
})
