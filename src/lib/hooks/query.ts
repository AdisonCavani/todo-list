import { client } from "@api/client";
import { useToast } from "@lib/hooks/use-toast";
import type { CreateListRequest, UpdateTaskRequest } from "@lib/types";
import type { ListType, TaskType } from "@server/db/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
export { useUpdateTaskMutation, useCreateListMutation };

const queryKeys = {
  lists: "lists" as const,
  tasks: "tasks" as const,
};

export { queryKeys };
