import { toast } from "@lib/use-toast";
import type { Meta, StoryFn } from "@storybook/react";
import { Button } from "./button";
import { Toast, ToastAction } from "./toast";
import { Toaster } from "./toaster";

export default {
  title: "@ui/Toast",
  component: Toast,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} as Meta<typeof Toast>;

export const Default: StoryFn<typeof Toast> = () => (
  <Button
    variant="outline"
    onClick={() => {
      toast({
        title: "Scheduled: Catch up ",
        description: "Friday, February 10, 2023 at 5:57 PM",
        action: <ToastAction altText="Goto schedule to undo">Undo</ToastAction>,
      });
    }}
  >
    Add to calendar
  </Button>
);
