"use client";

import type { MenuEntry } from "@lib/types";
import { IconMenu } from "@tabler/icons-react";
import { useState } from "react";
import HeaderLink from "./header-link";

type Props = {
  menuEntries: MenuEntry[];
};

function MobileMenu({ menuEntries }: Props) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
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

      {open && (
        <ul className="absolute left-0 top-12 flex min-h-[calc(100vh-3rem)] w-full flex-col bg-neutral-900 px-8 pb-6 text-sm sm:hidden">
          {menuEntries.map((entry, index) => (
            <HeaderLink
              key={index}
              {...entry}
              className="flex h-12 items-center border-b border-neutral-800"
              onClick={() => setOpen((prev) => !prev)}
            />
          ))}
        </ul>
      )}
    </>
  );
}

export default MobileMenu;
