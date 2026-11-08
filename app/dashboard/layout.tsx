import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { requireAuth } from "@/services/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuth();

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
          <SidebarTrigger className="size-8 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground" />
          <div className="h-5 w-px bg-border" aria-hidden="true" />
          <Badge
            variant="outline"
            className="hidden h-6 border-primary/25 bg-primary/5 capitalize text-[0.7rem] font-semibold text-accent-foreground sm:inline-flex"
          >
            {user.role}
          </Badge>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground lg:block">
              Welcome back,{" "}
              <span className="font-semibold text-foreground">{user.name}</span>
            </span>
            <Avatar name={user.name} className="size-8 border border-border bg-card" />
          </div>
        </header>
        <div className="flex-1 p-5 w-full max-w-[1440px] mx-auto sm:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
