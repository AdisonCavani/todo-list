"use client";

import Link from "@components/router/link";
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
import type { LangDictionary } from "dictionaries";
import type { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";

type Props = {
  locale: LangDictionary;
  user: User;
};

function ProfileMenu({
  locale,
  user: { firstName, lastName, email, image },
}: Props) {
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
            <AvatarImage
              src={image ?? undefined}
              alt={locale.app.profileMenu.avatar}
            />
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
            {locale.app.profileMenu.theme.title}
          </DropdownMenuSubTrigger>

          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <IconSun size={16} />
                {locale.app.profileMenu.theme.light}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <IconMoon size={16} />
                {locale.app.profileMenu.theme.dark}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <IconDeviceLaptop size={16} />
                {locale.app.profileMenu.theme.system}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuItem asChild>
          <Link href="/app/settings">
            <IconSettings size={16} />
            {locale.app.profileMenu.settings}
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
          {locale.app.profileMenu.logout}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ProfileMenu;
