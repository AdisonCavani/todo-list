import Footer from "@components/home/footer";
import Header from "@components/home/header";
import type { MenuEntry } from "@lib/types";
import { type PropsWithChildren } from "react";

export const runtime = "nodejs";
export const experimental_ppr = true;

const menuEntries: MenuEntry[] = [
  { name: "Changelog", href: "/changelog" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms-of-service" },
];

function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header menuEntries={menuEntries} />
      {children}
      <Footer menuEntries={menuEntries} />
    </>
  );
}

export default Layout;
