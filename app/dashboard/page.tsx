import { requireAuth } from "@/services/auth";
import { getAdminStats } from "@/services/admin";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, Users, FileText, CheckCircle2, Clock } from "lucide-react";

export default async function DashboardPage() {
  const user = await requireAuth();

  let adminStats = null;
  if (user.role === "admin") {
    adminStats = await getAdminStats();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome back, {user.name}. Here is your quick overview.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Universal Role Card */}
        <Card className="border-primary/20 shadow-sm bg-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Role</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize text-primary">{user.role}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Active permission tier
            </p>
          </CardContent>
        </Card>

        {/* Admin Specific Cards */}
        {user.role === "admin" && adminStats && (
          <>
            <Card className="border-primary/20 shadow-sm bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{adminStats.totalCustomers}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registered in the platform
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-sm bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
                <FileText className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{adminStats.activeContracts}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Currently running packages
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 shadow-sm bg-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Queue Status</CardTitle>
                <Clock className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{adminStats.pendingWashes} <span className="text-sm font-normal text-muted-foreground">pending</span></div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                 <CheckCircle2 className="w-3 h-3 text-primary" /> {adminStats.completedWashes} fully completed
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
