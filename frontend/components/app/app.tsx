"use client";

import { Disclosure, Menu, Transition } from "@headlessui/react";
import { sortMethods, sortMethodsNames, SortingOptions } from "@lib/sort";
import { useStore } from "@lib/store";
import {
  IconArrowsSort,
  IconCalendarPlus,
  IconCalendarTime,
  IconChevronRight,
  IconChevronUp,
  IconStar,
  IconX,
} from "@tabler/icons-react";
import clsx from "clsx";
import { Fragment, useState } from "react";
import Form from "./form";
import Task from "./task";

function App() {
  const { tasks } = useStore();

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
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Tasks</h1>

        <Menu as="div" className="relative">
          <Menu.Button className="">
            <IconArrowsSort size={22} className="stroke-1" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute top-0 right-0 z-10 mt-8 min-w-[200px] rounded bg-white py-2 text-sm text-black shadow-xl">
              <p className="mb-2 border-b px-2 pt-2 pb-3 text-center font-semibold">
                Sort by
              </p>

              <ul>
                <Menu.Item as="li">
                  <button
                    className="flex h-[36px] w-full items-center px-4 hover:bg-neutral-100"
                    onClick={() =>
                      setSorting({
                        fn: "sortTasksByImportance",
                        order: "desc",
                      })
                    }
                  >
                    <IconStar size={20} className="mx-2 stroke-1" />
                    <p className="mx-1 px-1 text-sm text-neutral-700">
                      Importance
                    </p>
                  </button>
                </Menu.Item>
                <Menu.Item as="li">
                  <button
                    className="flex h-[36px] w-full items-center px-4 hover:bg-neutral-100"
                    onClick={() =>
                      setSorting({
                        fn: "sortTasksByDueDate",
                        order: "asc",
                      })
                    }
                  >
                    <IconCalendarTime size={20} className="mx-2 stroke-1" />
                    <p className="mx-1 px-1 text-sm text-neutral-700">
                      Due date
                    </p>
                  </button>
                </Menu.Item>
                <Menu.Item as="li">
                  <button
                    className="flex h-[36px] w-full items-center px-4 hover:bg-neutral-100"
                    onClick={() =>
                      setSorting({
                        fn: "sortTasksByTitle",
                        order: "asc",
                      })
                    }
                  >
                    <IconArrowsSort size={20} className="mx-2 stroke-1" />
                    <p className="mx-1 px-1 text-sm text-neutral-700">
                      Alphabetically
                    </p>
                  </button>
                </Menu.Item>
                <Menu.Item as="li">
                  <button
                    className="flex h-[36px] w-full items-center px-4 hover:bg-neutral-100"
                    onClick={() =>
                      setSorting({
                        fn: "sortTasksByCreationDate",
                        order: "desc",
                      })
                    }
                  >
                    <IconCalendarPlus size={20} className="mx-2 stroke-1" />
                    <p className="mx-1 px-1 text-sm text-neutral-700">
                      Creation date
                    </p>
                  </button>
                </Menu.Item>
              </ul>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      <div className="mb-2 flex items-center justify-end gap-x-3">
        <button
          onClick={() =>
            setSorting((prev) => ({
              ...prev,
              order: prev.order === "asc" ? "desc" : "asc",
            }))
          }
        >
          <IconChevronUp
            size={24}
            className={clsx(
              "stroke-1 transition-transform",
              sorting.order === "asc" ? "rotate-0" : "rotate-180"
            )}
          />
        </button>
        <p className="text-xs font-semibold">
          Sorted {sortMethodsNames[sorting.fn]}
        </p>
        <button onClick={() => setSorting(defaultSorting)}>
          <IconX size={20} className="stroke-1" />
        </button>
      </div>

      <Form />

      {notFinishedTasks.length > 0 && (
        <ul className="z-[1] flex flex-col gap-y-2">
          {notFinishedTasks.map((task) => (
            <Task key={task.id} {...task} />
          ))}
        </ul>
      )}

      {finishedTasks.length > 0 && (
        <Disclosure>
          <Disclosure.Button className="mt-4 flex w-full items-center gap-x-3 border-b border-neutral-300 py-2 text-sm ui-open:border-b-0">
            <IconChevronRight
              size={22}
              className="stroke-1 text-neutral-500 transition-transform ui-open:rotate-90 ui-open:transform"
            />
            <h3 className="p-2 font-semibold">Completed</h3>
            <span className="">{finishedTasks.length}</span>
          </Disclosure.Button>

          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel>
              <ul className="z-[1] flex flex-col gap-y-2">
                {finishedTasks.map((task) => (
                  <Task key={task.id} {...task} />
                ))}
              </ul>
            </Disclosure.Panel>
          </Transition>
        </Disclosure>
      )}
    </>
  );
}

export default App;