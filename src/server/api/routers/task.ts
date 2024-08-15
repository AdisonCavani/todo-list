import type { TaskType } from "@lib/types";
import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { tasks } from "@server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { v4 } from "uuid";
import { z } from "zod";

const createRequestSchema = z.object({
  listId: z.string().uuid(),
  title: z.string().min(1),
  dueDate: z.coerce.date().optional().nullable(),
  priority: z.enum(["P1", "P2", "P3", "P4"]),
});

const updateRequestSchema = z.object({
  id: z.string().uuid(),
  listId: z.string().uuid(),
  title: z.string().min(1).optional(),
  dueDate: z.coerce.date().optional().nullable(),
  priority: z.enum(["P1", "P2", "P3", "P4"]).optional(),
  description: z.string().nullish().optional(),
  isCompleted: z.boolean().optional().optional(),
  isImportant: z.boolean().optional().optional(),
});

const [firstKey, ...otherKeys] = typedObjectKeys(updateRequestSchema.shape);

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
        dueDate: entity.dueDate ?? null,
      } as TaskType;
    }),

  get: protectedProcedure
    .input(z.object({ listId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.tasks.findMany({
        columns: {
          updatedAt: false,
        },
        where: (task, { eq }) => eq(task.listId, input.listId),
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        updateMask: z
          .array(z.enum([firstKey!, ...otherKeys]))
          .min(1)
          .refine(
            (properties) => properties.length === new Set(properties).size,
            {
              message: "updateMask has duplicate properties",
            },
          ),
        task: updateRequestSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { updateMask, task } = input;
      const { id, ...writeTask } = task;

      const returningSchema = new Map();

      typedObjectKeys(task).forEach((key) => {
        if (!updateMask.includes(key)) {
          returningSchema.set(key, tasks[key]);
        }
      });

      const res = await ctx.db
        .update(tasks)
        .set(writeTask)
        .where(and(eq(tasks.id, input.task.id)))
        .returning({
          createdAt: tasks.createdAt,
          ...Object.fromEntries(returningSchema),
        });

      const returnData = res.find(() => true);

      if (!returnData) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return {
        ...(returnData as any),
        ...task,
      } satisfies TaskType;
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

function typedObjectKeys<T extends object>(object: T) {
  return Object.keys(object).filter(
    (key) => key !== "id" && key !== "listId",
  ) as (keyof Omit<T, "id" | "listId">)[];
}
