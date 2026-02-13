"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu, LogOut, User } from "lucide-react";
import { DashboardSidebar } from "@/components/organisms/dashboard-sidebar";

type Role = "ADMIN" | "STAFF" | "COACH";

function initialsFromRole(role: Role) {
  if (role === "ADMIN") return "AD";
  if (role === "COACH") return "CO";
  return "ST";
}

export function DashboardTopbar({ role }: { role: Role }) {
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onResize = () => {
      // md = 768px en Tailwind por defecto
      if (window.innerWidth >= 768) setOpen(false);
    };

    window.addEventListener("resize", onResize);
    onResize(); // corre una vez al montar
    return () => window.removeEventListener("resize", onResize);
  }, []);


  return (
    <header
      className={cn(
        "sticky top-0 z-10",
        "border-b border-white/10",
        "bg-zinc-950"
      )}
    >
      <div className={cn("flex h-17 w-full items-center", "px-4 md:px-6")}>
        {/* LEFT (mobile only): hamburger + brand */}
        <div className={cn("flex items-center gap-3 md:hidden")}>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "text-zinc-100",
                  "hover:bg-white/10 hover:text-white",
                  "focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                )}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>

            <SheetContent side="left" className={cn("w-75 p-0 bg-zinc-950")}>
              <SheetHeader className="px-4 py-4">
                <SheetTitle className="text-left text-sm font-semibold text-zinc-100">
                  Menu
                </SheetTitle>
              </SheetHeader>

              <div onClick={() => setOpen(false)}>
                <DashboardSidebar
                  role={role}
                  initialCollapsed={false}
                  showCollapseToggle={false}
                  embedded
                />
              </div>
            </SheetContent>
          </Sheet>

          <div className={cn("flex items-center gap-2")}>
            <span
              className={cn(
                "inline-flex h-8 w-8 items-center justify-center rounded-lg",
                "bg-emerald-500/15 ring-1 ring-emerald-500/25"
              )}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight text-zinc-100">
                Dinosaurios
              </div>
              <div className="text-xs text-zinc-400">Academy Dashboard</div>
            </div>
          </div>
        </div>

        {/* LEFT (desktop only): status */}
        <div className={cn("hidden md:flex items-center gap-3 text-sm")}>
          <span
            className={cn(
              "h-2.5 w-2.5 rounded-full bg-emerald-500",
              "shadow-[0_0_18px_rgba(16,185,129,0.35)]"
            )}
          />
          <span className="text-zinc-400">Logged in as</span>
          <span
            className={cn(
              "inline-flex items-center rounded-full",
              "bg-emerald-500/10 text-emerald-200",
              "ring-1 ring-emerald-500/20",
              "px-2.5 py-1 text-xs font-medium tracking-wide"
            )}
          >
            {role}
          </span>
        </div>

        {/* SPACER: pushes avatar to the far right */}
        <div className="flex-1" />

        {/* RIGHT: avatar dropdown */}
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  "h-9 px-2",
                  "hover:bg-white/10",
                  "focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                )}
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="" alt="User" />
                  <AvatarFallback className="bg-white/10 text-zinc-100">
                    {initialsFromRole(role)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className={cn("w-48", "border-white/10 bg-zinc-950 text-zinc-100")}
            >
              <DropdownMenuLabel className="text-xs text-zinc-400">
                Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-white/10" />

              <DropdownMenuItem
                className="cursor-pointer text-emerald-200 focus:text-emerald-100"
                onClick={() => signOut()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
