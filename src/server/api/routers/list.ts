import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { lists, type ListType } from "@server/db/schema";
import { and, eq } from "drizzle-orm";
import { v4 } from "uuid";
import { z } from "zod";

const createRequestSchema = z.object({
  name: z.string().min(1),
});

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const entity = {
        ...input,
        id: v4(),
        userId: ctx.session.user.id!,
      };

      await ctx.db.insert(lists).values(entity);

      return {
        ...entity,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ListType;
    }),

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

  update: protectedProcedure
    .input(
      createRequestSchema.extend({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(lists)
        .set(input)
        .where(
          and(eq(lists.id, input.id), eq(lists.userId, ctx.session.user.id!)),
        );

      return {
        ...input,
        userId: ctx.session.user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as ListType;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(lists)
        .where(
          and(eq(lists.id, input.id), eq(lists.userId, ctx.session.user.id!)),
        );
    }),
});
