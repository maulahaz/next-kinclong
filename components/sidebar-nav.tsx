"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Users,
  Car,
  FileText,
  CircleCheckBig,
  LayoutDashboard,
  Settings,
  Package,
  Sparkles,
  ClipboardList,
  BarChart3,
  UserRound,
} from "lucide-react";
import * as React from "react";

export type NavItem = {
  title: string;
  url: string;
  /** Icon name resolved on the client — functions can't cross the RSC boundary. */
  icon: string;
};

const iconRegistry: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  BarChart3,
  Users,
  Car,
  FileText,
  Package,
  Sparkles,
  ClipboardList,
  CircleCheckBig,
  Settings,
  UserRound,
};

function resolveIcon(name: string): React.ComponentType<{ className?: string }> {
  return iconRegistry[name] ?? CircleCheckBig;
}

export function SidebarNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => {
        const url = item.url;
        // Exact match for /dashboard, prefix match for sub-routes.
        const isActive =
          url === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(url);

        const Icon = resolveIcon(item.icon);

        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              isActive={isActive}
              render={<Link href={url} />}
              className="h-9.5 group-data-[collapsible=icon]:size-9! gap-2.5 rounded-lg px-2.5"
            >
              <Icon className="size-4.5 shrink-0" />
              <span className="font-medium">{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}

