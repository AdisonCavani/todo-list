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

function RenameList({
  children,
  listId,
  listName,
  onOpenChange,
}: PropsWithChildren<Props>) {
  const [open, setOpen] = useState<boolean>(false);

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

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    await updateList.mutateAsync({
      id: listId,
      name: name.trim(),
    });

    setOpen(false);
  };

  const triggerFormSubmission: KeyboardEventHandler<HTMLFormElement> = (
    event,
  ) => {
    if (event.key === "Enter" && !updateList.isPending && !submitDisabled)
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
      <DialogContent asChild link>
        <form onSubmit={handleOnSubmit} onKeyDown={triggerFormSubmission}>
          <DialogHeader>
            <DialogTitle>Edit list</DialogTitle>
            <DialogDescription>Set new name for this list</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-y-4">
            <Input
              placeholder="My projects"
              onChange={(event) => setName(event.currentTarget.value)}
              className="col-span-2"
            />

            <Button
              type="submit"
              disabled={submitDisabled}
              loading={updateList.isPending}
            >
              Save changes
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

export default RenameList;
