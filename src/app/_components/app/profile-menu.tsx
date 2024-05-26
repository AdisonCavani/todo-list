"use client";

import Link from "@components/router/link";
import {
  IconDeviceLaptop,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@ui/dropdown-menu";
import type { User } from "lucia";
import { useTheme } from "next-themes";
import { logout } from "./auth";

interface Props extends User {
  avatar: string;
}

function ProfileMenu({ avatar, email }: Props) {
  const name = "Adrian Środoń";

  const { setTheme } = useTheme();
  const initials =
    (name?.split(" ")?.[0]?.[0] ?? "") + (name?.split(" ")?.[1]?.[0] ?? "");

  return (
    <div className="flex flex-row items-center gap-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="size-8 rounded-full hover:bg-transparent"
          >
            <Avatar>
              <AvatarImage src={avatar} alt="User avatar" />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" sideOffset={12}>
          <DropdownMenuItem asChild alignLeft>
            <Link className="flex-col" href="/app/settings/profile">
              <p className="font-medium">{name}</p>
              <p className="text-muted-foreground">{email}</p>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <IconSun size={16} />
              Theme
            </DropdownMenuSubTrigger>

            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  <IconSun size={16} />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  <IconMoon size={16} />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  <IconDeviceLaptop size={16} />
                  System
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem asChild>
            <Link href="/app/settings">
              <IconSettings size={16} />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <form action={logout}>
        <Button type="submit" variant="ghost" size="sm">
          <IconLogout size={16} />
        </Button>
      </form>
    </div>
  );
}

export default ProfileMenu;
