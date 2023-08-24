import { client } from "@api/client";
import type { TaskType } from "@db/schema";
import { useToast } from "@lib/hooks/use-toast";
import type {
  CreateListRequest,
  CreateTaskRequest,
  TaskRenderType,
  UpdateTaskRequest,
} from "@lib/types";
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

function useDeleteTaskMutation(listId: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const queryKey = `${queryKeys.tasks}-${listId}`;

  return useMutation({
    mutationFn: (req: string) => client("/tasks/{id}", req).delete(),
    async onMutate(taskId) {
      await queryClient.cancelQueries({ queryKey: [queryKey] });

      const previousTasks = queryClient.getQueryData<TaskType[]>([queryKey]);

      queryClient.setQueryData<TaskType[]>([queryKey], (tasks) =>
        tasks!.filter((task) => task.id !== taskId),
      );

      return { previousTasks };
    },
    onError(_, __, context) {
      queryClient.setQueryData<TaskType[]>([queryKey], context?.previousTasks);

      toast({
        variant: "destructive",
        title: "Failed to delete task.",
      });
    },
  });
}

function useCreateListMutation() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (req: CreateListRequest) =>
      client("/lists").post({
        body: req,
      }),
    onError() {
      toast({
        variant: "destructive",
        title: "Failed to create task.",
      });
    },
  });
}

export {
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useCreateListMutation,
};

const queryKeys = {
  lists: "lists" as const,
  tasks: "tasks" as const,
};

export { queryKeys };
