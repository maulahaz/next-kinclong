import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
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
      <main className="flex-1 flex flex-col min-h-screen bg-secondary/20">
        <header className="h-16 flex items-center border-b border-border bg-background px-4 bg-white/80 backdrop-blur-md sticky top-0 z-10 shadow-sm">
          <SidebarTrigger className="text-primary hover:bg-primary/10" />
          <h1 className="ml-4 text-foreground font-semibold">
            Hello, {user.name}
          </h1>
        </header>
        <div className="flex-1 p-6 sm:p-8 max-w-[1400px] w-full mx-auto">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
