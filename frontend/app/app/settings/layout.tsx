import SettingsNavigation from "@components/app/settings/nav";
import { cn } from "@lib/utils";
import type { PropsWithChildren } from "react";

function Layout({ children }: PropsWithChildren) {
  const css = cn("mx-auto w-full max-w-7xl px-6");

  return (
    <main className="flex h-full w-full grow flex-col py-8">
      <h2 className={cn("mb-12 mt-4 text-3xl font-medium", css)}>
        Personal Account Settings
      </h2>

      <hr className="w-full" />

      <div className={cn("flex flex-col gap-x-6 lg:flex-row", css)}>
        <SettingsNavigation />

        <div className="mt-8 flex w-full flex-col gap-y-8">{children}</div>
      </div>
    </main>
  );
}

export default Layout;
