"use client";

import Link from "@components/router/link";
import { cn } from "@lib/utils";
import { IconDots, IconEdit, IconList, IconTrash } from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import RemoveList from "./remove-list";
import RenameList from "./rename-list";

type Props = {
  id: string;
  name: string;
};

function SideNavItem({ id, name }: Props) {
  const pathname = usePathname();

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [hasOpenDialog, setHasOpenDialog] = useState<boolean>(false);
  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const focusRef = useRef<HTMLButtonElement | null>(null);

  function handleDialogItemSelect() {
    focusRef.current = dropdownTriggerRef.current;
  }

  function handleDialogItemOpenChange(open: boolean) {
    setHasOpenDialog(open);

    if (!open) {
      setDropdownOpen(false);
    }
  }

  function handleOnSelect(event: Event) {
    event.preventDefault();
    handleDialogItemSelect && handleDialogItemSelect();
  }

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

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            ref={dropdownTriggerRef}
            size="xxs"
            variant="ghost"
            icon={<IconDots size={18} />}
            className="invisible text-muted-foreground group-hover:visible"
            onClick={(event) => event.preventDefault()}
          />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align={"center"}
          sideOffset={16}
          hidden={hasOpenDialog}
          onCloseAutoFocus={(event) => {
            if (focusRef.current) {
              focusRef.current.focus();
              focusRef.current = null;
              event.preventDefault();
            }
          }}
        >
          <RenameList
            listId={id}
            listName={name}
            onOpenChange={handleDialogItemOpenChange}
          >
            <DropdownMenuItem
              onSelect={handleOnSelect}
              onClick={(event) => event.stopPropagation()}
            >
              <IconEdit size={16} />
              Edit
            </DropdownMenuItem>
          </RenameList>

          <DropdownMenuSeparator />

          <RemoveList
            listId={id}
            listName={name}
            onOpenChange={handleDialogItemOpenChange}
          >
            <DropdownMenuItem
              onSelect={handleOnSelect}
              onClick={(event) => event.stopPropagation()}
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
