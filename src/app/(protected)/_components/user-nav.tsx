"use client";
import { LogoutButton } from "@/src/components/auth/logout-button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ExitIcon } from "@radix-ui/react-icons";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
export function UserNav() {
  const menuItems = [
    { label: "Dashboard", href: "/dashboard/overview", shortcut: "⇧⌘D" },
    { label: "Profile", href: "/dashboard/profile", shortcut: "⇧⌘P" },
  ];

  const { data: session } = useSession();
  if (session) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="size-10">
              <AvatarImage
                src={session.user?.image ?? ""}
                alt={session.user?.name ?? ""}
              />
              <AvatarFallback>{session.user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user?.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            {menuItems.map((item) => (
              <DropdownMenuItem
                key={item.label}
                className="p-0 hover:bg-gray-100"
              >
                <Link
                  href={item.href}
                  className="flex h-full w-full items-center justify-between p-2"
                >
                  {item.label}
                  <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut>
                </Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="p-2 font-semibold hover:bg-gray-100"
          >
            <LogoutButton>
              <div className="flex items-center gap-2">
                <ExitIcon className="h-5 w-5" />
                Logout
              </div>
            </LogoutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
