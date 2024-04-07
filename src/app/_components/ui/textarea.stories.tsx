import type { Meta, StoryFn } from "@storybook/react";
import { Textarea } from "./textarea";

export default {
  title: "@ui/Textarea",
  component: Textarea,
  args: {
    placeholder:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore, rerum? Sed deleniti, voluptates accusamus in recusandae perspiciatis molestias modi consectetur maiores fugiat veniam delectus, omnis architecto facere ex eligendi ut?",
  },
} as Meta<typeof Textarea>;

export const Default: StoryFn<typeof Textarea> = (props) => (
  <>
    <label htmlFor="description" className="mb-2 block text-sm font-medium">
      Description
    </label>
    <Textarea id="description" {...props} />
  </>
);
