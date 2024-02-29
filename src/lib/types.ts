import type { TaskType } from "@server/db/schema";
import { z } from "zod";

export type TaskPriorityEnum = "P1" | "P2" | "P3" | "P4";

export interface TaskRenderType extends TaskType {
  renderId?: string;
}

export const createListRequestValidator = z.object({
  name: z.string(),
});

export type CreateListRequest = z.infer<typeof createListRequestValidator>;

export const updateListRequestValidator = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export type UpdateListRequest = z.infer<typeof updateListRequestValidator>;

export const createTaskRequestValidator = z.object({
  listId: z.string().uuid(),
  title: z.string(),
  dueDate: z
    .string()
    .transform((str) => new Date(str))
    .optional()
    .nullable(),
  priority: z.enum(["P1", "P2", "P3", "P4"]),
});

export type CreateTaskRequest = z.infer<typeof createTaskRequestValidator>;

export const updateTaskRequestValidator = createTaskRequestValidator.extend({
  id: z.string().uuid(),
  listId: z.string().uuid(),
  description: z.string().nullish(),
  isCompleted: z.boolean().optional(),
  isImportant: z.boolean().optional(),
});

export type UpdateTaskRequest = z.infer<typeof updateTaskRequestValidator>;
