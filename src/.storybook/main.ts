import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: ["../stories/**/*.stories.@(ts|tsx)", "../app/**/*.stories.tsx"],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/nextjs",
    options: {
      strictMode: true,
    },
  },
  typescript: {
    reactDocgen: "react-docgen-typescript",
  },
  features: {
    experimentalRSC: true,
  },
};
export default config;
