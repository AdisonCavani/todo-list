import type { PropsWithChildren } from "react";

function Layout({ children }: PropsWithChildren) {
  return (
    <section className="flex max-h-[calc(100dvh-57px)] w-full grow flex-col">
      {children}
    </section>
  );
}

export default Layout;
