"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
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
} from "@ui/dropdown-menu";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";

function ProfileMenu({ firstName, lastName, email, image }: User) {
  const { setTheme } = useTheme();
  const initials = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full hover:bg-transparent"
        >
          <Avatar>
            <AvatarImage src={image ?? undefined} alt="User avatar" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={12}>
        <DropdownMenuItem asChild alignLeft>
          <Link className="flex-col" href="/app/settings/profile">
            <p className="font-medium">
              {firstName} {lastName}
            </p>
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
        <DropdownMenuItem
          onClick={() =>
            signOut({
              callbackUrl: "/",
            })
          }
        >
          <IconLogout size={16} />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileMenu;
