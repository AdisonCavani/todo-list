import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
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
});
