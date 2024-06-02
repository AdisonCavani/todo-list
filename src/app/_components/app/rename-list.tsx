import { useUpdateListMutation } from "@lib/hooks";
import { IconX } from "@tabler/icons-react";
import { Button } from "@ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/dialog";
import { Input } from "@ui/input";
import {
  useState,
  type FormEventHandler,
  type KeyboardEventHandler,
} from "react";

type Props = {
  listId: string;
  listName: string;
};

function RenameList({ listId, listName }: Props) {
  const [name, setName] = useState<string>("");
  const submitDisabled =
    name.trim().length === 0 || name.trim() === listName.trim();

  const { mutateAsync, isPending } = useUpdateListMutation();

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    await mutateAsync({
      updateMask: ["name"],
      list: {
        id: listId,
        name: name.trim(),
      },
    });
  };

  const triggerFormSubmission: KeyboardEventHandler<HTMLFormElement> = (
    event,
  ) => {
    if (event.key === "Enter" && !isPending && !submitDisabled)
      event.currentTarget.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
  };

  return (
    <DialogContent asChild link className="xs:max-w-sm">
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

          <DialogClose asChild>
            <Button type="submit" disabled={submitDisabled} loading={isPending}>
              Save changes
            </Button>
          </DialogClose>
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
  );
}

export default RenameList;
