"use client";

import { sortMethods, type SortingOptions } from "@lib/sort";
import { api } from "@lib/trpc/react";
import type { TaskRenderType, TaskType } from "@lib/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/accordion";
import { useState } from "react";
import { Flipped, Flipper } from "react-flip-toolkit";
import Form from "./form";
import MobileForm from "./mobile-form";
import Sort from "./sort";
import Task from "./task";

type Props = {
  initialTasks: TaskType[];
  listId: string;
};

function App({ initialTasks, listId }: Props) {
  const { data: tasks } = api.task.get.useQuery(
    {
      listId: listId,
    },
    {
      initialData: initialTasks,
    },
  );

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
      <div className="px-3 pt-8 sm:px-6">
        <Sort
          sorting={sorting}
          defaultSorting={defaultSorting}
          setSorting={setSorting}
        />

        <Form listId={listId} />
        <MobileForm listId={listId} />
      </div>

      <div className="scrollbar flex flex-1 flex-col overflow-x-hidden overflow-y-scroll px-3 pb-24 sm:pb-8 sm:pl-6 sm:pr-3">
        <Flipper
          element="ul"
          className="relative flex flex-col gap-y-2 px-0.5 first:mt-4"
          flipKey={notFinishedTasks
            .map((task: TaskRenderType) => task.id)
            .join("")}
        >
          {notFinishedTasks.map((task: TaskRenderType) => (
            <Flipped
              key={task.renderId ?? task.id}
              flipId={task.renderId ?? task.id}
            >
              {(flippedProps) => (
                <Task flippedProps={flippedProps} task={task} />
              )}
            </Flipped>
          ))}
        </Flipper>

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
                <Flipper
                  element="ul"
                  className="relative flex flex-col gap-y-2 px-0.5"
                  flipKey={finishedTasks
                    .map((task: TaskRenderType) => task.id)
                    .join("")}
                >
                  {finishedTasks.map((task: TaskRenderType) => (
                    <Flipped
                      key={task.renderId ?? task.id}
                      flipId={task.renderId ?? task.id}
                    >
                      {(flippedProps) => (
                        <Task flippedProps={flippedProps} task={task} />
                      )}
                    </Flipped>
                  ))}
                </Flipper>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </>
  );
}

export default App;
