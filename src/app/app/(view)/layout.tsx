import MobileNav from "@components/app/mobile-nav";
import SideNav from "@components/app/side-nav";
import AuthWrapper from "@components/auth-wrapper";
import { TRPCReactProvider } from "@lib/trpc/react";
import { api } from "@lib/trpc/server";
import type { PropsWithChildren } from "react";

async function Layout({ children }: PropsWithChildren) {
  const response = await api.list.get();

  return (
    <main className="flex grow flex-row">
      <AuthWrapper>
        <TRPCReactProvider>
          <SideNav initialLists={response} />
          <MobileNav initialLists={response} />

          {children}
        </TRPCReactProvider>
      </AuthWrapper>
    </main>
  );
}

export default Layout;
