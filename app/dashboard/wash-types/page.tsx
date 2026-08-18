import { requireAuth } from "@/services/auth";
import { getAllWashTypes } from "@/services/washTypes";
import { WashTypesClientPage } from "./client-page";
import { redirect } from "next/navigation";

export default async function WashTypesPage() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const washTypes = await getAllWashTypes();

  return <WashTypesClientPage washTypes={washTypes} />;
}
