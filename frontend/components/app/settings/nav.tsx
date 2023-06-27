"use client";

import Link from "@components/router/link";
import { cn } from "@lib/utils";
import { IconChevronLeft } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import NavLink from "./nav-link";

function SettingsNavigation() {
  const path = usePathname();
  const hide = path !== "/app/settings";

  return (
    <>
      <aside
        className={cn(
          "sticky top-[72px] mt-8 hidden h-full w-full max-w-[16rem] flex-col lg:flex"
        )}
      >
        <NavLink href="/app/settings" altHref="/app/settings/general">
          General
        </NavLink>
        <NavLink href="/app/settings/profile">Profile</NavLink>
      </aside>

      <nav className={cn("flex flex-col lg:hidden", hide && "hidden")}>
        <Link href="/app/settings/general" className="border-b py-6">
          General
        </Link>
        <Link href="/app/settings/profile" className="border-b py-6">
          Profile
        </Link>
      </nav>

      {hide && (
        <Link
          href="/app/settings"
          className={cn(
            "-mx-6 flex items-center gap-x-2 border-b p-6 font-semibold lg:hidden"
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
