"use client";

import { api } from "@lib/trpc/react";
import type { TaskPriorityEnum } from "@lib/types";
import { toast } from "@lib/use-toast";
import {
  addDays,
  cn,
  getPriorityColor,
  getPriorityText,
  getShortDayName,
} from "@lib/utils";
import type { TaskType } from "@server/db/schema";
import {
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCalendarStats,
  IconCheck,
  IconCircle,
  IconCircleCheck,
  IconFlag2,
  IconFlag2Filled,
  IconNote,
  IconStar,
  IconStarFilled,
  IconStarOff,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import {
  createRef,
  forwardRef,
  useRef,
  useState,
  type FormEventHandler,
  type KeyboardEventHandler,
  type MouseEventHandler,
} from "react";
import DateComponent from "./date";

const Task = forwardRef<HTMLLIElement, TaskType>((task, ref) => {
  const { title, description, dueDate, priority, isCompleted, isImportant } =
    task;

  const utils = api.useUtils();
  const deleteTask = api.task.delete.useMutation({
    async onMutate(input) {
      await utils.task.get.invalidate({
        listId: task.listId,
      });

      const prevData = utils.task.get.getData({ listId: task.listId });

      utils.task.get.setData({ listId: task.listId }, (old) =>
        old?.filter((task) => task.id !== input.id),
      );

      return { prevData };
    },
    onError(_, __, ctx) {
      utils.task.get.setData({ listId: task.listId }, ctx?.prevData);

      toast({
        variant: "destructive",
        title: "Failed to delete task.",
      });
    },
  });

  const updateTask = api.task.update.useMutation({
    async onMutate(input) {
      await utils.task.get.invalidate({
        listId: task.listId,
      });

      const prevData = utils.task.get.getData({ listId: task.listId });

      utils.task.get.setData({ listId: task.listId }, (old) => [
        ...old!.filter((task) => task.id !== input.id),
        input as TaskType,
      ]);

      return { prevData };
    },
    onError(_, __, ctx) {
      utils.task.get.setData({ listId: task.listId }, ctx?.prevData);

      toast({
        variant: "destructive",
        title: "Failed to update task.",
      });
    },
  });

  const formRef = useRef<HTMLFormElement>(null!);

  const [open, setOpen] = useState<boolean>(false);
  const [dialogTitle, setDialogTitle] = useState<string>(title);
  const [dialogDescription, setDialogDescription] = useState<string>(
    description ?? "",
  );
  const [dialogDate, setDialogDate] = useState<Date | null>(
    dueDate ? new Date(dueDate) : null,
  );
  const [dialogPriority, setDialogPriority] =
    useState<TaskPriorityEnum>(priority);

  const dialogDateRef = createRef<HTMLInputElement>();

  const submitDisabled =
    dialogTitle.trim().length <= 0 ||
    (title === dialogTitle &&
      (description ?? "") === dialogDescription &&
      dueDate === dialogDate &&
      priority === dialogPriority);

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    await updateTask.mutateAsync({
      ...task,
      title: dialogTitle,
      description:
        dialogDescription.trim().length === 0 ? null : dialogDescription.trim(),
      dueDate: dialogDate,
      priority: dialogPriority,
    });

    setOpen(false);
  };

  const triggerFormSubmission: KeyboardEventHandler<HTMLFormElement> = (
    event,
  ) => {
    if (
      event.key === "Enter" &&
      !updateTask.isPending &&
      !submitDisabled &&
      document.activeElement?.id === formRef.current.id
    )
      event.currentTarget.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
  };

  function handleOnDelete() {
    deleteTask.mutate({ id: task.id });
  }

  const onCompletionChange: MouseEventHandler<HTMLElement> = async (event) => {
    event.stopPropagation();
    updateTask.mutate({
      ...task,
      isCompleted: !isCompleted,
    });
  };

  const onImportantChange: MouseEventHandler<HTMLElement> = async (event) => {
    event.stopPropagation();
    updateTask.mutate({
      ...task,
      isImportant: !isImportant,
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (value) {
          setDialogTitle(title);
          setDialogDescription(description ?? "");
          setDialogDate(dueDate ? new Date(dueDate) : null);
          setDialogPriority(priority);
        }

        setOpen(value);
      }}
    >
      <ContextMenu>
        <ContextMenuTrigger>
          <DialogTrigger asChild>
            <li
              ref={ref}
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  event.currentTarget.click();
                }
              }}
              className="flex cursor-pointer select-none flex-row items-center gap-x-2 rounded-md bg-white px-4 text-left shadow-ms transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-neutral-800 dark:hover:bg-neutral-700"
            >
              <button
                aria-label="Toggle task completion"
                onClick={onCompletionChange}
                className={cn(
                  "group ml-[6px] min-h-[18px] min-w-[18px] cursor-pointer appearance-none items-center justify-center rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  getColor(priority, isCompleted),
                )}
              >
                <IconCheck
                  className={cn(
                    "ml-px size-3",
                    isCompleted
                      ? "text-white"
                      : "text-inherit opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                  )}
                />
              </button>

              <div className="flex min-h-[52px] w-full flex-col justify-center px-4 py-2">
                <p
                  className={`text-sm ${
                    isCompleted
                      ? "text-neutral-500 line-through decoration-neutral-500"
                      : "no-underline"
                  }`}
                >
                  {title}
                </p>

                <div className="flex items-center">
                  {dueDate && (
                    <DateComponent
                      className={cn(
                        description &&
                          "after:mx-1 after:text-xs after:leading-none after:text-neutral-500 after:content-['•'] after:dark:text-neutral-400",
                      )}
                      date={new Date(dueDate)}
                      icon={<IconCalendarEvent size={13} />}
                      textCss="text-xs"
                    />
                  )}

                  {description && (
                    <IconNote
                      size={13}
                      className={cn("text-neutral-600 dark:text-neutral-300")}
                    />
                  )}
                </div>
              </div>

              <button
                aria-label="Toggle task importance"
                onClick={onImportantChange}
                className="group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {isImportant ? (
                  <IconStarFilled size={18} className="text-yellow-400" />
                ) : (
                  <IconStar
                    size={18}
                    className="text-neutral-400 group-hover:text-yellow-400 dark:text-neutral-500"
                  />
                )}
              </button>
            </li>
          </DialogTrigger>
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuItem onClick={onImportantChange}>
            {isImportant ? (
              <>
                <IconStarOff size={16} /> Remove importance
              </>
            ) : (
              <>
                <IconStar size={16} /> Mark as important
              </>
            )}
          </ContextMenuItem>
          <ContextMenuItem onClick={onCompletionChange}>
            {isCompleted ? (
              <>
                <IconCircle size={16} />
                Mark as not completed
              </>
            ) : (
              <>
                <IconCircleCheck size={16} />
                Mark as completed
              </>
            )}
          </ContextMenuItem>

          <ContextMenuSeparator />

          <ContextMenuItem
            onClick={handleOnDelete}
            className="text-red-600 focus:text-red-600 dark:text-red-400"
          >
            <IconTrash size={16} />
            Remove
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <DialogContent asChild className="max-w-none sm:max-w-sm">
        <form
          id="task-edit-form"
          ref={formRef}
          onSubmit={handleOnSubmit}
          onKeyDown={triggerFormSubmission}
        >
          <DialogHeader>
            <DialogTitle>Update task</DialogTitle>
            <DialogDescription>Make changes to your task.</DialogDescription>
          </DialogHeader>

          <div className="mt-2 flex flex-col gap-y-3">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Do a homework"
                value={dialogTitle}
                onChange={(event) => setDialogTitle(event.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-medium"
              >
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Student's book, p.84, ex.1-3"
                value={dialogDescription}
                onChange={(event) => setDialogDescription(event.target.value)}
                onKeyDown={(event) => {
                  if (event.ctrlKey && event.key === "Enter") {
                    formRef.current.dispatchEvent(
                      new Event("submit", { bubbles: true, cancelable: true }),
                    );
                  }
                }}
              />
            </div>

            <div className="flex flex-row gap-x-3">
              <div className="relative w-full">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  ref={dialogDateRef}
                  value={dialogDate?.toISOString().split("T")[0] ?? ""}
                  onChange={(event) => setDialogDate(event.target.valueAsDate)}
                  className="invisible absolute left-0 top-0 -ml-1 mt-9 size-0"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="Due Date"
                      variant="outline"
                      className="w-full"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <IconCalendarEvent className="size-4" />
                      {dialogDate ? (
                        <DateComponent
                          date={dialogDate}
                          textCss="font-semibold"
                        />
                      ) : (
                        "Add due date"
                      )}
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent>
                    <DropdownMenuLabel>Due Date</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setDialogDate(new Date())}>
                      <IconCalendar className="size-5" />
                      <div className="flex w-full justify-between">
                        <span>Today</span>
                        <span className="pl-8 text-neutral-500">Wed</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 1);
                        setDialogDate(date);
                      }}
                    >
                      <IconCalendarDue className="size-5" />
                      <div className="flex w-full justify-between">
                        <span>Tomorrow</span>
                        <span className="pl-8 text-neutral-500">
                          {getShortDayName(addDays(new Date(), 1))}
                        </span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        const date = new Date();
                        date.setDate(date.getDate() + 7);
                        setDialogDate(date);
                      }}
                    >
                      <IconCalendarPlus className="size-5" />
                      <div className="flex w-full justify-between">
                        <span>Next week</span>
                        <span className="pl-8 text-neutral-500">
                          {getShortDayName(addDays(new Date(), 7))}
                        </span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => dialogDateRef.current?.showPicker()}
                    >
                      <IconCalendarStats className="size-4" />
                      <span>Pick a date</span>
                    </DropdownMenuItem>

                    {dialogDate && (
                      <>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          onClick={() => setDialogDate(null)}
                          className="text-red-600 dark:text-red-400"
                        >
                          <IconTrash size={24} className="size-4" />
                          <span>Remove due date</span>
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="Priority"
                      variant="outline"
                      className="w-[125px]"
                      onClick={(event) => event.stopPropagation()}
                    >
                      {dialogPriority !== "P4" ? (
                        <IconFlag2Filled
                          size={20}
                          className={getPriorityColor(dialogPriority)}
                        />
                      ) : (
                        <IconFlag2 size={20} />
                      )}
                      <span>{getPriorityText(dialogPriority)}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Priority</DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem onClick={() => setDialogPriority("P1")}>
                      <IconFlag2Filled className="size-5 text-red-500" />
                      <div className="flex w-full justify-between">
                        <span>Priority 1</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setDialogPriority("P2")}>
                      <IconFlag2Filled className="size-5 text-orange-400" />
                      <div className="flex w-full justify-between">
                        <span>Priority 2</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setDialogPriority("P3")}>
                      <IconFlag2Filled className="size-5 text-blue-500" />
                      <div className="flex w-full justify-between">
                        <span>Priority 3</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setDialogPriority("P4")}>
                      <IconFlag2 className="size-5" />
                      <div className="flex w-full justify-between">
                        <span>Priority 4</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="ghost">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              loading={updateTask.isPending}
              disabled={submitDisabled}
            >
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
});

Task.displayName = "Task";

export default Task;

function getColor(priority: TaskPriorityEnum, completed: boolean) {
  switch (priority) {
    case "P4":
      return cn(
        "border-neutral-400 dark:border-neutral-500",
        completed
          ? "bg-neutral-400 dark:bg-neutral-500"
          : "text-neutral-400 dark:text-neutral-500",
      );
    case "P3":
      return cn(
        "border-blue-500",
        completed
          ? "bg-blue-500"
          : "bg-blue-50 text-blue-500 hover:bg-blue-100 dark:bg-blue-900/20",
      );
    case "P2":
      return cn(
        "border-orange-400",
        completed
          ? "bg-orange-400"
          : "bg-orange-50 text-orange-400 hover:bg-orange-100 dark:bg-orange-900/20",
      );
    default:
      return cn(
        "border-red-500",
        completed
          ? "bg-red-500"
          : "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20",
      );
  }
}
