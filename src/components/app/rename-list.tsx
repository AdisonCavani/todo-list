import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@components/ui/popover";
import { api } from "@lib/trpc/react";
import { toast } from "@lib/use-toast";
import { PopoverClose } from "@radix-ui/react-popover";
import { useState, type FormEventHandler, type PropsWithChildren } from "react";

type Props = {
  listId: string;
  listName: string;
};

function RenameList({ children, listId, listName }: PropsWithChildren<Props>) {
  const utils = api.useUtils();
  const { mutate, isPending } = api.list.update.useMutation({
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

  const handleOnSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    mutate({
      id: listId,
      name: name.trim(),
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent
        className="w-80"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">List name</h4>
            <p className="text-sm text-muted-foreground">
              Set new name for this list.
            </p>
          </div>
          <div className="grid gap-2">
            <form
              onSubmit={handleOnSubmit}
              className="grid grid-cols-3 items-center gap-4"
            >
              <Input
                onChange={(event) => setName(event.currentTarget.value)}
                placeholder="My projects"
                className="col-span-2 h-8"
              />

              <PopoverClose asChild>
                <Button
                  size="xs"
                  disabled={
                    name.trim().length === 0 || name.trim() === listName.trim()
                  }
                  loading={isPending}
                  type="submit"
                >
                  Save
                </Button>
              </PopoverClose>
            </form>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default RenameList;
