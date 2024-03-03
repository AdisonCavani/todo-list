import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { tasks, type TaskType } from "@server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { v4 } from "uuid";
import { z } from "zod";

const createRequestSchema = z.object({
  listId: z.string().uuid(),
  title: z.string(),
  dueDate: z.date().optional().nullable(),
  priority: z.enum(["P1", "P2", "P3", "P4"]),
});

export const taskRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const listExists = await ctx.db.query.lists.findFirst({
        where: (list, { and, eq }) =>
          and(eq(list.id, input.listId), eq(list.userId, ctx.session.user.id!)),
      });

      if (!listExists)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      const entity = {
        ...input,
        id: v4(),
        isCompleted: false,
        isImportant: false,
      };

      await ctx.db.insert(tasks).values(entity);

      return {
        ...entity,
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate: entity.dueDate ?? null,
      } as TaskType;
    }),

  get: protectedProcedure
    .input(z.object({ listId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.tasks.findMany({
        where: (task, { eq }) => eq(task.listId, input.listId),
      });
    }),

  update: protectedProcedure
    .input(
      createRequestSchema.extend({
        id: z.string().uuid(),
        listId: z.string().uuid(),
        description: z.string().nullish(),
        isCompleted: z.boolean().optional(),
        isImportant: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(tasks)
        .set(input)
        .where(and(eq(tasks.id, input.id)));

      return {
        ...input,
        description: input.description ?? null,
        dueDate: input.dueDate ?? null,
        isCompleted: input.isCompleted ?? false,
        isImportant: input.isImportant ?? false,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as TaskType;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.db.query.tasks.findFirst({
        where: (task, { eq }) => eq(task.id, input.id),
      });

      if (!task)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      const list = await ctx.db.query.lists.findFirst({
        where: (list, { and, eq }) =>
          and(eq(list.id, task.listId), eq(list.userId, ctx.session.user.id!)),
      });

      if (!list)
        throw new TRPCError({
          code: "NOT_FOUND",
        });

      await ctx.db.delete(tasks).where(and(eq(tasks.id, input.id)));
    }),
});
