import { TaskDto, TaskPriorityEnum } from "@api/dtos/TaskDto";
import { useUpdateTaskMutation } from "@lib/hooks/query";
import { cn } from "@lib/utils";
import {
  IconCalendarEvent,
  IconCheck,
  IconNote,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import { forwardRef, MouseEventHandler } from "react";
import DateComponent from "./date";

const Task = forwardRef<HTMLLIElement, TaskDto>((task, ref) => {
  const {
    title,
    description,
    dueDate,
    isCompleted,
    isImportant,
    priority,
    id,
    updatedAt,
    userId,
    ...props
  } = task;
  const { mutate } = useUpdateTaskMutation();

  const handleOnClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation();

    mutate({
      ...task,
      isCompleted: !isCompleted,
    });
  };

  const onImportantChange: MouseEventHandler<HTMLButtonElement> = async (
    event
  ) => {
    event.stopPropagation();

    mutate({
      ...task,
      isImportant: !isImportant,
    });
  };

  return (
    <li
      ref={ref}
      {...props}
      className="flex cursor-pointer flex-row items-center gap-x-2 rounded-md bg-white px-4 shadow-ms hover:bg-neutral-100 dark:bg-neutral-800"
    >
      <button
        aria-label="Toggle task completion"
        onClick={handleOnClick}
        className={cn(
          "group ml-[6px] min-h-[18px] min-w-[18px] cursor-pointer appearance-none items-center justify-center rounded-full border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          getColor(priority),
          isCompleted &&
            "border-neutral-400 bg-neutral-400 hover:bg-neutral-400 dark:border-neutral-500 dark:bg-neutral-500 dark:hover:bg-neutral-500"
        )}
      >
        {!isCompleted && (
          <IconCheck className="ml-px h-3 w-3 text-inherit opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
        )}
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
  );
});

Task.displayName = "Task";

export default Task;

function getColor(priority: TaskPriorityEnum) {
  switch (priority) {
    case 0:
      return cn(
        "border-neutral-400 text-neutral-400 dark:border-neutral-500 dark:text-neutral-500"
      );
    case 1:
      return cn(
        "border-blue-400 bg-blue-50 text-blue-400 hover:bg-blue-100 dark:bg-blue-900/20"
      );
    case 2:
      return cn(
        "border-orange-400 bg-orange-50 text-orange-400 hover:bg-orange-100 dark:bg-orange-900/20"
      );
    default:
      return cn(
        "border-red-400 bg-red-50 text-red-400 hover:bg-red-100 dark:bg-red-900/20"
      );
  }
}
