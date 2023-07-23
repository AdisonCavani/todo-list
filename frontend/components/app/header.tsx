import Link from "@components/router/link";
import { auth } from "@lib/auth";
import { IconChecklist } from "@tabler/icons-react";
import { buttonVariants } from "@ui/button";
import type { LangDictionary } from "dictionaries";
import ProfileMenu from "./profile-menu";

type Props = {
  locale: LangDictionary;
};

async function Header({ locale }: Props) {
  const session = await auth();

  return (
    <header className="sticky top-0 z-10 flex w-full items-center justify-between border-b bg-blue-600 px-4 py-2 dark:bg-neutral-800">
      <Link
        href="/app"
        prefetch={false}
        className={buttonVariants({ variant: "link", className: "text-white" })}
      >
        <IconChecklist className="h-6 w-6" />
        <h1 className="select-none font-semibold">To Do</h1>
      </Link>
      <ProfileMenu locale={locale} user={session.user} />
    </header>
  );
}

export default Header;
