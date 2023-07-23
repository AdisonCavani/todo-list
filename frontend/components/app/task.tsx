"use client";

import type { TaskType } from "@db/schema";
import { addDays, getShortDayName } from "@lib/date";
import { getPriorityColor, getPriorityText } from "@lib/helpers";
import { useDeleteTaskMutation, useUpdateTaskMutation } from "@lib/hooks/query";
import type { TaskPriorityEnum } from "@lib/types";
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
import type { LangDictionary, Languages } from "dictionaries";
import { createRef, forwardRef, useState, type MouseEventHandler } from "react";
import DateComponent from "./date";

type Props = {
  lang: Languages;
  locale: LangDictionary;
  task: TaskType;
};

const Task = forwardRef<HTMLLIElement, Props>(({ lang, locale, task }, ref) => {
  const { title, description, dueDate, priority, isCompleted, isImportant } =
    task;

  const { mutate: deleteTask, isPending: deleteTaskLoading } =
    useDeleteTaskMutation();
  const { mutate: updateTask, isPending: updateTaskLoading } =
    useUpdateTaskMutation();

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

  const isSubmitDisabled = dialogTitle.trim().length <= 0;

  function handleOnSubmit() {
    updateTask({
      ...task,
      title: dialogTitle,
      description:
        dialogDescription.trim().length === 0 ? null : dialogDescription.trim(),
      dueDate: dialogDate,
      priority: dialogPriority,
    });
  }

  function handleOnDelete() {
    deleteTask(task.id);
  }

  const handleOnClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();
    updateTask({
      ...task,
      isCompleted: !isCompleted,
    });
  };

  const onImportantChange: MouseEventHandler<HTMLButtonElement> = async (
    event,
  ) => {
    event.stopPropagation();
    updateTask({
      ...task,
      isImportant: !isImportant,
    });
  };

  return (
    <Dialog
      onOpenChange={(event) => {
        if (event) {
          setDialogTitle(title);
          setDialogDescription(description ?? "");
          setDialogDate(dueDate ? new Date(dueDate) : null);
          setDialogPriority(priority);
        }
      }}
    >
      <DialogTrigger asChild>
        <li
          ref={ref}
          className="flex cursor-pointer flex-row items-center gap-x-2 rounded-md bg-white px-4 shadow-ms hover:bg-neutral-100 dark:bg-neutral-800"
        >
          <button
            aria-label={locale.app.task.toggleCompletion}
            onClick={handleOnClick}
            className={cn(
              "group ml-[6px] min-h-[18px] min-w-[18px] cursor-pointer appearance-none items-center justify-center rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              getColor(priority, isCompleted),
            )}
          >
            <IconCheck
              className={cn(
                "ml-px h-3 w-3",
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
                  lang={lang}
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
            aria-label={locale.app.task.toggleImportance}
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

      <DialogContent className="dark:bg-neutral-800">
        <DialogHeader>
          <div className="flex justify-between">
            <DialogTitle>{locale.app.task.title}</DialogTitle>

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
          <DialogDescription>{locale.app.task.description}.</DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-y-3">
          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium">
              {locale.app.task.labelTitle}
            </label>
            <Input
              id="title"
              type="text"
              placeholder={locale.app.task.placeholderTitle}
              value={dialogTitle}
              onChange={(event) => setDialogTitle(event.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium"
            >
              {locale.app.task.labelDescription}
            </label>
            <Textarea
              id="description"
              placeholder={locale.app.task.placeholderDescription}
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
                  aria-label={locale.app.shared.dueDate}
                  variant="outline"
                  className="w-full"
                  onClick={(event) => event.stopPropagation()}
                >
                  <IconCalendarEvent className="h-4 w-4" />
                  {dialogDate ? (
                    <DateComponent
                      lang={lang}
                      date={dialogDate}
                      textCss="font-semibold"
                    />
                  ) : (
                    locale.app.task.addDueDate
                  )}
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {locale.app.shared.dueDate}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setDialogDate(new Date())}>
                  <IconCalendar className="h-5 w-5" />
                  <div className="flex w-full justify-between">
                    <span>{locale.app.shared.today}</span>
                    <span className="pl-8 text-neutral-500">
                      {getShortDayName(new Date(), lang)}
                    </span>
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
                    <span>{locale.app.shared.tomorrow}</span>
                    <span className="pl-8 text-neutral-500">
                      {getShortDayName(addDays(new Date(), 1), lang)}
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
                  <IconCalendarPlus className="h-5 w-5" />
                  <div className="flex w-full justify-between">
                    <span>{locale.app.shared.nextWeek}</span>
                    <span className="pl-8 text-neutral-500">
                      {getShortDayName(addDays(new Date(), 7), lang)}
                    </span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => dialogDateRef.current?.showPicker()}
                >
                  <IconCalendarStats className="h-4 w-4" />
                  <span>{locale.app.shared.pickDate}</span>
                </DropdownMenuItem>

                {dialogDate && (
                  <>
                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      onClick={() => setDialogDate(null)}
                      className="text-red-600 dark:text-red-400"
                    >
                      <IconTrash size={24} className="h-4 w-4" />
                      <span>{locale.app.shared.removeDueDate}</span>
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
                  aria-label={locale.app.shared.priority}
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
                  <span>{getPriorityText(dialogPriority)}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {locale.app.shared.priority}
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onClick={() => setDialogPriority("P1")}>
                  <IconFlag2Filled className="h-5 w-5 text-red-500" />
                  <div className="flex w-full justify-between">
                    <span>{locale.app.shared.priority} 1</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDialogPriority("P2")}>
                  <IconFlag2Filled className="h-5 w-5 text-orange-400" />
                  <div className="flex w-full justify-between">
                    <span>{locale.app.shared.priority} 2</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDialogPriority("P3")}>
                  <IconFlag2Filled className="h-5 w-5 text-blue-500" />
                  <div className="flex w-full justify-between">
                    <span>{locale.app.shared.priority} 3</span>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setDialogPriority("P4")}>
                  <IconFlag2 className="h-5 w-5" />
                  <div className="flex w-full justify-between">
                    <span>{locale.app.shared.priority} 4</span>
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
              loading={updateTaskLoading}
              disabled={isSubmitDisabled}
              onClick={handleOnSubmit}
              className="w-full"
            >
              {locale.app.task.save}
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="subtle" className="w-full">
              {locale.app.task.cancel}
            </Button>
          </DialogClose>
        </DialogFooter>
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
