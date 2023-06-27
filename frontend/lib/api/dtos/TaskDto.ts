type TaskDto = {
  id: string;
  userId: string;
  updatedAt: string;
  title: string;
  isCompleted: boolean;
  isImportant: boolean;
  description?: string | null | undefined;
  dueDate?: string | null | undefined;
  priority: TaskPriorityEnum;
};

type TaskPriorityEnum = 0 | 1 | 2 | 3;

export type { TaskDto, TaskPriorityEnum };
