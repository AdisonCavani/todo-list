import LoginButtons from "@components/auth/login-buttons";
import SessionExpired from "@components/auth/session-expired";
import { authOptions } from "@lib/auth";
import { cn } from "@lib/utils";
import { IconChecklist, IconChevronLeft } from "@tabler/icons-react";
import { buttonVariants } from "@ui/button";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign in",
};

async function Page() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/app");

  return (
    <main className="mx-auto flex h-screen w-screen flex-col items-center justify-center px-6">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute left-4 top-4 md:left-8 md:top-8"
        )}
      >
        <IconChevronLeft size={18} />
        Back
      </Link>

      <div className="mx-auto flex w-full flex-col justify-center space-y-6 xs:w-80">
        <div className="flex flex-col space-y-2 text-center">
          <IconChecklist className="mx-auto h-6 w-6" />
          <SessionExpired />
        </div>

        <hr className="w-full border-neutral-300 dark:border-neutral-500" />

        <LoginButtons />
      </div>
    </main>
  );
}

export default Page;
