import { requireAuth } from "@/services/auth";
import { getAllCustomers } from "@/services/admin";
import { CustomersClientPage } from "./client-page";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";

export default async function CustomersPage() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const customers = await getAllCustomers();

  return <CustomersClientPage customers={customers} />;
}
