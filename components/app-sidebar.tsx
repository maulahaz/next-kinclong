import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Users, Car, FileText, CheckSquare, BarChart, LogOut, LayoutDashboard, Settings, Package } from "lucide-react";
import { getSettings } from "@/services/settings";
type AppSidebarProps = {
  user: {
    name: string;
    email: string;
    role: "admin" | "staff" | "customer";
  };
};

export async function AppSidebar({ user }: AppSidebarProps) {
  const settings = await getSettings();

  // Navigation menus based on roles
  const navItems = {
    admin: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Customers", url: "/dashboard/customers", icon: Users },
      { title: "Cars", url: "/dashboard/cars", icon: Car },
      { title: "Packages", url: "/dashboard/packages", icon: Package },
      { title: "Contracts", url: "/dashboard/contracts", icon: FileText },
      { title: "Staff", url: "/dashboard/staff", icon: CheckSquare },
      { title: "Reports", url: "/dashboard/reports", icon: BarChart },
      { title: "Settings", url: "/dashboard/settings", icon: Settings },
      { title: "User Profile", url: "/dashboard/profile", icon: Users },
    ],
    staff: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "My Tasks", url: "/dashboard/tasks", icon: CheckSquare },
      { title: "My Profile", url: "/dashboard/profile", icon: Users },
    ],
    customer: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      // { title: "My Cars", url: "/dashboard/my-cars", icon: Car },
      { title: "My Contracts", url: "/dashboard/my-contracts", icon: FileText },
      { title: "Account Profile", url: "/dashboard/profile", icon: Users },
    ],
  };

  const menuItems = navItems[user.role] || [];

  return (
    <Sidebar>
      <SidebarHeader className="p-4 bg-primary text-primary-foreground font-bold tracking-tight text-xl h-16 flex items-center shadow-[0_4px_10px_rgba(46,213,115,0.15)] gap-3">
        {settings?.companyIcon && <img src={settings.companyIcon} alt="Icon" className="w-12 h-12 rounded bg-white/20 p-0.5" />}
        {!settings?.companyIcon && <div className="w-12 h-12 rounded bg-white/20 p-0.5 flex items-center justify-center text-lg">K</div>}
        <span className="truncate">{settings?.appName || "Kinclong"}</span>
      </SidebarHeader>
      <SidebarContent className="bg-background mt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground uppercase text-xs font-semibold tracking-wider">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton render={<a href={item.url} />} className="hover:bg-primary/10 hover:text-primary transition-colors data-[active=true]:bg-primary/15 data-[active=true]:text-primary data-[active=true]:font-semibold">
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-border p-4 bg-sidebar">
        <div className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-foreground truncate">{user.name}</span>
          <span className="text-xs text-muted-foreground capitalize">{user.role} Account</span>

          <form action="/api/auth/logout" method="POST" className="mt-4">
            <button className="flex w-full items-center gap-2 text-primary hover:text-primary-foreground hover:bg-primary p-2 rounded-md transition-all text-sm font-medium">
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
