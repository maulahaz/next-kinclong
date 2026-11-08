import { requireAuth } from "@/services/auth";
import { getCustomerContracts } from "@/services/contracts";
import { MyContractsClientPage } from "./client-page";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";

export default async function MyContractsPage() {
  const user = await requireAuth();

  if (user.role !== "customer") {
    // Redirect non-customers away from the tracker
    redirect("/dashboard");
  }

  const contracts = await getCustomerContracts(user.id);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Contracts"
        description="Track your remaining wash quotas across all packages and view wash evidence."
        actions={
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {contracts.length} package{contracts.length === 1 ? "" : "s"}
          </span>
        }
      />

      <MyContractsClientPage contracts={contracts} />
    </div>
  );
}
