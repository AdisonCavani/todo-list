import type { Meta, StoryFn } from "@storybook/react";
import { IconBrandGithub } from "@tabler/icons-react";
import { Button } from "@ui/button";

export default {
  title: "Button",
  component: Button,
  decorators: [
    (Story) => (
      <div className="flex gap-x-3">
        <Story />
      </div>
    ),
  ],
  args: {
    children: "Button",
  },
} as Meta<typeof Button>;

export const Default: StoryFn<typeof Button> = (props) => <Button {...props} />;

export const Colors: StoryFn<typeof Button> = (props) => (
  <>
    <Button {...props} variant="default" />
    <Button {...props} variant="blue" />
    <Button {...props} variant="destructive" />
    <Button {...props} variant="ghost" />
    <Button {...props} variant="link" />
    <Button {...props} variant="outline" />
    <Button {...props} variant="subtle" />
  </>
);

export const Sizes: StoryFn<typeof Button> = (props) => (
  <>
    <Button {...props} size="xxs" />
    <Button {...props} size="xs" />
    <Button {...props} size="sm" />
    <Button {...props} size="default" />
    <Button {...props} size="lg" />
  </>
);

export const Loading: StoryFn<typeof Button> = (props) => (
  <Button {...props} loading />
);
export const Disabled: StoryFn<typeof Button> = (props) => (
  <Button {...props} disabled />
);
export const WithIcon: StoryFn<typeof Button> = (props) => (
  <Button {...props} icon={<IconBrandGithub size={18} />} />
);
