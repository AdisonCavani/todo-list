import type { TaskDto } from "@api/dtos/TaskDto";

function sortTasksByTitle(a: TaskDto, b: TaskDto): number {
  return a.title.localeCompare(b.title);
}

function sortTasksByDueDate(a: TaskDto, b: TaskDto): number {
  // No due date - sort by updatedAt
  if (!a.dueDate && !b.dueDate)
    return Date.parse(a.updatedAt) - Date.parse(b.updatedAt);

  // A has dueDate, but B does not
  if (a.dueDate && !b.dueDate) return -1;

  // A does not have dueDate, but B does
  if (!a.dueDate && b.dueDate) return 1;

  // Both have due date
  const aDate = Date.parse(a.dueDate!);
  const bDate = Date.parse(b.dueDate!);

  return aDate - bDate;
}

function sortTasksByImportance(a: TaskDto, b: TaskDto): number {
  // Priority
  if (a.priority > b.priority) return 1;

  if (b.priority > a.priority) return -1;

  // Importance
  if (a.isImportant && !b.isImportant) return 1;

  if (!a.isImportant && b.isImportant) return -1;

  return sortTasksByDueDate(b, a);
}

function sortTasksByCreationDate(a: TaskDto, b: TaskDto): number {
  return Date.parse(a.updatedAt) - Date.parse(b.updatedAt);
}

export const sortMethods = {
  sortTasksByTitle,
  sortTasksByDueDate,
  sortTasksByImportance,
  sortTasksByCreationDate,
};

export const sortMethodsNames = {
  sortTasksByTitle: "alphabetically",
  sortTasksByDueDate: "by due date",
  sortTasksByImportance: "by importance",
  sortTasksByCreationDate: "by creation date",
};

type SortMethodsTypes = keyof typeof sortMethods;
export type SortingOptions = {
  fn: SortMethodsTypes;
  order: "asc" | "desc";
};
