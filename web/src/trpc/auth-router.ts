import { db } from "@/db"
import { currentUser } from "@clerk/nextjs/server"
import { TRPCError } from "@trpc/server"
import { publicProcedure, router } from "./trpc"

export const authRouter = router({
  authCallback: publicProcedure.mutation(async () => {
    const user = await currentUser()

    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })

    // check if the user is in the database
    const dbUser = await db.user.findUnique({
      where: {
        id: user.id,
      },
    })

    if (!dbUser) {
      // create user in db
      const newUser = await db.user.create({
        data: {
          clerkId: user.id,
          email:
            user.primaryEmailAddress?.emailAddress ??
            user.emailAddresses[0].emailAddress,
          name: user.fullName,
          imageUrl: user.imageUrl,
        },
      })

      return { user: newUser }
    } else {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          email:
            user.primaryEmailAddress?.emailAddress ??
            user.emailAddresses[0].emailAddress,
          name: user.fullName,
          imageUrl: user.imageUrl,
        },
      })

      return { user: dbUser }
    }
  }),
})
