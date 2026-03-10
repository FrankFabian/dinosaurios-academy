"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ClipboardCheck, Layers3, LucideIcon, MapPin, Shield, Users } from "lucide-react";

type Role = "ADMIN" | "STAFF" | "COACH";

type NavItem = {
    label: string;
    href: string;
    roles: Role[];
    icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
    { label: "Attendance", href: "/dashboard/attendance", roles: ["ADMIN", "STAFF", "COACH"], icon: ClipboardCheck },
    { label: "Students", href: "/dashboard/students", roles: ["ADMIN", "STAFF"], icon: Users },
    { label: "Locations", href: "/dashboard/locations", roles: ["ADMIN", "STAFF"], icon: MapPin },
    { label: "Groups", href: "/dashboard/groups", roles: ["ADMIN", "STAFF"], icon: Layers3 },
    { label: "Admin", href: "/dashboard/admin", roles: ["ADMIN"], icon: Shield },
];


function setCookie(name: string, value: string) {
    document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * 180}`;
}

export function DashboardSidebar({
    role,
    initialCollapsed,
    showCollapseToggle = true,
    embedded = false,
}: {
    role: Role;
    initialCollapsed: boolean;
    showCollapseToggle?: boolean;
    embedded?: boolean;
}) {

    const pathname = usePathname();
    const [collapsed, setCollapsed] = React.useState(initialCollapsed);

    const items = NAV_ITEMS.filter((i) => i.roles.includes(role));

    function toggle() {
        setCollapsed((v) => {
            const next = !v;
            setCookie("da_sidebar", next ? "1" : "0");
            return next;
        });
    }

    return (
        <div
            className={cn(
                "text-zinc-100 bg-zinc-950",
                embedded ? "h-full w-full border-0" : cn(
                    "h-dvh border-r border-white/10",
                    "transition-[width] duration-200 ease-out",
                    collapsed ? "w-19" : "w-70"
                )
            )}
        >
            <div className={cn("flex items-center justify-between px-4 py-4", collapsed && "px-3")}>
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30">
                        <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    </span>

                    {!collapsed && (
                        <div className="leading-tight">
                            <div className="text-sm font-semibold tracking-tight">Dinosaurios</div>
                            <div className="text-xs text-zinc-400">Academy Dashboard</div>
                        </div>
                    )}
                </Link>

                {showCollapseToggle ? (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={toggle}
                        className={cn("text-zinc-100 hover:bg-white/10 hover:text-white")}
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                        title={collapsed ? "Expand" : "Collapse"}
                    >
                        {collapsed ? (
                            <ChevronRight className="h-4 w-4" />
                        ) : (
                            <ChevronLeft className="h-4 w-4" />
                        )}

                    </Button>
                ) : null}

            </div>

            <Separator className="bg-white/10" />

            <nav className={cn("px-2 py-3", collapsed && "px-1")}>
                <ul className="space-y-1">
                    {items.map((item) => {
                        const isActive = pathname === item.href || (pathname?.startsWith(item.href + "/") ?? false);
                        const Icon = item.icon;

                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "relative group flex items-center gap-3 rounded-md px-3 py-2 text-sm",
                                        "transition-colors",
                                        isActive
                                            ? "bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/20"
                                            : "text-zinc-200 hover:bg-white/10 hover:text-white",
                                        collapsed && "justify-center px-2"
                                    )}

                                    title={collapsed ? item.label : undefined}
                                >
                                    {isActive && (<span className="absolute left-0 top-1/2 h-6 w-0.75 -translate-y-1/2 rounded-r bg-emerald-400" />)}

                                    <span
                                        className={cn(
                                            "flex h-9 w-9 items-center justify-center rounded-md",
                                            isActive ? "bg-emerald-500/10 text-emerald-200" : "bg-white/5 text-zinc-200"
                                        )}
                                    >
                                        <Icon className="h-4 w-4" />
                                    </span>


                                    {!collapsed && <span className="truncate">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}
