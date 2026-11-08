import { requireAuth } from "@/services/auth";
import { getReportsData } from "@/services/admin";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, DonutChart } from "@/components/charts";
import { FileText, CircleCheck, Clock, XCircle } from "lucide-react";

export default async function ReportsPage() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const data = await getReportsData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Operational overview of contracts, washes, and popular packages."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FileText}
          label="Active Contracts"
          value={data.contracts.activeContracts.toLocaleString()}
          sub={`${data.contracts.completedContracts} completed · ${data.contracts.cancelledContracts} cancelled`}
        />
        <StatCard
          icon={Clock}
          label="Pending Washes"
          value={data.washes.pendingWashes.toLocaleString()}
          sub="Waiting in the queue"
        />
        <StatCard
          icon={CircleCheck}
          label="Acknowledged Washes"
          value={data.washes.acknowledgedWashes.toLocaleString()}
          sub={`${data.washes.doneWashes} awaiting customer approval`}
        />
        <StatCard
          icon={XCircle}
          label="Cancelled Contracts"
          value={data.contracts.cancelledContracts.toLocaleString()}
          sub="Lifetime total"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Wash volume</CardTitle>
              <CardDescription>Washes completed per month, last 6 months</CardDescription>
            </div>
            <Badge variant="outline" className="hidden border-primary/25 bg-primary/5 font-semibold text-accent-foreground sm:inline-flex">
              Monthly
            </Badge>
          </CardHeader>
          <CardContent>
            <BarChart data={data.monthlyWashes} height={180} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Wash pipeline</CardTitle>
              <CardDescription>Status distribution</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DonutChart
              size={132}
              centerValue={(
                data.washes.pendingWashes +
                data.washes.doneWashes +
                data.washes.acknowledgedWashes
              ).toLocaleString()}
              centerLabel="washes"
              segments={[
                { label: "Pending", value: data.washes.pendingWashes, color: "var(--chart-3)" },
                { label: "Awaiting ack.", value: data.washes.doneWashes, color: "var(--chart-1)" },
                { label: "Acknowledged", value: data.washes.acknowledgedWashes, color: "var(--chart-2)" },
              ]}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Top packages</CardTitle>
              <CardDescription>Most purchased packages by contract count</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {data.topPackages.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No contracts recorded yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {data.topPackages.map((pkg, index) => {
                  const maxCount = data.topPackages[0]?.count ?? 1;
                  return (
                    <li key={`${pkg.name}-${index}`} className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate font-medium text-foreground">{pkg.name}</span>
                        <span className="shrink-0 tabular-nums text-muted-foreground">
                          {pkg.count} contract{pkg.count === 1 ? "" : "s"}
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.max(Math.round((pkg.count / maxCount) * 100), 4)}%`,
                          }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div>
              <CardTitle>Wash types</CardTitle>
              <CardDescription>Inside washes vs outside washes</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <DonutChart
              size={132}
              centerValue={(
                data.washes.insideWashes + data.washes.outsideWashes
              ).toLocaleString()}
              centerLabel="washes"
              segments={[
                { label: "Inside wash", value: data.washes.insideWashes, color: "var(--chart-1)" },
                { label: "Outside wash", value: data.washes.outsideWashes, color: "var(--chart-3)" },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
