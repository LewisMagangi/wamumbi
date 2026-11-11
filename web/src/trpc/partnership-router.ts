import { z } from "zod";
import { publicProcedure, router } from "./trpc";
import { partnershipInquiry, savePartnership } from "./inquiries-router";

// Kept for existing callers and the OpenAPI docs. Previously this only logged the
// inquiry; it now saves it (Dashboard → Manage → Inbox) and emails the team when configured.
export const partnershipRouter = router({
  submitInquiry: publicProcedure
    .meta({
      openapi: {
        method: 'POST',
        path: '/partnership',
        tags: ['partnership'],
        summary: 'Submit partnership inquiry',
        description: 'Saves a partnership inquiry from the website form and notifies the team',
      },
    })
    .input(partnershipInquiry)
    .output(z.object({ success: z.boolean(), message: z.string() }))
    .mutation(({ input }) => savePartnership(input)),
});
