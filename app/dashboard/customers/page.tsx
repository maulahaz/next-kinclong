import { requireAuth } from "@/services/auth";
import { getAllCustomers } from "@/services/admin";
import { CustomersClientPage } from "./client-page";
import { redirect } from "next/navigation";

export default async function CustomersPage() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const customers = await getAllCustomers();

  return <CustomersClientPage customers={customers} />;
}
