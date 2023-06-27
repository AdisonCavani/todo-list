import type { Preview } from "@storybook/react";
import "@styles/globals.css";
import { ThemeProvider } from "next-themes";
import React from "react";
import { fontInter } from "../lib/font";
import Theme from "./theme";

document.body.classList.add("font-sans");
document.body.classList.add("antialiased");
document.body.classList.add(fontInter.variable);

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        date: /Date$/,
      },
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
    <ThemeProvider>
      <Theme theme={globals.theme ?? "light"} />
      <Story />
    </ThemeProvider>
  ),
];
