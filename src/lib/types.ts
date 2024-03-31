import type { TaskType } from "@server/db/schema";

export type TaskPriorityEnum = "P1" | "P2" | "P3" | "P4";

export interface TaskRenderType extends TaskType {
  renderId?: string;
}

export type MenuEntry = {
  name: string;
  href: string;
};
