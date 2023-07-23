import type { TaskType } from "@db/schema";
import { z } from "zod";

export type MenuEntry = {
  name: string;
  href: string;
};

export type TaskPriorityEnum = "P1" | "P2" | "P3" | "P4";

export interface TaskRenderType extends TaskType {
  renderId?: string;
}

export const createTaskRequestValidator = z.object({
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
  description: z.string().nullish(),
  isCompleted: z.boolean().optional(),
  isImportant: z.boolean().optional(),
});

export type UpdateTaskRequest = z.infer<typeof updateTaskRequestValidator>;
