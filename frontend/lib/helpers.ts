import { cn } from "./utils";

export const isUrlInternal = (href: string) =>
  href && (href.startsWith("/") || href.startsWith("#"));

export function getPriorityColor(priority: "P4" | "P3" | "P2" | "P1") {
  switch (priority) {
    case "P1":
      return cn("text-red-500");
    case "P2":
      return cn("text-orange-400");
    default:
      return cn("text-blue-500");
  }
}
