"use client";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/ui/dialog";
import { Input } from "@components/ui/input";
import { api } from "@lib/trpc/react";
import { toast } from "@lib/use-toast";
import { usePathname, useRouter } from "next/navigation";
import {
  useState,
  type MouseEventHandler,
  type PropsWithChildren,
} from "react";

type Props = {
  listId: string;
  listName: string;

  onOpenChange: (open: boolean) => void;
};

function RemoveList({
  children,
  listId,
  listName,
  onOpenChange,
}: PropsWithChildren<Props>) {
  const { push } = useRouter();
  const pathname = usePathname();

  const utils = api.useUtils();
  const deleteList = api.list.delete.useMutation({
    async onMutate(input) {
      await utils.list.get.invalidate();

      const prevData = utils.list.get.getData();

      utils.list.get.setData(undefined, (old) =>
        old?.filter((list) => list.id !== input.id),
      );

      return { prevData };
    },
    onError(_, __, ctx) {
      utils.list.get.setData(undefined, ctx?.prevData);

      toast({
        variant: "destructive",
        title: "Failed to delete list.",
      });
    },
  });

  const [input, setInput] = useState<string>("");

  const removeDisabled = input.trim() !== listName.trim();

  // TODO: use <form />
  const handleOnRemove: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    deleteList.mutate({ id: listId });

    if (pathname === `/app/${listId}`) push("/app");
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Delete list</DialogTitle>
          <DialogDescription>
            To confirm, type &quot;<b>{listName}</b>&quot; in the box below
          </DialogDescription>
        </DialogHeader>

        <Input
          value={input}
          placeholder={listName}
          onChange={(event) => setInput(event.currentTarget.value)}
        />
        <Button
          variant="destructive"
          className="w-full"
          disabled={removeDisabled}
          loading={deleteList.isPending}
          onClick={handleOnRemove}
        >
          Delete this list
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default RemoveList;
