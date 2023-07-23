import type { MenuEntry } from "@lib/types";
import { cn } from "@lib/utils";
import HeaderLink from "./header-link";

type Props = {
  entries: MenuEntry[];
  onClick: () => void;
};

function MobileMenu({ entries, onClick }: Props) {
  const classes = cn("flex h-12 items-center border-b border-neutral-800");

  return (
    <ul className="absolute flex min-h-[calc(100vh-3rem)] w-full flex-col bg-neutral-900 px-8 pb-6 text-sm sm:hidden">
      {entries.map((entry, index) => (
        <HeaderLink
          key={index}
          {...entry}
          className={classes}
          onClick={onClick}
        />
      ))}
    </ul>
  );
}

export default MobileMenu;
