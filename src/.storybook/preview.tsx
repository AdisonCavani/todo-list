import type { Preview } from "@storybook/react";
import "@styles/globals.css";
import { ThemeProvider } from "next-themes";
import React from "react";
import { fontInter } from "../lib/utils";
import Theme from "./theme";

document.body.classList.add("font-sans");
document.body.classList.add("antialiased");
document.body.classList.add(fontInter.variable);

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    controls: {
      matchers: {
        date: /Date$/,
      },
    },
    options: {
      storySort: (a, b) =>
        a.id === b.id
          ? 0
          : a.id.localeCompare(b.id, undefined, { numeric: true }),
    },
  },
};

export default preview;

export const globalTypes = {
  theme: {
    name: "Theme",
    description: "Global theme for components",
    defaultValue: "light",
    toolbar: {
      items: [
        { title: "Light", value: "light", icon: "lightning" },
        { title: "Dark", value: "dark", icon: "lightningoff" },
      ],
    },
  },
};

export const decorators = [
  (Story, { globals }) => (
    <ThemeProvider attribute="class">
      <Theme theme={globals.theme ?? "dark"} />
      <Story />
    </ThemeProvider>
  ),
];
