import type { TaskPriorityEnum } from "@api/dtos/TaskDto";
import { cn } from "./utils";

export const isUrlInternal = (href: string) =>
  href && (href.startsWith("/") || href.startsWith("#"));

export function getPriorityText(priority: TaskPriorityEnum, long?: boolean) {
  const prefix = long ? "Priority " : "P";

  switch (priority) {
    case 1:
      return prefix + 3;
    case 2:
      return prefix + 2;
    case 3:
      return prefix + 1;
    default:
      return "Set priority";
  }
}

export function getPriorityColor(priority: TaskPriorityEnum) {
  switch (priority) {
    case 1:
      return cn("text-blue-400");
    case 2:
      return cn("text-orange-400");
    default:
      return cn("text-red-400");
  }
}
