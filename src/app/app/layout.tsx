import ProfileMenu from "@components/app/profile-menu";
import Link from "@components/router/link";
import { buttonVariants } from "@components/ui/button";
import { auth } from "@lib/auth";
import { twindConfig, type ColorRecordType } from "@lib/twind";
import { IconChecklist } from "@tabler/icons-react";
import { Toaster } from "@ui/toaster";
import type { PropsWithChildren } from "react";

export const metadata = {
  title: "App",
  themeColor: [
    {
      color: (twindConfig.colors.blue as ColorRecordType)[600],
      media: "(prefers-color-scheme: light)",
    },
    {
      color: (twindConfig.colors.neutral as ColorRecordType)[800],
      media: "(prefers-color-scheme: dark)",
    },
  ],
};

async function Layout({ children }: PropsWithChildren) {
  const session = await auth();

  return (
    <>
      <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b bg-blue-600 px-4 py-2 dark:bg-neutral-800">
        <div className="flex items-center gap-x-2">
          <Link
            href="/app"
            prefetch={false}
            className={buttonVariants({
              variant: "link",
              className: "text-white",
            })}
          >
            <IconChecklist className="h-6 w-6" />
            <h1 className="select-none font-semibold">To Do</h1>
          </Link>
        </div>

        <ProfileMenu {...session!.user} />
      </header>

      {children}

      <Toaster />
    </>
  );
}

export default Layout;
