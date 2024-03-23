import MobileNav from "@components/app/mobile-nav";
import SideNav from "@components/app/side-nav";
import { TRPCReactProvider } from "@lib/trpc/react";
import { api } from "@lib/trpc/server";
import { SessionProvider } from "next-auth/react";
import type { PropsWithChildren } from "react";

async function Layout({ children }: PropsWithChildren) {
  const response = await api.list.get();

  return (
    <main className="flex grow flex-row">
      <SessionProvider>
        <TRPCReactProvider>
          <SideNav initialLists={response} />
          <MobileNav initialLists={response} />

          {children}
        </TRPCReactProvider>
      </SessionProvider>
    </main>
  );
}

export default Layout;
