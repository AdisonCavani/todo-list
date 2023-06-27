import { TaskPriorityEnum } from "@api/dtos/TaskDto";

type CreateTaskReq = {
  title: string;
  description?: string | null | undefined;
  dueDate?: string | null | undefined;
  priority?: TaskPriorityEnum;
};

export type { CreateTaskReq };
