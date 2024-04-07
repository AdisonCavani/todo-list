import type { Meta, StoryFn } from "@storybook/react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

export default {
  title: "@ui/Avatar",
  component: Avatar,
  decorators: [
    (Story) => (
      <div className="flex gap-x-3">
        <Story />
      </div>
    ),
  ],
} as Meta<typeof Avatar>;

export const Default: StoryFn<typeof Avatar> = () => (
  <>
    <Avatar>
      <AvatarImage
        src="https://github.com/AdisonCavani.png"
        alt="Adison Cavani"
      />
      <AvatarFallback>AC</AvatarFallback>
    </Avatar>
    <Avatar>
      <AvatarFallback>AC</AvatarFallback>
    </Avatar>
  </>
);
