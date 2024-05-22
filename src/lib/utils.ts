import type { TaskPriorityEnum } from "@server/db/schema";
import { clsx, type ClassValue } from "clsx";
import { Inter } from "next/font/google";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const isUrlInternal = (href: string) =>
  href && (href.startsWith("/") || href.startsWith("#"));

export const fontInter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export function getPriorityText(priority: TaskPriorityEnum, long?: boolean) {
  const prefix = long ? "Priority " : "P";

  switch (priority) {
    case "P1":
      return prefix + 1;
    case "P2":
      return prefix + 2;
    case "P3":
      return prefix + 3;
    default:
      return "Priority";
  }
}

export function getPriorityColor(priority: TaskPriorityEnum) {
  switch (priority) {
    case "P3":
      return cn("text-blue-500");
    case "P2":
      return cn("text-orange-400");
    case "P1":
      return cn("text-red-500");
    default:
      throw new Error("Out of range");
  }
}

export function addDays(date: Date, days: number): Date {
  if (!days) return date;

  date.setDate(date.getDate() + days);

  return date;
}

export function getShortDayName(date: Date): string {
  return Intl.DateTimeFormat("en-US", {
    weekday: "short",
  }).format(date);
}
