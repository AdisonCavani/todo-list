import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { z } from "zod";

export const taskRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ listId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.tasks.findMany({
        where: (task, { eq }) => eq(task.listId, input.listId),
      });
    }),
});
