"use client";

import {
  deleteTaskAction,
  toggleTaskCompletionAction,
  toggleTaskImportanceAction,
  updateTaskAction,
} from "@actions/task";
import type { TaskType } from "@db/schema";
import { getPriorityColor } from "@lib/helpers";
import { cn } from "@lib/utils";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCalendarStats,
  IconCheck,
  IconFlag2,
  IconFlag2Filled,
  IconLoader2,
  IconNote,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
  Dialog,
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
import { createRef, forwardRef, useState } from "react";
import DateComponent from "./date";

const Task = forwardRef<HTMLLIElement, TaskType>((task, ref) => {
  const {
    id,
    title,
    description,
    dueDate,
    priority,
    isCompleted,
    isImportant,
  } = task;

  const [dialogTitle, setDialogTitle] = useState<string>(title);
  const [dialogDescription, setDialogDescription] = useState<string>(
    description ?? ""
  );
  const [dialogDate, setDialogDate] = useState<Date | null>(
    dueDate ? new Date(dueDate) : null
  );
  const [dialogPriority, setDialogPriority] = useState<
    "P1" | "P2" | "P3" | "P4"
  >(priority);

  const dialogDateRef = createRef<HTMLInputElement>();

  const isSubmitDisabled = dialogTitle.trim().length <= 0;

  return (
    <Dialog
      onOpenChange={(event) => {
        if (event) {
          setDialogTitle(title);
          setDialogDescription(description ?? "");
          setDialogDate(dueDate ? new Date(dueDate) : null);
        }
      }}
    >
      <DialogTrigger asChild>
        <li
          ref={ref}
          className="flex cursor-pointer flex-row items-center gap-x-2 rounded-md bg-white px-4 shadow-ms hover:bg-neutral-100 dark:bg-neutral-800"
        >
          <button
            aria-label="Toggle task completion"
            onClick={async (event) => {
              event.stopPropagation();
              await toggleTaskCompletionAction(task);
            }}
            className={cn(
              "group ml-[6px] min-h-[18px] min-w-[18px] cursor-pointer appearance-none items-center justify-center rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              getColor(priority, isCompleted)
            )}
          >
            <IconCheck
              className={cn(
                "ml-px h-3 w-3",
                isCompleted
                  ? "text-white"
                  : "text-inherit opacity-0 transition-opacity duration-200 group-hover:opacity-100"
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
                      "after:mx-1 after:text-xs after:leading-none after:text-neutral-500 after:content-['•'] after:dark:text-neutral-400"
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
            onClick={async (event) => {
              event.stopPropagation();
              await toggleTaskImportanceAction(task);
            }}
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

      <DialogContent className="dark:bg-neutral-800">
        <DialogHeader>
          <div className="flex justify-between">
            <DialogTitle>Update task</DialogTitle>

            <DialogClose asChild>
              <Button
                size="xs"
                loading={false}
                icon={<IconTrash size={18} />}
                variant="destructive"
                onClick={async () => await deleteTaskAction(id)}
              />
            </DialogClose>
          </div>
          <DialogDescription>
            Make changes to your task here. Click save when you&apos;re done.
          </DialogDescription>
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
            />
          </div>

          <div className="relative">
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              ref={dialogDateRef}
              value={dialogDate?.toISOString().split("T")[0] ?? ""}
              onChange={(event) => setDialogDate(event.target.valueAsDate)}
              className="invisible absolute left-0 top-0 -ml-1 mt-9 h-0 w-0"
            />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label="Due Date"
                  variant="outline"
                  className="w-full"
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconCalendarEvent className="h-4 w-4" />
                  {dialogDate ? (
                    <DateComponent date={dialogDate} textCss="font-semibold" />
                  ) : (
                    "Add due date"
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>Due Date</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setDialogDate(new Date())}>
                  <IconCalendar className="h-5 w-5" />
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
                  <IconCalendarDue className="h-5 w-5" />
                  <div className="flex w-full justify-between">
                    <span>Tomorrow</span>
                    <span className="pl-8 text-neutral-500">Thu</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => {
                    const date = new Date();
                    date.setDate(date.getDate() + 7);
                    setDialogDate(date);
                  }}
                >
                  <IconCalendarPlus className="h-5 w-5" />
                  <div className="flex w-full justify-between">
                    <span>Next week</span>
                    <span className="pl-8 text-neutral-500">Mon</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => dialogDateRef.current?.showPicker()}
                >
                  <IconCalendarStats className="h-4 w-4" />
                  <span>Pick a date</span>
                </DropdownMenuItem>

                {dialogDate && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => setDialogDate(null)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <IconTrash size={24} className="h-4 w-4" />
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
                  className="w-full"
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
                  <span>{dialogPriority}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Priority</DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setDialogPriority("P1")}>
                  <IconFlag2Filled className="h-5 w-5 text-red-500" />
                  <div className="flex w-full justify-between">
                    <span>Priority 1</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDialogPriority("P2")}>
                  <IconFlag2Filled className="h-5 w-5 text-orange-400" />
                  <div className="flex w-full justify-between">
                    <span>Priority 2</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDialogPriority("P3")}>
                  <IconFlag2Filled className="h-5 w-5 text-blue-500" />
                  <div className="flex w-full justify-between">
                    <span>Priority 3</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDialogPriority("P4")}>
                  <IconFlag2 className="h-5 w-5" />
                  <div className="flex w-full justify-between">
                    <span>Priority 4</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="blue"
              disabled={isSubmitDisabled}
              onClick={async () =>
                await updateTaskAction({
                  ...task,
                  title: dialogTitle,
                  description:
                    dialogDescription.trim().length === 0
                      ? null
                      : dialogDescription.trim(),
                  dueDate: dialogDate,
                  priority: dialogPriority,
                })
              }
              className="w-full"
            >
              {false ? (
                <IconLoader2 size={16} className="animate-spin" />
              ) : (
                <p>Save</p>
              )}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="subtle" className="w-full">
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

Task.displayName = "Task";

export default Task;

function getColor(priority: "P1" | "P2" | "P3" | "P4", completed: boolean) {
  switch (priority) {
    case "P4":
      return cn(
        "border-neutral-400 dark:border-neutral-500",
        completed
          ? "bg-neutral-400 dark:bg-neutral-500"
          : "text-neutral-400 dark:text-neutral-500"
      );
    case "P3":
      return cn(
        "border-blue-500",
        completed
          ? "bg-blue-500"
          : "bg-blue-50 text-blue-500 hover:bg-blue-100 dark:bg-blue-900/20"
      );
    case "P2":
      return cn(
        "border-orange-400",
        completed
          ? "bg-orange-400"
          : "bg-orange-50 text-orange-400 hover:bg-orange-100 dark:bg-orange-900/20"
      );
    default:
      return cn(
        "border-red-500",
        completed
          ? "bg-red-500"
          : "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20"
      );
  }
}
