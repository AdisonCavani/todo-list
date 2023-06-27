import { client } from "@api/client";
import type { TaskDto } from "@api/dtos/TaskDto";
import type { CreateTaskReq } from "@api/req/CreateTaskReq";
import type { UpdateTaskReq } from "@api/req/UpdateTaskReq";
import { useToast } from "@lib/hooks/use-toast";
import { TaskType } from "@lib/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { v4 } from "uuid";

function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  const session = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (req: CreateTaskReq) =>
      client("/tasks").post({
        jwtToken: session.data?.user.access_token!,
        body: req,
      }),
    async onMutate(data) {
      await queryClient.cancelQueries({ queryKey: [queryKeys.tasks] });

      const taskId = v4();

      const newTask: TaskType = {
        renderId: taskId,
        id: "",
        userId: "",
        updatedAt: new Date().toISOString(),
        isCompleted: false,
        isImportant: false,
        priority: data.priority ?? 0,
        ...data,
      };

      const previousTasks =
        queryClient.getQueryData<TaskDto[]>([queryKeys.tasks]) ?? [];

      queryClient.setQueryData<TaskDto[]>([queryKeys.tasks], (old) => [
        ...(old ?? []),
        newTask,
      ]);

      return { previousTasks, taskId };
    },
    onError(_, __, context) {
      queryClient.setQueryData([queryKeys.tasks], context?.previousTasks);
      toast({
        variant: "destructive",
        title: "Failed to create task.",
      });
    },
    onSuccess(data, _, context) {
      queryClient.setQueryData<TaskDto[]>([queryKeys.tasks], (old) => {
        if (!old) return [];

        const updatedTasks = old.map((task: TaskType) => {
          if (task.renderId === context?.taskId)
            return {
              renderId: task.renderId,
              ...data,
            };

          return task;
        });

        return updatedTasks;
      });
    },
  });
}

function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  const session = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (req: UpdateTaskReq) =>
      client("/tasks").patch({
        jwtToken: session.data?.user.access_token!,
        body: req,
      }),
    async onMutate(newTask: TaskDto) {
      await queryClient.cancelQueries({ queryKey: [queryKeys.tasks] });

      const previousTasks = queryClient.getQueryData<TaskDto[]>([
        queryKeys.tasks,
      ]);

      queryClient.setQueryData<TaskDto[]>([queryKeys.tasks], (old) => [
        ...old!.filter((task) => task.id !== newTask.id),
        newTask,
      ]);

      return { previousTasks };
    },
    onError(_, __, context) {
      queryClient.setQueryData([queryKeys.tasks], context?.previousTasks);

      toast({
        variant: "destructive",
        title: "Failed to update task.",
      });
    },
  });
}

function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  const session = useSession();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (req: string) =>
      client("/tasks/{id}", req).delete({
        jwtToken: session.data?.user.access_token!,
      }),
    async onMutate(taskId) {
      await queryClient.cancelQueries({ queryKey: [queryKeys.tasks] });

      const previousTasks = queryClient.getQueryData<TaskDto[]>([
        queryKeys.tasks,
      ]);

      queryClient.setQueryData<TaskDto[]>([queryKeys.tasks], (tasks) =>
        tasks!.filter((task) => task.id !== taskId)
      );

      return { previousTasks };
    },
    onError(_, __, context) {
      queryClient.setQueryData<TaskDto[]>(
        [queryKeys.tasks],
        context?.previousTasks
      );

      toast({
        variant: "destructive",
        title: "Failed to delete task.",
      });
    },
  });
}

export { useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation };

const queryKeys = {
  tasks: "tasks" as const,
};

export { queryKeys };
