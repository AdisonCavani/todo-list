import type { TaskType } from "@db/schema";

function sortTasksByTitle(a: TaskType, b: TaskType): number {
  return a.title.localeCompare(b.title);
}

function sortTasksByDueDate(a: TaskType, b: TaskType): number {
  // No due date - sort by createdAt
  if (!a.dueDate && !b.dueDate) return sortTasksByCreationDate(a, b);

  // A has dueDate, but B does not
  if (a.dueDate && !b.dueDate) return -1;

  // A does not have dueDate, but B does
  if (!a.dueDate && b.dueDate) return 1;

  // Both have due date
  return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
}

function sortTasksByImportance(a: TaskType, b: TaskType): number {
  // Priority
  if (a.priority > b.priority) return -1;

  if (b.priority > a.priority) return 1;

  // Importance
  if (a.isImportant && !b.isImportant) return 1;

  if (!a.isImportant && b.isImportant) return -1;

  return sortTasksByDueDate(b, a);
}

function sortTasksByCreationDate(a: TaskType, b: TaskType): number {
  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
}

export const sortMethods = {
  sortTasksByTitle,
  sortTasksByDueDate,
  sortTasksByImportance,
  sortTasksByCreationDate,
};

type SortMethodsTypes = keyof typeof sortMethods;
export type SortingOptions = {
  fn: SortMethodsTypes;
  order: "asc" | "desc";
};
