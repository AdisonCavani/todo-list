import { v4 } from "uuid";
import { api } from "./trpc/react";
import type { TaskRenderType } from "./types";
import { toast } from "./use-toast";

function useCreateListMutation() {
  return api.list.create.useMutation({
    onError() {
      toast({
        variant: "destructive",
        title: "Failed to create list.",
      });
    },
  });
}

function useUpdateListMutation() {
  const utils = api.useUtils();

  return api.list.update.useMutation({
    async onMutate(input) {
      await utils.list.get.cancel();

      const previousLists = utils.list.get.getData();

      utils.list.get.setData(undefined, (old) =>
        old?.map((list) =>
          list.id === input.list.id
            ? { ...list, name: input.list.name! }
            : list,
        ),
      );

      return { previousLists };
    },
    onError(_, __, context) {
      utils.list.get.setData(undefined, context?.previousLists);

      toast({
        variant: "destructive",
        title: "Failed to update list.",
      });
    },
  });
}

function useDeleteListMutation() {
  const utils = api.useUtils();

  return api.list.delete.useMutation({
    async onMutate(input) {
      await utils.list.get.invalidate();

      const prevData = utils.list.get.getData();

      utils.list.get.setData(undefined, (old) =>
        old?.filter((list) => list.id !== input.id),
      );

      return { prevData };
    },
    onError(_, __, ctx) {
      utils.list.get.setData(undefined, ctx?.prevData);

      toast({
        variant: "destructive",
        title: "Failed to delete list.",
      });
    },
  });
}

function useCreateTaskMutation() {
  const utils = api.useUtils();

  return api.task.create.useMutation({
    async onMutate(input) {
      await utils.task.get.cancel();

      const taskId = v4();

      const newTask: TaskRenderType = {
        renderId: taskId,
        id: "",
        description: null,
        createdAt: new Date(),
        isCompleted: false,
        isImportant: false,
        dueDate: input.dueDate ?? null,
        ...input,
      };

      const previousTasks = utils.task.get.getData();

      utils.task.get.setData({ listId: input.listId }, (old) => {
        const arr = old ?? [];
        arr.push(newTask);
        return arr;
      });

      return { previousTasks, taskId };
    },
    onError(_, input, context) {
      utils.task.get.setData({ listId: input.listId }, context?.previousTasks);

      toast({
        variant: "destructive",
        title: "Failed to create task.",
      });
    },
    async onSuccess(data, input, context) {
      utils.task.get.setData({ listId: input.listId }, (old) => {
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
      });

      await utils.list.get.invalidate();
    },
  });
}

function useUpdateTaskMutation() {
  const utils = api.useUtils();

  return api.task.update.useMutation({
    async onMutate(input) {
      await utils.task.get.invalidate({
        listId: input.task.listId,
      });

      const prevData = utils.task.get.getData({ listId: input.task.listId });

      utils.task.get.setData({ listId: input.task.listId }, (old) => [
        ...old!.filter((task) => task.id !== input.task.id),
        {
          ...old?.find((task) => task.id === input.task.id)!,
          ...input.task,
        },
      ]);

      return { prevData };
    },
    onError(_, input, ctx) {
      utils.task.get.setData({ listId: input.task.listId }, ctx?.prevData);

      toast({
        variant: "destructive",
        title: "Failed to update task.",
      });
    },
    async onSuccess() {
      await utils.list.get.invalidate();
    },
  });
}

function useDeleteTaskMutation(listId: string) {
  const utils = api.useUtils();

  return api.task.delete.useMutation({
    async onMutate(input) {
      await utils.task.get.invalidate({
        listId: listId,
      });

      const prevData = utils.task.get.getData({ listId: listId });

      utils.task.get.setData({ listId: listId }, (old) =>
        old?.filter((task) => task.id !== input.id),
      );

      return { prevData };
    },
    onError(_, __, ctx) {
      utils.task.get.setData({ listId: listId }, ctx?.prevData);

      toast({
        variant: "destructive",
        title: "Failed to delete task.",
      });
    },
    async onSuccess() {
      await utils.list.get.invalidate();
    },
  });
}

export {
  useCreateListMutation,
  useUpdateListMutation,
  useDeleteListMutation,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
};
