import type { Meta, StoryFn } from "@storybook/react";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

export default {
  title: "@ui/Tooltip",
  component: Tooltip,
} as Meta<typeof Tooltip>;

export const Default: StoryFn<typeof Tooltip> = (props) => (
  <TooltipProvider>
    <Tooltip {...props}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);
