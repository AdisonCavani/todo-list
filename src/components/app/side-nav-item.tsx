"use client";

import Link from "@components/router/link";
import { Button } from "@components/ui/button";
import { DialogTrigger } from "@components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { useToast } from "@lib/hooks/use-toast";
import { cn } from "@lib/utils";
import { IconDots, IconEdit, IconList, IconTrash } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import RemoveList from "./remove-list";

type Props = {
  id: string;
  name: string;
};

function SideNavItem({ id, name }: Props) {
  const { toast } = useToast();
  const pathname = usePathname();

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

      <RemoveList listId={id} listName={name}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="xxs"
              variant="ghost"
              icon={<IconDots size={18} />}
              className="invisible text-muted-foreground group-hover:visible"
              onClick={(event) => event.preventDefault()}
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" sideOffset={16}>
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                toast({
                  title: "This feature is not available yet.",
                  description: "Work in progress. Sorry for the inconvenience.",
                });
              }}
            >
              <IconEdit size={16} />
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DialogTrigger asChild onClick={(event) => event.stopPropagation()}>
              <DropdownMenuItem
                onClick={(event) => event.stopPropagation()}
                className="text-red-600 focus:text-red-600 dark:text-red-400"
              >
                <IconTrash size={16} />
                Remove
              </DropdownMenuItem>
            </DialogTrigger>
          </DropdownMenuContent>
        </DropdownMenu>
      </RemoveList>
    </Link>
  );
}

export default SideNavItem;
