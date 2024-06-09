import Link from "@components/router/link";
import { Button } from "@components/ui/button";
import type { MenuEntry } from "@lib/types";
import { cn } from "@lib/utils";
import styles from "@styles/header.module.css";
import { IconChecklist } from "@tabler/icons-react";
import { Suspense } from "react";
import HeaderLink from "./header-link";
import MobileMenu from "./mobile-menu";
import SignInWrapper from "./sign-in-wrapper";

type Props = {
  menuEntries: MenuEntry[];
};

function Header({ menuEntries }: Props) {
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
            <Suspense
              fallback={
                <Button
                  loading
                  className="flex h-8 w-[6.5rem] rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-4 text-sm font-medium text-white"
                />
              }
            >
              <SignInWrapper />
            </Suspense>
          </li>

          <MobileMenu menuEntries={menuEntries} />
        </ul>
      </nav>
    </header>
  );
}

export default Header;
