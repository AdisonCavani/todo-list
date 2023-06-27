import { createHash } from "crypto";
import Link from "@components/router/link";
import { auth } from "@lib/auth";
import { IconChecklist } from "@tabler/icons-react";
import { buttonVariants } from "@ui/button";
import ProfileMenu from "./profile-menu";

async function Header() {
  const session = await auth();
  const user = session.user;

  user.image ??= `https://www.gravatar.com/avatar/${createHash("md5")
    .update(user.email!)
    .digest("hex")}`;

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
      <ProfileMenu {...user} />
    </header>
  );
}

export default Header;
