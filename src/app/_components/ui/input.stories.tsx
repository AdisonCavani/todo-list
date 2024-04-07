import type { Meta, StoryFn } from "@storybook/react";
import { Input } from "./input";

export default {
  title: "@ui/Input",
  component: Input,
  args: {
    className: "w-48",
    placeholder: "John Doe",
  },
} as Meta<typeof Input>;

export const Default: StoryFn<typeof Input> = (props) => (
  <>
    <label htmlFor="name" className="mb-2 block text-sm font-medium">
      Name
    </label>
    <Input id="name" {...props} />
  </>
);
