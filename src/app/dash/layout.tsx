import ProfileMenu from "@components/app/profile-menu";
import Link from "@components/router/link";
import lucia from "@lib/lucia";
import { twindConfig, type ColorRecordType } from "@lib/twind";
import { getGravatarUrl } from "@lib/utils";
import { IconChecklist } from "@tabler/icons-react";
import { buttonVariants } from "@ui/button";
import type { Viewport } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

export const metadata = {
  title: "App",
};

export const viewport: Viewport = {
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
  const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) redirect("/auth");

  const { user, session } = await lucia.validateSession(sessionId);

  if (!session) redirect("/auth");

  return (
    <>
      <header className="sticky top-0 z-20 mr-[calc(var(--removed-body-scroll-bar-size)*(-1))] flex w-[-webkit-fill-available] items-center justify-between border-b bg-blue-600 py-2 pl-4 pr-[calc(24px+var(--removed-body-scroll-bar-size,0px))] dark:bg-neutral-800">
        <div className="flex items-center gap-x-2">
          <Link
            href="/dash"
            prefetch={false}
            className={buttonVariants({
              variant: "link",
              className: "text-white",
            })}
          >
            <IconChecklist className="size-6" />
            <h1 className="select-none font-semibold">To Do</h1>
          </Link>
        </div>

        <ProfileMenu
          {...user!}
          avatar={await getGravatarUrl(user!.email, 30)}
        />
      </header>

      {children}
    </>
  );
}

export default Layout;
