import { requireAuth } from "@/services/auth";
import { getAllCars, getAllCustomers } from "@/services/admin";
import { CarsClientPage } from "./client-page";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default async function CarsPage() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const cars = await getAllCars();
  const customers = await getAllCustomers();

  return <CarsClientPage cars={cars} customers={customers} />;
}
