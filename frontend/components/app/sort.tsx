import type { SortingOptions } from "@lib/sort";
import { cn } from "@lib/utils";
import {
  IconArrowsSort,
  IconCalendarPlus,
  IconCalendarTime,
  IconChevronUp,
  IconStar,
  IconX,
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
import type { LangDictionary } from "dictionaries";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  locale: LangDictionary;

  sorting: SortingOptions;
  defaultSorting: SortingOptions;
  setSorting: Dispatch<SetStateAction<SortingOptions>>;
};

function Sort({ locale, sorting, defaultSorting, setSorting }: Props) {
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold">{locale.app.tasks}</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <IconArrowsSort className="h-4 w-4" />
              <span>{locale.app.sort.title}</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{locale.app.sort.sortBy}</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                setSorting({
                  fn: "sortTasksByImportance",
                  order: "desc",
                })
              }
            >
              <IconStar className="h-4 w-4" />
              <span>{locale.app.sort.importance}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                setSorting({
                  fn: "sortTasksByDueDate",
                  order: "asc",
                })
              }
            >
              <IconCalendarTime className="h-4 w-4" />
              <span>{locale.app.shared.dueDate}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                setSorting({
                  fn: "sortTasksByTitle",
                  order: "asc",
                })
              }
            >
              <IconArrowsSort className="h-4 w-4" />
              <span>{locale.app.sort.alphabetically}</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() =>
                setSorting({
                  fn: "sortTasksByCreationDate",
                  order: "desc",
                })
              }
            >
              <IconCalendarPlus className="h-4 w-4" />
              <span>{locale.app.sort.creationDate}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mb-3 flex items-center justify-end gap-x-3">
        <Button
          size="xxs"
          variant="ghost"
          aria-label="Reverse sort order"
          onClick={() =>
            setSorting((prev) => ({
              ...prev,
              order: prev.order === "asc" ? "desc" : "asc",
            }))
          }
        >
          <IconChevronUp
            size={24}
            className={cn(
              "stroke-1 transition-transform",
              sorting.order === "asc" ? "rotate-0" : "rotate-180",
            )}
          />
        </Button>
        <p className="text-xs font-semibold">
          {locale.app.sort.sorting[sorting.fn]}
        </p>
        <Button
          size="xxs"
          variant="ghost"
          aria-label="Remove sort order option"
          onClick={() => setSorting(defaultSorting)}
        >
          <IconX size={20} className="stroke-1" />
        </Button>
      </div>
    </>
  );
}

export default Sort;
