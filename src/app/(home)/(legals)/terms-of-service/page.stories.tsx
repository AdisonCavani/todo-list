import type { Meta, StoryFn } from "@storybook/react";
import Layout from "../layout";
import TermsOfServicePage from "./page.mdx";

export default {
  title: "Pages",
  component: TermsOfServicePage,
} as Meta<typeof TermsOfServicePage>;

export const TermsOfService: StoryFn = (props) => (
  <Layout>
    <TermsOfServicePage {...props} />
  </Layout>
);
