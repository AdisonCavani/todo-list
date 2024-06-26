import Footer from "@components/home/footer";
import Header from "@components/home/header";
import { auth } from "@lib/auth";
import type { MenuEntry } from "@lib/types";
import type { PropsWithChildren } from "react";

const menuEntries: MenuEntry[] = [
  { name: "Changelog", href: "/changelog" },
  { name: "Privacy", href: "/privacy" },
  { name: "Terms of Service", href: "/terms-of-service" },
];

async function Layout({ children }: PropsWithChildren) {
  const { user } = await auth();

  return (
    <>
      <Header menuEntries={menuEntries} session={user} />
      {children}
      <Footer menuEntries={menuEntries} />
    </>
  );
}

export default Layout;
