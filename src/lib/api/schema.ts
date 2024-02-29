import type { ListType, TaskType } from "@server/db/schema";
import type {
  CreateListOptions,
  CreateTaskOptions,
  UpdateListOptions,
  UpdateTaskOptions,
} from "./requests";

export interface EndpointsSchema {
  "/lists": {
    post: (options: CreateListOptions) => Promise<ListType>;
    patch: (options: UpdateListOptions) => Promise<ListType>;
  };
  "/lists/{id}": {
    delete: () => Promise<void>;
  };
  "/tasks": {
    post: (options: CreateTaskOptions) => Promise<TaskType>;
    patch: (options: UpdateTaskOptions) => Promise<TaskType>;
  };
  "/tasks/{id}": {
    delete: () => Promise<void>;
  };
}
