"use client";

import Link from "@components/router/link";
import type { User } from "lucia";

type Props = {
  user: User | null;
};

function SignInButton({ user }: Props) {
  return (
    <Link
      href={user ? "/app" : "/auth"}
      className="flex h-8 w-[6.5rem] items-center justify-center text-wrap rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 text-sm font-medium"
    >
      {user ? "Open app" : "Sign in"}
    </Link>
  );
}

export default SignInButton;
