"use client";

import { useDeleteListMutation } from "@lib/hooks";
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
import { usePathname, useRouter } from "next/navigation";
import {
  useState,
  type FormEventHandler,
  type KeyboardEventHandler,
} from "react";

type Props = {
  listId: string;
  listName: string;
};

function RemoveList({ listId, listName }: Props) {
  const { push } = useRouter();
  const pathname = usePathname();

  const { mutateAsync, isPending } = useDeleteListMutation();

  const [input, setInput] = useState<string>("");
  const submitDisabled = input.trim() !== listName.trim();

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();

    await mutateAsync({ id: listId });

    if (pathname === `/dash/${listId}`) push("/dash");
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
          <DialogTitle>Delete list</DialogTitle>
          <DialogDescription>
            To confirm, type &quot;
            <b className="truncate whitespace-pre-wrap break-all">{listName}</b>
            &quot; in the box below
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-y-4">
          <Input
            value={input}
            placeholder={listName}
            onChange={(event) => setInput(event.currentTarget.value)}
          />

          <DialogClose asChild>
            <Button
              type="submit"
              variant="destructive"
              disabled={submitDisabled}
              loading={isPending}
            >
              Delete this list
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

export default RemoveList;
