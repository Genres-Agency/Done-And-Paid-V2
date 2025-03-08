import { Separator } from "@/src/components/ui/separator";
import { SidebarTrigger } from "@/src/components/ui/sidebar";
import React from "react";
import { UserNav } from "./user-nav";
import { Breadcrumbs } from "@/src/components/breadcrumbs";
import SearchInput from "@/src/components/search-input";
import { ThemeToggle } from "@/src/components/theme-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumbs />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <SearchInput />
          </div>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  );
}
