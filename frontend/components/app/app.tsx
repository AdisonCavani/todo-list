"use client";

import type { TaskType } from "@db/schema";
import { sortMethods, type SortingOptions } from "@lib/sort";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui/accordion";
import { useState } from "react";
import FlipMove from "react-flip-move";
import Form from "./form";
import Sort from "./sort";
import Task from "./task";

type Props = {
  tasks: TaskType[];
};

function App({ tasks }: Props) {
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

      <Form />

      {notFinishedTasks.length > 0 && (
        <ul className="relative flex flex-col gap-y-2">
          <FlipMove typeName={null}>
            {notFinishedTasks.map((task: TaskType) => (
              <Task key={task.id} {...task} />
            ))}
          </FlipMove>
        </ul>
      )}

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
                  {finishedTasks.map((task: TaskType) => (
                    <Task key={task.id} {...task} />
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
