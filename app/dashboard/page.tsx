import { requireAuth } from "@/services/auth";
import { getDashboardOverview } from "@/services/admin";
import { getPendingTasks } from "@/services/washes";
import { getCustomerContracts } from "@/services/contracts";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DonutChart, BarChart, RingProgress } from "@/components/charts";
import {
  LayoutDashboard,
  Users,
  FileText,
  Clock,
  Car,
  Package,
  ClipboardList,
  CircleCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireAuth();

  if (user.role === "admin") {
    const overview = await getDashboardOverview();
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description={`Welcome back, ${user.name}. Here is how your car wash business is doing.`}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={Users} label="Total Customers" value={overview.totalCustomers.toLocaleString()} sub="Registered on the platform" />
          <StatCard icon={FileText} label="Active Contracts" value={overview.activeContracts.toLocaleString()} sub="Currently running packages" />
          <StatCard icon={Clock} label="Pending Washes" value={overview.pendingWashes.toLocaleString()} sub="Waiting in the queue" />
          <StatCard icon={Car} label="Registered Cars" value={overview.totalCars.toLocaleString()} sub={`${overview.totalStaff} staff on the team`} />
        </div>

        <div className="grid gap-4 lg:grid-cols-5">
          <Card className="lg:col-span-3">
            <CardHeader>
              <div>
                <CardTitle>Washes per month</CardTitle>
                <CardDescription>Total wash activity over the last 6 months</CardDescription>
              </div>
              <Badge variant="outline" className="hidden gap-1.5 border-primary/25 bg-primary/5 font-semibold text-accent-foreground sm:inline-flex">
                Last 6 months
              </Badge>
            </CardHeader>
            <CardContent>
              <BarChart data={overview.monthlyWashes} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <div>
                <CardTitle>Wash pipeline</CardTitle>
                <CardDescription>Live status of every wash</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <DonutChart
                size={132}
                centerValue={(overview.pendingWashes + overview.doneWashes + overview.acknowledgedWashes).toLocaleString()}
                centerLabel="washes"
                segments={[
                  { label: "Pending", value: overview.pendingWashes, color: "var(--chart-3)" },
                  { label: "Awaiting ack.", value: overview.doneWashes, color: "var(--chart-1)" },
                  { label: "Acknowledged", value: overview.acknowledgedWashes, color: "var(--chart-2)" },
                ]}
              />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <QuickLinkCard href="/dashboard/customers" icon={Users} title="Customer Accounts" description="Manage verified clients" />
          <QuickLinkCard href="/dashboard/contracts" icon={FileText} title="Contracts" description="Monitor wash progress" />
          <QuickLinkCard href="/dashboard/packages" icon={Package} title="Service Packages" description={`${overview.totalPackages} packages configured`} />
          <QuickLinkCard href="/dashboard/reports" icon={ClipboardList} title="Reports" description="Operations at a glance" />
        </div>
      </div>
    );
  }

  if (user.role === "staff") {
    const tasks = await getPendingTasks();
    return (
      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description={`Welcome back, ${user.name}. You have ${tasks.length} wash task${tasks.length === 1 ? "" : "s"} in the queue.`}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard icon={LayoutDashboard} label="Your Role" value="Staff" sub="Wash operations team" />
          <StatCard icon={Clock} label="Pending Tasks" value={tasks.length} sub="Washes waiting for you" />
          <StatCard icon={Car} label="In the Queue" value={new Set(tasks.map((t) => t.car.plateNumber)).size} sub="Unique cars to serve" />
        </div>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Up next</CardTitle>
              <CardDescription>Pending washes assigned to the queue</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {tasks.length === 0 ? (
              <div className="py-6">
                <div className="flex flex-col items-center gap-2 text-center">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary/10">
                    <CircleCheck className="size-5 text-primary" />
                  </span>
                  <p className="text-sm font-medium text-foreground">All caught up</p>
                  <p className="text-xs text-muted-foreground">No pending wash tasks right now.</p>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {tasks.slice(0, 5).map((task) => (
                  <li key={task.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <Car className="size-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {task.car.plateNumber}
                        <span className="ml-1.5 font-normal capitalize text-muted-foreground">· {task.type}</span>
                      </p>
                      <p className="truncate text-xs text-muted-foreground">{task.customer.name}</p>
                    </div>
                    <Link
                      href="/dashboard/tasks"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
                    >
                      Open <ArrowRight className="size-3.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  // Customer
  const contracts = await getCustomerContracts(user.id);
  const activeContracts = contracts.filter((c) => c.status === "active");
  const totalQuota = contracts.reduce((acc, c) => acc + c.totalWashes, 0);
  const usedQuota = contracts.reduce((acc, c) => acc + c.completedWashes, 0);
  const percent = totalQuota > 0 ? Math.round((usedQuota / totalQuota) * 100) : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user.name}. Track your packages and wash activity.`}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={FileText} label="My Packages" value={contracts.length.toLocaleString()} sub={`${activeContracts.length} active`} />
        <StatCard icon={CircleCheck} label="Washes Used" value={usedQuota.toLocaleString()} sub={`of ${totalQuota.toLocaleString()} total quota`} />
        <StatCard icon={Car} label="Remaining" value={Math.max(totalQuota - usedQuota, 0).toLocaleString()} sub="Washes left across packages" />
      </div>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Package usage</CardTitle>
            <CardDescription>How much of your wash quota is used</CardDescription>
          </div>
          <Badge variant="outline" className="hidden border-primary/25 bg-primary/5 font-semibold text-accent-foreground sm:inline-flex">
            {percent}% used
          </Badge>
        </CardHeader>
        <CardContent>
          {contracts.length === 0 ? (
            <EmptyState
              icon={FileText}
              title="No packages yet"
              description="You don't have any packages yet. Contact Kinclong to get set up with your first wash package."
            />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2">
              {contracts.slice(0, 6).map((contract) => {
                const p = contract.totalWashes > 0 ? Math.round((contract.completedWashes / contract.totalWashes) * 100) : 0;
                return (
                  <li
                    key={contract.id}
                    className="flex items-center gap-4 rounded-xl border border-border bg-background/60 p-4"
                  >
                    <RingProgress percent={p} size={64} thickness={6}>
                      <span className="text-xs font-bold tabular-nums">{Math.round(p)}%</span>
                    </RingProgress>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{contract.packageType}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {contract.car.plateNumber} · {contract.completedWashes}/{contract.totalWashes} washes
                      </p>
                    </div>
                    <Link
                      href="/dashboard/my-contracts"
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      View
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function QuickLinkCard({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-card-hover"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">{title}</span>
        <span className="block truncate text-xs text-muted-foreground">{description}</span>
      </span>
      <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
    </Link>
  );
}
