"use client";

import type { TaskDto, TaskPriorityEnum } from "@api/dtos/TaskDto";
import { getPriorityColor, getPriorityText } from "@lib/helpers";
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@lib/hooks/query";
import { DialogClose } from "@radix-ui/react-dialog";
import {
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCalendarStats,
  IconFlag2,
  IconFlag2Filled,
  IconLoader2,
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
import Task from "./task";

const TaskEdit = forwardRef<HTMLLIElement, TaskDto>((task, ref) => {
  const { title, description, dueDate, priority } = task;

  const { mutate: deleteTask, isLoading: deleteTaskLoading } =
    useDeleteTaskMutation();
  const { mutate: updateTask, isLoading: updateTaskLoading } =
    useUpdateTaskMutation();

  const [dialogTitle, setDialogTitle] = useState<string>(title);
  const [dialogDescription, setDialogDescription] = useState<string>(
    description ?? ""
  );
  const [dialogDate, setDialogDate] = useState<Date | null>(
    dueDate ? new Date(dueDate) : null
  );
  const [dialogPriority, setDialogPriority] =
    useState<TaskPriorityEnum>(priority);

  const dialogDateRef = createRef<HTMLInputElement>();

  const isSubmitDisabled = dialogTitle.trim().length <= 0;

  function handleOnSubmit() {
    updateTask({
      ...task,
      title: dialogTitle,
      description:
        dialogDescription.trim().length === 0 ? null : dialogDescription.trim(),
      dueDate: dialogDate?.toISOString().split("T")[0],
      priority: dialogPriority,
    });
  }

  function handleOnDelete() {
    deleteTask(task.id);
  }

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
        <Task ref={ref} {...task} />
      </DialogTrigger>

      <DialogContent className="dark:bg-neutral-800">
        <DialogHeader>
          <div className="flex justify-between">
            <DialogTitle>Update task</DialogTitle>

            <DialogClose asChild>
              <Button
                size="xs"
                loading={deleteTaskLoading}
                icon={<IconTrash size={18} />}
                variant="destructive"
                onClick={handleOnDelete}
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
                  {dialogPriority > 0 ? (
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

                <DropdownMenuItem onClick={() => setDialogPriority(3)}>
                  <IconFlag2Filled className="h-5 w-5 text-red-500" />
                  <div className="flex w-full justify-between">
                    <span>Priority 1</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDialogPriority(2)}>
                  <IconFlag2Filled className="h-5 w-5 text-orange-400" />
                  <div className="flex w-full justify-between">
                    <span>Priority 2</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDialogPriority(1)}>
                  <IconFlag2Filled className="h-5 w-5 text-blue-500" />
                  <div className="flex w-full justify-between">
                    <span>Priority 3</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDialogPriority(0)}>
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
              onClick={handleOnSubmit}
              className="w-full"
            >
              {updateTaskLoading ? (
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

TaskEdit.displayName = "Task";

export default TaskEdit;
