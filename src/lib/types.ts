import type { TaskType } from "@server/db/schema";

export interface TaskRenderType extends TaskType {
  renderId?: string;
}

export type MenuEntry = {
  name: string;
  href: string;
};
