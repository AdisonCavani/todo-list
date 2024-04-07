import type { Meta, StoryFn } from "@storybook/react";
import Layout from "../layout";
import PrivacyPage from "./page.mdx";

export default {
  title: "Pages",
  component: PrivacyPage,
} as Meta<typeof PrivacyPage>;

export const Privacy: StoryFn = (props) => (
  <Layout>
    <PrivacyPage {...props} />
  </Layout>
);
