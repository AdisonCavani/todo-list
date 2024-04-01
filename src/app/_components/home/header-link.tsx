"use client";

import Link from "@components/router/link";
import type { MenuEntry } from "@lib/types";
import { cn } from "@lib/utils";
import { usePathname } from "next/navigation";

function HeaderLink({
  name,
  href,
  className,
  onClick,
}: MenuEntry & { className: string; onClick?: () => void }) {
  const segment = usePathname();
  const isActive = segment === href;

  return (
    <li className={cn(className, !isActive && "text-neutral-300")}>
      <Link href={href} prefetch={false} onClick={onClick}>
        {name}
      </Link>
    </li>
  );
}

export default HeaderLink;
