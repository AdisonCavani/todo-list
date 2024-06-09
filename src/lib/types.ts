import type { ListDbType, TaskDbType } from "@server/db/schema";

export type ListType = Omit<ListDbType, "updatedAt">;
export type ListWithCountType = Omit<ListType, "createdAt"> & { count: number };
export type TaskType = Omit<TaskDbType, "updatedAt">;

export interface TaskRenderType extends TaskType {
  renderId?: string;
}

export type MenuEntry = {
  name: string;
  href: string;
};
