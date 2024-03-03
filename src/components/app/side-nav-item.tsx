"use client";

import Link from "@components/router/link";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { cn } from "@lib/utils";
import { IconDots, IconEdit, IconList, IconTrash } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import RemoveList from "./remove-list";
import RenameList from "./rename-list";

type Props = {
  id: string;
  name: string;
};

function SideNavItem({ id, name }: Props) {
  const pathname = usePathname();
  const [hidden, setHidden] = useState<boolean>(false);

  return (
    <Link
      key={id}
      href={`/app/${id}`}
      className={cn(
        "group inline-flex items-center justify-between rounded-md px-3 text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        pathname === `/app/${id}`
          ? "bg-neutral-100 font-semibold text-neutral-900 hover:bg-neutral-200 dark:bg-neutral-600 dark:text-neutral-100 dark:hover:bg-neutral-700"
          : "hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <div className="flex items-center gap-x-5 py-2">
        <IconList size={20} />
        {name}
      </div>

      <DropdownMenu
        onOpenChange={(open) => {
          setHidden(!open);
        }}
      >
        <DropdownMenuTrigger asChild>
          <Button
            size="xxs"
            variant="ghost"
            icon={<IconDots size={18} />}
            className="invisible text-muted-foreground group-hover:visible"
            onClick={(event) => event.preventDefault()}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={"center"}
          className={hidden ? "invisible" : "visible"}
          sideOffset={16}
          onFocusCapture={(event) => {
            event.stopPropagation();
          }}
        >
          <RenameList listId={id} listName={name}>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                setHidden(true);
              }}
              onSelect={(event) => event.preventDefault()}
            >
              <IconEdit size={16} />
              Edit
            </DropdownMenuItem>
          </RenameList>

          <DropdownMenuSeparator />

          <RemoveList listId={id} listName={name}>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                setHidden(true);
              }}
              onSelect={(event) => event.preventDefault()}
              className="text-red-600 focus:text-red-600 dark:text-red-400"
            >
              <IconTrash size={16} />
              Remove
            </DropdownMenuItem>
          </RemoveList>
        </DropdownMenuContent>
      </DropdownMenu>
    </Link>
  );
}

export default SideNavItem;
