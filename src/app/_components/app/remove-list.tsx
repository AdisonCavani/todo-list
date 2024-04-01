"use client";

import { api } from "@lib/trpc/react";
import { toast } from "@lib/use-toast";
import { IconX } from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ui/dialog";
import { Input } from "@ui/input";
import { usePathname, useRouter } from "next/navigation";
import {
  useState,
  type FormEventHandler,
  type KeyboardEventHandler,
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
  const [open, setOpen] = useState<boolean>(false);

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
  const submitDisabled = input.trim() !== listName.trim();

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    await deleteList.mutateAsync({ id: listId });

    if (pathname === `/app/${listId}`) push("/app");
  };

  const triggerFormSubmission: KeyboardEventHandler<HTMLFormElement> = (
    event,
  ) => {
    if (event.key === "Enter" && !deleteList.isPending && !submitDisabled)
      event.currentTarget.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value);
        setOpen(value);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent asChild className="max-w-sm">
        <form onSubmit={handleOnSubmit} onKeyDown={triggerFormSubmission}>
          <DialogHeader>
            <DialogTitle>Delete list</DialogTitle>
            <DialogDescription>
              To confirm, type &quot;<b>{listName}</b>&quot; in the box below
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-y-4">
            <Input
              value={input}
              placeholder={listName}
              onChange={(event) => setInput(event.currentTarget.value)}
            />

            <Button
              type="submit"
              variant="destructive"
              disabled={submitDisabled}
              loading={deleteList.isPending}
            >
              Delete this list
            </Button>
          </div>

          <DialogClose
            type="button"
            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          >
            <IconX className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RemoveList;
