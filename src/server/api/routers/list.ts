import type { ListType } from "@lib/types";
import { createTRPCRouter, protectedProcedure } from "@server/api/trpc";
import { lists, tasks } from "@server/db/schema";
import { TRPCError } from "@trpc/server";
import { and, eq, sql } from "drizzle-orm";
import { v4 } from "uuid";
import { z } from "zod";

const createRequestSchema = z.object({
  name: z.string().min(1),
});

const updateRequestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).optional(),
});

const [firstKey, ...otherKeys] = typedObjectKeys(updateRequestSchema.shape);

export const listRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createRequestSchema)
    .mutation(async ({ ctx, input }) => {
      const entity = {
        ...input,
        id: v4(),
        userId: ctx.session.user.id!,
      };

      const res = await ctx.db.insert(lists).values(entity).returning({
        createdAt: lists.createdAt,
      });

      const returnData = res.find(() => true);

      if (!returnData) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      return {
        ...entity,
        createdAt: returnData.createdAt,
      } satisfies ListType;
    }),

  get: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({
        id: lists.id,
        userId: lists.userId,
        name: lists.name,
        count: sql<number>`
        (SELECT COUNT(*)
         FROM ${tasks}
         WHERE ${tasks.listId} = ${lists.id} AND ${tasks.isCompleted} = FALSE)
      `,
      })
      .from(lists)
      .where((obj) => eq(obj.userId, ctx.session.user.id!))
      .groupBy(lists.id)
      .innerJoin(tasks, eq(lists.id, tasks.listId));
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.lists.findFirst({
        columns: {
          updatedAt: false,
        },
        where: (list, { and, eq }) =>
          and(eq(list.id, input.id), eq(list.userId, ctx.session.user.id!)),
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
        list: updateRequestSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { updateMask, list } = input;
      const { id, ...writeList } = list;

      const returningSchema = new Map();

      typedObjectKeys(list).forEach((key) => {
        if (!updateMask.includes(key)) {
          returningSchema.set(key, lists[key]);
        }
      });

      const res = await ctx.db
        .update(lists)
        .set(writeList)
        .where(
          and(eq(lists.id, list.id), eq(lists.userId, ctx.session.user.id!)),
        )
        .returning({
          createdAt: lists.createdAt,
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
        ...list,
        userId: ctx.session.user.id,
      } satisfies ListType;
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

function typedObjectKeys<T extends object>(object: T) {
  return Object.keys(object).filter((key) => key !== "id") as (keyof Omit<
    T,
    "id"
  >)[];
}
