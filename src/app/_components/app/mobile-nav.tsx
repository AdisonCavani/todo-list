"use client";

import Link from "@components/router/link";
import { useCreateListMutation } from "@lib/hooks";
import { api } from "@lib/trpc/react";
import type { ListType } from "@lib/types";
import { IconEdit, IconList, IconPlus, IconTrash } from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@ui/context-menu";
import { Dialog } from "@ui/dialog";
import { Input } from "@ui/input";
import { usePathname } from "next/navigation";
import { Fragment, useState, type FormEventHandler } from "react";
import RemoveList from "./remove-list";
import RenameList from "./rename-list";

type Props = {
  initialLists: ListType[];
};

function MobileNav({ initialLists }: Props) {
  const { data: lists } = api.list.get.useQuery(undefined, {
    initialData: initialLists,
  });

  const pathname = usePathname();

  const [open, setOpen] = useState<boolean>(false);
  const [content, setContent] = useState<"rename" | "remove">(null!);

  const [name, setName] = useState<string>("");
  const submitDisabled = name.trim().length === 0;

  const { mutate, isPending } = useCreateListMutation();

  if (pathname !== "/app") return;

  const handleOnSubmit: FormEventHandler = (event) => {
    event.preventDefault();

    mutate({
      name: name,
    });

    setName("");
  };

  return (
    <nav className="flex w-full grow flex-col py-8 lg:hidden">
      <h2 className="mb-8 ml-3 text-xl font-bold">Lists</h2>
      <hr className="w-full" />

      {lists
        .sort((a, b) => a.name.localeCompare(b.name))
        .map(({ id, name }) => (
          <Fragment key={id}>
            <Dialog open={open} onOpenChange={setOpen}>
              <ContextMenu>
                <ContextMenuTrigger asChild>
                  <Link
                    href={`/app/${id}`}
                    className="z-10 flex items-center gap-x-5 p-4 font-medium transition-all duration-300 hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring active:bg-accent active:text-accent-foreground"
                  >
                    <IconList size={20} className="min-w-5" />
                    <p className="truncate">{name}</p>
                  </Link>
                </ContextMenuTrigger>

                <ContextMenuContent>
                  <ContextMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      setContent("rename");
                      setOpen(true);
                    }}
                  >
                    <IconEdit size={16} />
                    Edit
                  </ContextMenuItem>

                  <ContextMenuSeparator />

                  <ContextMenuItem
                    onClick={(event) => {
                      event.stopPropagation();
                      setContent("remove");
                      setOpen(true);
                    }}
                    className="text-red-600 focus:text-red-600 dark:text-red-400"
                  >
                    <IconTrash size={16} />
                    Remove
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>

              {content === "rename" ? (
                <RenameList listId={id} listName={name} />
              ) : (
                <RemoveList listId={id} listName={name} />
              )}
            </Dialog>

            <hr className="w-full" />
          </Fragment>
        ))}

      <form
        className="mt-auto flex gap-x-2 px-5 pt-8"
        onSubmit={handleOnSubmit}
      >
        <Button
          type="submit"
          icon={<IconPlus size={20} />}
          loading={isPending}
          disabled={submitDisabled}
        />
        <Input
          type="text"
          placeholder="New list"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
        />
      </form>
    </nav>
  );
}

export default MobileNav;
