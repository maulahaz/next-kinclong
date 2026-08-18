import { requireAuth } from "@/services/auth";
import { getAllContracts, getAllCars } from "@/services/admin";
import { getAllPackages } from "@/services/packages";
import { ContractsClientPage } from "./client-page";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function ContractsPage() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const contracts = await getAllContracts();
  const cars = await getAllCars();
  const packages = await getAllPackages();

  return <ContractsClientPage contracts={contracts} cars={cars} packages={packages} />;
}
