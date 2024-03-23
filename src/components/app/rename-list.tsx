import { api } from "@lib/trpc/react";
import { toast } from "@lib/use-toast";
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
import { useState, type FormEventHandler, type PropsWithChildren } from "react";

type Props = {
  listId: string;
  listName: string;

  onOpenChange: (open: boolean) => void;
};

function RenameList({
  children,
  listId,
  listName,
  onOpenChange,
}: PropsWithChildren<Props>) {
  const utils = api.useUtils();
  const updateList = api.list.update.useMutation({
    async onMutate(input) {
      await utils.list.get.cancel();

      const previousLists = utils.list.get.getData();

      utils.list.get.setData(undefined, (old) =>
        old?.map((list) =>
          list.id === input.id ? { ...list, name: input.name } : list,
        ),
      );

      return { previousLists };
    },
    onError(_, __, context) {
      utils.list.get.setData(undefined, context?.previousLists);

      toast({
        variant: "destructive",
        title: "Failed to update list.",
      });
    },
  });

  const [name, setName] = useState<string>("");
  const submitDisabled =
    name.trim().length === 0 || name.trim() === listName.trim();

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    updateList.mutate({
      id: listId,
      name: name.trim(),
    });
  };

  return (
    <Dialog onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit list</DialogTitle>
          <DialogDescription>Set new name for this list</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleOnSubmit} className="flex flex-col gap-y-4">
          <Input
            placeholder="My projects"
            onChange={(event) => setName(event.currentTarget.value)}
            className="col-span-2"
          />

          <DialogClose asChild>
            <Button
              type="submit"
              disabled={submitDisabled}
              loading={updateList.isPending}
            >
              Save changes
            </Button>
          </DialogClose>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default RenameList;
