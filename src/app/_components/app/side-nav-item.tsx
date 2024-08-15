"use client";

import Link from "@components/router/link";
import { cn } from "@lib/utils";
import { IconDots, IconEdit, IconList, IconTrash } from "@tabler/icons-react";
import { Button } from "@ui/button";
import { Dialog } from "@ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useState } from "react";
import RemoveList from "./remove-list";
import RenameList from "./rename-list";

type Props = {
  id: string;
  name: string;
  count: number;
};

function SideNavItem({ id, name, count }: Props) {
  const pathname = usePathname();

  const [open, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<"rename" | "remove">(null!);

  return (
    <Link
      key={id}
      href={`/dash/${id}`}
      className={cn(
        "group inline-flex items-center justify-between rounded-md px-3 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        pathname === `/dash/${id}`
          ? "bg-neutral-100 font-semibold text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
          : "hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <div className="flex items-center gap-x-5 overflow-x-clip py-2">
        <IconList size={20} className="min-w-5" />
        <p className="truncate">{name}</p>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="xxs"
              variant="ghost"
              icon={<IconDots size={18} />}
              className="invisible text-muted-foreground transition-none group-hover:visible"
              onClick={(event) => event.preventDefault()}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="center" sideOffset={16}>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                setContent("rename");
                setOpen(true);
              }}
              onFocusCapture={(event) => event.stopPropagation()}
            >
              <IconEdit size={16} />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                setContent("remove");
                setOpen(true);
              }}
              onFocusCapture={(event) => event.stopPropagation()}
              className="text-red-600 focus:text-red-600 dark:text-red-400"
            >
              <IconTrash size={16} />
              Remove
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {content === "rename" ? (
          <RenameList listId={id} listName={name} />
        ) : (
          <RemoveList listId={id} listName={name} />
        )}
      </Dialog>

      <span className="mr-1 block text-muted-foreground group-hover:hidden">
        {count}
      </span>
    </Link>
  );
}

export default SideNavItem;
