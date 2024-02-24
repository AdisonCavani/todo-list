"use client";

import { addDays, getShortDayName } from "@lib/date";
import { getPriorityColor, getPriorityText } from "@lib/helpers";
import { useCreateTaskMutation } from "@lib/hooks/query";
import { useToast } from "@lib/hooks/use-toast";
import type { TaskPriorityEnum } from "@lib/types";
import {
  IconBell,
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCalendarStats,
  IconFlag2,
  IconFlag2Filled,
  IconRepeat,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@ui/tooltip";
import { createRef, useState, type FormEventHandler } from "react";
import DateComponent from "./date";

type Props = {
  listId: string;
};

function Form({ listId }: Props) {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<TaskPriorityEnum>("P4");

  const { mutate } = useCreateTaskMutation();
  const submitDisabled = title.trim().length === 0;

  const { toast } = useToast();

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (submitDisabled) return;

    mutate({
      listId: listId,
      title: title,
      dueDate: date,
      priority: priority,
    });

    setTitle("");
    setDate(null);
    setPriority("P4");
  };

  function handleNotSupportedFeature() {
    toast({
      title: "This feature is not available yet.",
      description: "Work in progress. Sorry for the inconvenience.",
    });
  }

  const dateRef = createRef<HTMLInputElement>();

  return (
    <form
      onSubmit={handleOnSubmit}
      className="mb-3 hidden rounded-md bg-white shadow-ms dark:bg-neutral-800 lg:block"
    >
      <div className="flex flex-row items-center gap-x-2 px-4">
        <div className="ml-[6px] min-h-[18px] min-w-[18px] cursor-pointer rounded-full border border-neutral-400" />
        <input
          type="text"
          placeholder="Add a task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="block min-h-[52px] w-full px-4 py-2 text-sm outline-none placeholder:text-neutral-600 dark:bg-neutral-800 dark:placeholder:text-neutral-400"
        />
      </div>

      <div className="flex h-11 items-center justify-between rounded-b-md border-t border-neutral-300 bg-neutral-50 px-4 dark:border-neutral-700 dark:bg-neutral-900/30">
        <div className="relative flex flex-row items-center gap-x-2 text-neutral-600 dark:text-neutral-400">
          <input
            type="date"
            min={new Date().toISOString().split("T")[0]}
            ref={dateRef}
            value={date?.toISOString().split("T")[0] ?? ""}
            onChange={(event) => setDate(event.target.valueAsDate)}
            className="invisible absolute left-0 top-0 -ml-1 mt-9 h-0 w-0"
          />

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      aria-label="Due Date"
                      variant={date ? "outline" : "ghost"}
                      size="xxs"
                      className="h-7"
                    >
                      <IconCalendarEvent size={20} />
                      {date && (
                        <DateComponent
                          date={date}
                          textCss="text-xs font-semibold"
                        />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>

                <TooltipContent side="bottom" sideOffset={10}>
                  <p>Due date</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent align="start" alignOffset={-30}>
              <DropdownMenuLabel>Due Date</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setDate(new Date())}>
                <IconCalendar className="h-5 w-5" />
                <div className="flex w-full justify-between">
                  <span>Today</span>
                  <span className="pl-8 text-neutral-500">
                    {getShortDayName(new Date())}
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  const date = new Date();
                  date.setDate(date.getDate() + 1);
                  setDate(date);
                }}
              >
                <IconCalendarDue className="h-5 w-5" />
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
                  setDate(date);
                }}
              >
                <IconCalendarPlus className="h-5 w-5" />
                <div className="flex w-full justify-between">
                  <span>Next week</span>
                  <span className="pl-8 text-neutral-500">
                    {getShortDayName(addDays(new Date(), 7))}
                  </span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => dateRef.current?.showPicker()}>
                <IconCalendarStats className="h-4 w-4" />
                <span>Pick a date</span>
              </DropdownMenuItem>

              {date && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => setDate(null)}
                    className="text-red-600 dark:text-red-400"
                  >
                    <IconTrash size={24} className="h-4 w-4" />
                    <span>Remove due date</span>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button
                      type="button"
                      aria-label="Priority"
                      variant={priority !== "P4" ? "outline" : "ghost"}
                      size="xxs"
                      className="h-7"
                    >
                      {priority !== "P4" ? (
                        <>
                          <IconFlag2Filled
                            size={20}
                            className={getPriorityColor(priority)}
                          />
                          <span>{getPriorityText(priority)}</span>
                        </>
                      ) : (
                        <IconFlag2 size={20} />
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>

                <TooltipContent side="bottom" sideOffset={10}>
                  <p>Priority</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenuContent>
              <DropdownMenuLabel>Priority</DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setPriority("P1")}>
                <IconFlag2Filled className="h-5 w-5 text-red-500" />
                <div className="flex w-full justify-between">
                  <span>Priority 1</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setPriority("P2")}>
                <IconFlag2Filled className="h-5 w-5 text-orange-400" />
                <div className="flex w-full justify-between">
                  <span>Priority 2</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setPriority("P3")}>
                <IconFlag2Filled className="h-5 w-5 text-blue-500" />
                <div className="flex w-full justify-between">
                  <span>Priority 3</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem onClick={() => setPriority("P4")}>
                <IconFlag2 className="h-5 w-5" />
                <div className="flex w-full justify-between">
                  <span>Priority 4</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  aria-label="Remind me"
                  variant="ghost"
                  size="xxs"
                  className="h-7"
                  onClick={handleNotSupportedFeature}
                >
                  <IconBell size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={10}>
                <p>Remind me</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  aria-label="Repeat"
                  variant="ghost"
                  size="xxs"
                  className="h-7"
                  onClick={handleNotSupportedFeature}
                >
                  <IconRepeat size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" sideOffset={10}>
                <p>Repeat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <Button
          type="submit"
          disabled={submitDisabled}
          size="xs"
          variant="outline"
        >
          Add
        </Button>
      </div>
    </form>
  );
}

export default Form;
