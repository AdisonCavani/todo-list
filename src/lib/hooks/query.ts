import { client } from "@api/client";
import { useToast } from "@lib/hooks/use-toast";
import type {
  CreateListRequest,
  CreateTaskRequest,
  TaskRenderType,
  UpdateTaskRequest,
} from "@lib/types";
import type { ListType, TaskType } from "@server/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { v4 } from "uuid";

function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (req: CreateTaskRequest) =>
      client("/tasks").post({
        body: req,
      }),
    async onMutate(data) {
      const queryKey = `${queryKeys.tasks}-${data.listId}`;

      await queryClient.cancelQueries({
        queryKey: [queryKey],
      });

      const taskId = v4();

      const newTask: TaskRenderType = {
        renderId: taskId,
        id: "",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isCompleted: false,
        isImportant: false,
        dueDate: data.dueDate ?? null,
        ...data,
      };

      const previousTasks =
        queryClient.getQueryData<TaskType[]>([queryKey]) ?? [];

      queryClient.setQueryData<TaskType[]>([queryKey], (old) => [
        ...(old ?? []),
        newTask,
      ]);

      return { previousTasks, taskId };
    },
    onError(_, data, context) {
      queryClient.setQueryData(
        [`${queryKeys.tasks}-${data.listId}`],
        context?.previousTasks,
      );
      toast({
        variant: "destructive",
        title: "Failed to create task.",
      });
    },
    onSuccess(data, _, context) {
      queryClient.setQueryData<TaskType[]>(
        [`${queryKeys.tasks}-${data.listId}`],
        (old) => {
          if (!old) return [];

          const updatedTasks = old.map((task: TaskRenderType) => {
            if (task.renderId === context?.taskId)
              return {
                renderId: task.renderId,
                ...data,
              };

            return task;
          });

          return updatedTasks;
        },
      );
    },
  });
}

function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (req: UpdateTaskRequest) =>
      client("/tasks").patch({
        body: req,
      }),
    async onMutate(newTask: TaskType) {
      const queryKey = `${queryKeys.tasks}-${newTask.listId}`;

      await queryClient.cancelQueries({ queryKey: [queryKey] });

      const previousTasks = queryClient.getQueryData<TaskType[]>([queryKey]);

      queryClient.setQueryData<TaskType[]>([queryKey], (old) => [
        ...old!.filter((task) => task.id !== newTask.id),
        newTask,
      ]);

      return { previousTasks };
    },
    onError(_, data, context) {
      queryClient.setQueryData(
        [`${queryKeys.tasks}-${data.listId}`],
        context?.previousTasks,
      );

      toast({
        variant: "destructive",
        title: "Failed to update task.",
      });
    },
  });
}

function useCreateListMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (req: CreateListRequest) =>
      client("/lists").post({
        body: req,
      }),
    onError() {
      toast({
        variant: "destructive",
        title: "Failed to create list.",
      });
    },
    onSuccess(data) {
      queryClient.setQueryData<ListType[]>([queryKeys.lists], (lists) => {
        if (!lists) return [];

        lists.push(data);
        return lists;
      });
    },
  });
}

function useDeleteListMutation() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (req: string) => client("/lists/{id}", req).delete(),
    async onMutate(listId) {
      await queryClient.cancelQueries({ queryKey: [queryKeys.lists] });

      const previousLists = queryClient.getQueryData<ListType[]>([
        queryKeys.lists,
      ]);

      queryClient.setQueryData<ListType[]>([queryKeys.lists], (lists) =>
        lists!.filter((list) => list.id !== listId),
      );

      return { previousLists };
    },
    onError(_, __, context) {
      queryClient.setQueryData<ListType[]>(
        [queryKeys.lists],
        context?.previousLists,
      );

      toast({
        variant: "destructive",
        title: "Failed to delete list.",
      });
    },
  });
}

export {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useCreateListMutation,
  useDeleteListMutation,
};

const queryKeys = {
  lists: "lists" as const,
  tasks: "tasks" as const,
};

export { queryKeys };
