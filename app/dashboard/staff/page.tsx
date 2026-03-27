import { requireAuth } from "@/services/auth";
import { getAllStaffs } from "@/services/staff";
import { redirect } from "next/navigation";
import { StaffClientPage } from "./client-page";

export default async function StaffPage() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const staffs = await getAllStaffs();

  return <StaffClientPage staffs={staffs} />;
}
