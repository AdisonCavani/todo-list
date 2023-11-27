import MobileNav from "@components/app/mobile-nav";
import SideNav from "@components/app/side-nav";
import AuthWrapper from "@components/auth-wrapper";
import ReactQueryWrapper from "@components/react-query-wrapper";
import { lists } from "@db/schema";
import { db } from "@db/sql";
import { auth } from "@lib/auth";
import { eq } from "drizzle-orm";
import type { PropsWithChildren } from "react";

async function Layout({ children }: PropsWithChildren) {
  const session = await auth();
  const response = await db
    .select()
    .from(lists)
    .where(eq(lists.userId, session!.user.id));

  return (
    <main className="flex grow flex-row">
      <AuthWrapper>
        <ReactQueryWrapper>
          <SideNav initialLists={response} />
          <MobileNav initialLists={response} />

          {children}
        </ReactQueryWrapper>
      </AuthWrapper>
    </main>
  );
}

export default Layout;
