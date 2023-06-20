import Footer from "@components/home/footer";
import Header from "@components/home/header";
import { auth } from "@lib/auth";
import type { PropsWithChildren } from "react";

async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <>
      <Header session={session} />
      {children}
      <Footer />
    </>
  );
}

export default Layout;
