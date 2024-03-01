import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { addDays, getShortDayName } from "@lib/date";
import { getPriorityColor, getPriorityText } from "@lib/helpers";
import { useToast } from "@lib/hooks/use-toast";
import { api } from "@lib/trpc/react";
import type { TaskPriorityEnum, TaskRenderType } from "@lib/types";
import * as Dialog from "@radix-ui/react-dialog";
import {
  IconArrowUp,
  IconBell,
  IconCalendar,
  IconCalendarDue,
  IconCalendarEvent,
  IconCalendarPlus,
  IconCalendarStats,
  IconFlag2,
  IconFlag2Filled,
  IconPlus,
  IconRepeat,
  IconTrash,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { createRef, useState, type FormEventHandler } from "react";
import { v4 } from "uuid";
import DateComponent from "./date";

type Props = {
  listId: string;
};

function MobileForm({ listId }: Props) {
  const [title, setTitle] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [priority, setPriority] = useState<TaskPriorityEnum>("P4");

  const utils = api.useUtils();
  const { mutate, isPending } = api.task.create.useMutation({
    async onMutate(input) {
      await utils.task.get.cancel();

      const taskId = v4();

      const newTask: TaskRenderType = {
        renderId: taskId,
        id: "",
        description: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        isCompleted: false,
        isImportant: false,
        dueDate: input.dueDate ?? null,
        ...input,
      };

      const previousTasks = utils.task.get.getData();

      utils.task.get.setData({ listId: listId }, (old) => {
        const arr = old ?? [];
        arr.push(newTask);
        return arr;
      });

      return { previousTasks, taskId };
    },
    onError(_, __, context) {
      utils.task.get.setData({ listId: listId }, context?.previousTasks);

      toast({
        variant: "destructive",
        title: "Failed to create task.",
      });
    },
    onSuccess(data, _, context) {
      utils.task.get.setData({ listId: listId }, (old) => {
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
    },
  });

  const submitDisabled = title.trim().length === 0 || isPending;

  const { toast } = useToast();
  const dateRef = createRef<HTMLInputElement>();

  function handleNotSupportedFeature() {
    toast({
      title: "This feature is not available yet.",
      description: "Work in progress. Sorry for the inconvenience.",
    });
  }

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

  return (
    <Dialog.Root
      onOpenChange={(event) => {
        if (event) {
          setTitle("");
          setDate(null);
          setPriority("P4");
        }
      }}
    >
      <Dialog.Trigger asChild>
        <button className="fixed bottom-6 right-6 z-50 block rounded-full bg-primary p-4 text-primary-foreground shadow-xl transition-colors hover:bg-primary/90 lg:hidden">
          <IconPlus size={26} />
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/30 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 lg:hidden" />
        <Dialog.Content className="fixed bottom-0 z-50 w-full border-t bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-bottom-1/2 data-[state=open]:slide-in-from-bottom-1/2 lg:hidden">
          <form className="grid gap-y-4 px-6 pt-6" onSubmit={handleOnSubmit}>
            <div className="flex h-full items-center justify-between gap-x-4">
              <Input
                type="text"
                placeholder="Add a task"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Dialog.Close asChild>
                <Button
                  type="submit"
                  disabled={submitDisabled}
                  loading={isPending}
                  size="xs"
                  icon={<IconArrowUp size={20} />}
                />
              </Dialog.Close>
            </div>

            <div className="relative flex flex-row gap-x-2 overflow-x-auto whitespace-nowrap pb-6 pt-1">
              <input
                type="date"
                min={new Date().toISOString().split("T")[0]}
                ref={dateRef}
                value={date?.toISOString().split("T")[0] ?? ""}
                onChange={(event) => setDate(event.target.valueAsDate)}
                className="invisible absolute left-0 top-0 -ml-1 mt-9 size-0"
              />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    aria-label="Due Date"
                    variant={date ? "outline" : "ghost"}
                    size="xxs"
                    className="h-7 font-normal"
                    icon={<IconCalendarEvent size={18} />}
                  >
                    {date ? (
                      <DateComponent date={date} textCss="font-normal" />
                    ) : (
                      "Due date"
                    )}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" alignOffset={-30}>
                  <DropdownMenuLabel>Due Date</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => setDate(new Date())}>
                    <IconCalendar className="size-5" />
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
                      setDate(date);
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
                    onClick={() => dateRef.current?.showPicker()}
                  >
                    <IconCalendarStats className="size-4" />
                    <span>Pick a date</span>
                  </DropdownMenuItem>

                  {date && (
                    <>
                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={() => setDate(null)}
                        className="text-red-600 dark:text-red-400"
                      >
                        <IconTrash size={24} className="size-4" />
                        <span>Remove due date</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant={priority !== "P4" ? "outline" : "ghost"}
                    size="xxs"
                    className="h-7 font-normal"
                    icon={
                      <>
                        {priority !== "P4" ? (
                          <IconFlag2Filled
                            size={18}
                            className={getPriorityColor(priority)}
                          />
                        ) : (
                          <IconFlag2 size={18} />
                        )}
                      </>
                    }
                  >
                    {priority !== "P4"
                      ? getPriorityText(priority, true)
                      : "Priority"}
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuLabel>Priority</DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => setPriority("P1")}>
                    <IconFlag2Filled className="size-5 text-red-500" />
                    <div className="flex w-full justify-between">
                      <span>Priority 1</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setPriority("P2")}>
                    <IconFlag2Filled className="size-5 text-orange-400" />
                    <div className="flex w-full justify-between">
                      <span>Priority 2</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setPriority("P3")}>
                    <IconFlag2Filled className="size-5 text-blue-500" />
                    <div className="flex w-full justify-between">
                      <span>Priority 3</span>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => setPriority("P4")}>
                    <IconFlag2 className="size-5" />
                    <div className="flex w-full justify-between">
                      <span>Priority 4</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                type="button"
                size="xxs"
                variant="ghost"
                className="font-normal"
                onClick={handleNotSupportedFeature}
                icon={<IconBell size={18} />}
              >
                Remind me
              </Button>
              <Button
                type="button"
                size="xxs"
                variant="ghost"
                className="font-normal"
                onClick={handleNotSupportedFeature}
                icon={<IconRepeat size={18} />}
              >
                Repeat
              </Button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default MobileForm;
