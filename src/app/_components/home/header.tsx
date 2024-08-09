"use client";

import Link from "@components/router/link";
import type { MenuEntry } from "@lib/types";
import { cn } from "@lib/utils";
import styles from "@styles/header.module.css";
import { IconChecklist, IconMenu } from "@tabler/icons-react";
import { useState } from "react";
import HeaderLink from "./header-link";
import MobileMenu from "./mobile-menu";

type Props = {
  menuEntries: MenuEntry[];
  session: any | null;
};

function Header({ menuEntries, session }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="sticky inset-0 z-10 flex h-12">
      <div className={styles.overlay} />
      <nav className="relative z-50 mx-auto w-full max-w-7xl">
        <ul
          className={cn(
            "relative flex h-full items-center gap-x-6 px-8 text-sm  font-semibold",
            "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10",
          )}
        >
          <li>
            <Link
              href="/"
              prefetch={false}
              className="flex items-center gap-x-1"
            >
              <IconChecklist size={20} />
              <span className="select-none">To Do</span>
            </Link>
          </li>
          {menuEntries.map((entry, index) => (
            <HeaderLink key={index} {...entry} className="hidden sm:block" />
          ))}

          <li className="ml-auto">
            <Link
              href={session ? "/dash" : "/auth"}
              className="flex h-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 text-sm font-medium"
            >
              {session ? "Open app" : "Sign in"}
            </Link>
          </li>
          <li className="flex sm:hidden">
            <button
              aria-label="Toggle mobile menu"
              onClick={() => {
                setOpen((prev) => !prev);
              }}
            >
              <IconMenu />
            </button>
          </li>
        </ul>

        {open && (
          <MobileMenu
            menuEntries={menuEntries}
            onClick={() => setOpen(false)}
          />
        )}
      </nav>
    </header>
  );
}

export default Header;
