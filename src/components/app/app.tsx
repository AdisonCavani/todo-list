"use client";

import { queryKeys } from "@lib/hooks/query";
import { sortMethods, type SortingOptions } from "@lib/sort";
import type { TaskRenderType } from "@lib/types";
import type { TaskType } from "@server/db/schema";
import { useQuery } from "@tanstack/react-query";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/accordion";
import { useState } from "react";
import FlipMove from "react-flip-move";
import Form from "./form";
import MobileForm from "./mobile-form";
import Sort from "./sort";
import Task from "./task";

type Props = {
  initialTasks: TaskType[];
  listId: string;
};

function App({ initialTasks, listId }: Props) {
  const { data: tasks } = useQuery({
    queryKey: [`${queryKeys.tasks}-${listId}`],
    initialData: initialTasks,
  });

  const defaultSorting: SortingOptions = {
    fn: "sortTasksByImportance",
    order: "desc",
  };
  const [sorting, setSorting] = useState<SortingOptions>(defaultSorting);

  const notFinishedTasks = tasks
    .filter((x) => !x.isCompleted)
    .sort((a, b) => {
      if (sorting.order === "asc") return sortMethods[sorting.fn](a, b);
      return sortMethods[sorting.fn](b, a);
    });

  const finishedTasks = tasks
    .filter((x) => x.isCompleted)
    .sort((a, b) => {
      if (sorting.order === "asc") return sortMethods[sorting.fn](a, b);
      return sortMethods[sorting.fn](b, a);
    });

  return (
    <>
      <Sort
        sorting={sorting}
        defaultSorting={defaultSorting}
        setSorting={setSorting}
      />

      <Form listId={listId} />
      <MobileForm listId={listId} />

      <ul className="relative flex flex-col gap-y-2">
        <FlipMove typeName={null}>
          {notFinishedTasks.map((task: TaskRenderType) => (
            <Task key={task.renderId ?? task.id} {...task} />
          ))}
        </FlipMove>
      </ul>

      {finishedTasks.length > 0 && (
        <Accordion type="single" collapsible className="mt-4">
          <AccordionItem value="finished-tasks">
            <AccordionTrigger className="hover:no-underline">
              <div className="flex items-center gap-x-4 text-sm">
                <p>Completed</p>
                <span className="font-normal text-neutral-600 dark:text-neutral-400">
                  {finishedTasks.length}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul className="relative flex flex-col gap-y-2">
                <FlipMove typeName={null}>
                  {finishedTasks.map((task: TaskRenderType) => (
                    <Task key={task.renderId ?? task.id} {...task} />
                  ))}
                </FlipMove>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </>
  );
}

export default App;
