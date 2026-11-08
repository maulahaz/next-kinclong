import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarFooter, SidebarSeparator } from "@/components/ui/sidebar";
import { SidebarNav, type NavItem } from "@/components/sidebar-nav";
import { Avatar } from "@/components/ui/avatar";
import { LogOut } from "lucide-react";
import { getSettings } from "@/services/settings";

type AppSidebarProps = {
  user: {
    name: string;
    email?: string | null;
    role: string;
  };
};

export async function AppSidebar({ user }: AppSidebarProps) {
  const settings = await getSettings();

  // Navigation groups based on roles
  const navGroups: { label: string; items: NavItem[] }[] = (
    {
      admin: [
        {
          label: "Overview",
          items: [
            { title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
            { title: "Reports", url: "/dashboard/reports", icon: "BarChart3" },
          ],
        },
        {
          label: "Management",
          items: [
            { title: "Customers", url: "/dashboard/customers", icon: "Users" },
            { title: "Cars", url: "/dashboard/cars", icon: "Car" },
            { title: "Contracts", url: "/dashboard/contracts", icon: "FileText" },
            { title: "Packages", url: "/dashboard/packages", icon: "Package" },
            { title: "Wash Types", url: "/dashboard/wash-types", icon: "Sparkles" },
            { title: "Staff", url: "/dashboard/staff", icon: "ClipboardList" },
          ],
        },
        {
          label: "System",
          items: [
            { title: "Settings", url: "/dashboard/settings", icon: "Settings" },
            { title: "User Profile", url: "/dashboard/profile", icon: "UserRound" },
          ],
        },
      ],
      staff: [
        {
          label: "Operations",
          items: [
            { title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
            { title: "My Tasks", url: "/dashboard/tasks", icon: "CircleCheckBig" },
          ],
        },
        {
          label: "Account",
          items: [
            { title: "My Profile", url: "/dashboard/profile", icon: "UserRound" },
          ],
        },
      ],
      customer: [
        {
          label: "Overview",
          items: [
            { title: "Dashboard", url: "/dashboard", icon: "LayoutDashboard" },
          ],
        },
        {
          label: "Account",
          items: [
            { title: "My Contracts", url: "/dashboard/my-contracts", icon: "FileText" },
            { title: "Account Profile", url: "/dashboard/profile", icon: "UserRound" },
          ],
        },
      ],
    } as Record<string, { label: string; items: NavItem[] }[]>
  )[user.role] ?? [];

  const menuGroups = navGroups;

  const appName = settings?.appName || "Kinclong";

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex-row items-center gap-3 border-b border-sidebar-border px-4 py-0">
        {settings?.companyIcon && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={settings.companyIcon}
            alt=""
            className="size-8 rounded-lg object-cover"
          />
        )}
        {!settings?.companyIcon && (
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground shadow-glow">
            K
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate text-[0.95rem] font-bold leading-tight tracking-tight text-foreground">
            {appName}
          </div>
          <div className="truncate text-[0.7rem] font-medium uppercase tracking-wider text-muted-foreground">
            Car Wash Manager
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-6 px-2 pt-4 group-data-[collapsible=icon]:pt-2">
        {menuGroups.map((group) => (
          <SidebarGroup key={group.label} className="p-0">
            <SidebarGroupLabel className="px-2 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground/80">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarNav items={group.items} />
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3">
        <div className="flex items-center gap-3 py-1">
          <Avatar name={user.name} className="size-9" />
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold text-foreground">
              {user.name}
            </div>
            <div className="truncate text-xs capitalize text-muted-foreground">
              {user.role} Account
            </div>
          </div>
        </div>
        <SidebarSeparator className="mx-0 bg-sidebar-border" />
        <form action="/api/auth/logout" method="POST">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="size-4" />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </button>
        </form>
      </SidebarFooter>
    </Sidebar>
  );
}
