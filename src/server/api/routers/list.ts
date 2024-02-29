import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { lists, tasks } from "@server/db/schema";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const listRouter = createTRPCRouter({
  get: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.lists.findMany({
      where: (list, { eq }) => eq(list.userId, ctx.session.user.id!),
    });
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.lists.findFirst({
        where: (list, { and, eq }) =>
          and(eq(list.id, input.id), eq(list.userId, ctx.session.user.id!)),
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await Promise.all([
        ctx.db
          .delete(lists)
          .where(
            and(eq(lists.id, input.id), eq(lists.userId, ctx.session.user.id!)),
          ),

        ctx.db.delete(tasks).where(eq(tasks.listId, input.id)),
      ]);
    }),
});
