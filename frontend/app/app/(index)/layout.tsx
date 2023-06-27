import type { PropsWithChildren } from "react";

function Layout({ children }: PropsWithChildren) {
  return (
    <main className="flex h-full w-full grow flex-col px-6 py-8">
      {children}
    </main>
  );
}

export default Layout;
