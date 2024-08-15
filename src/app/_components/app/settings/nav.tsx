"use client";

import Link from "@components/router/link";
import { cn } from "@lib/utils";
import { IconChevronLeft } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import NavLink from "./nav-link";

function SettingsNavigation() {
  const path = usePathname();
  const hide = path !== "/dash/settings";

  return (
    <>
      <aside
        className={cn(
          "sticky top-[72px] mt-8 hidden size-full max-w-64 flex-col lg:flex",
        )}
      >
        <NavLink href="/dash/settings" altHref="/dash/settings/general">
          General
        </NavLink>
        <NavLink href="/dash/settings/profile">Profile</NavLink>
      </aside>

      <nav className={cn("flex flex-col lg:hidden", hide && "hidden")}>
        <Link href="/dash/settings/general" className="border-b py-6">
          General
        </Link>
        <Link href="/dash/settings/profile" className="border-b py-6">
          Profile
        </Link>
      </nav>

      {hide && (
        <Link
          href="/dash/settings"
          className={cn(
            "-mx-3 flex items-center gap-x-2 border-b p-6 font-semibold sm:-mx-6 lg:hidden",
          )}
        >
          <IconChevronLeft size={20} />
          Account Settings
        </Link>
      )}
    </>
  );
}

export default SettingsNavigation;
