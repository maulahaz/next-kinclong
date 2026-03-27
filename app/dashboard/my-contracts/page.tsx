import { requireAuth } from "@/services/auth";
import { getCustomerContracts } from "@/services/contracts";
import { MyContractsClientPage } from "./client-page";
import { redirect } from "next/navigation";

export default async function MyContractsPage() {
  const user = await requireAuth();

  if (user.role !== "customer") {
    // Redirect non-customers away from the tracker
    redirect("/dashboard");
  }

  const contracts = await getCustomerContracts(user.id);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">My Contracts</h2>
        <p className="text-muted-foreground">
          Track your remaining wash quotas across all packages and view wash evidence.
        </p>
      </div>

      <MyContractsClientPage contracts={contracts} />
    </div>
  );
}
