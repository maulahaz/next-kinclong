import { requireAuth } from "@/services/auth";
import { getAllPackages } from "@/services/packages";
import { PackagesClientPage } from "./client-page";
import { redirect } from "next/navigation";

export default async function PackagesPage() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const packages = await getAllPackages();

  return <PackagesClientPage packages={packages} />;
}
