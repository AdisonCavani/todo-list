import { TaskPriorityEnum } from "@api/dtos/TaskDto";

type UpdateTaskReq = {
  id: string;
  title: string;
  description?: string | null | undefined;
  dueDate?: string | null | undefined;
  isCompleted?: boolean | undefined;
  isImportant?: boolean | undefined;
  priority?: TaskPriorityEnum;
};

export type { UpdateTaskReq };
