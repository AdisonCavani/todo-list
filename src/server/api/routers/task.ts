import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { tasks } from "@server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const taskRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ listId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.tasks.findMany({
        where: (task, { eq }) => eq(task.listId, input.listId),
      });
    }),

  // TODO: make sure the userId is the same
  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.delete(tasks).where(and(eq(tasks.id, input.id)));
    }),
});
