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
import { useState } from "react";
import { logout } from "./auth";

interface Props extends User {
  avatar: string;
}

function ProfileMenu({ avatar, email, name }: Props) {
  const { setTheme } = useTheme();
  const initials =
    (name?.split(" ")?.[0]?.[0] ?? "") + (name?.split(" ")?.[1]?.[0] ?? "");
  const [logoutPending, setLogoutPending] = useState<boolean>(false);

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
            <Link className="flex-col" href="/dash/settings/profile">
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
            <Link href="/dash/settings">
              <IconSettings size={16} />
              Settings
            </Link>
          </DropdownMenuItem>

          <form action={logout} onSubmit={() => setLogoutPending(true)}>
            <DropdownMenuItem
              asChild
              onSelect={(event) => event.preventDefault()}
            >
              <Button
                type="submit"
                size="xs"
                variant="ghost"
                loading={logoutPending}
                loadingIconSize={16}
                icon={<IconLogout size={16} />}
                className="w-full select-none justify-normal font-normal hover:text-inherit focus-visible:ring-0"
              >
                Logout
              </Button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ProfileMenu;
