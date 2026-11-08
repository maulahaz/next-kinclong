import { requireAuth } from "@/services/auth";
import { getPendingTasks } from "@/services/washes";
import { TasksClientPage } from "./client-page";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";

export default async function TasksPage() {
  const user = await requireAuth();

  // Technically Admin handles tasks too in an emergency or we restrict to Staff?
  if (user.role === "customer") {
    redirect("/dashboard");
  }

  const tasks = await getPendingTasks();

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Tasks"
        description="View and complete wash requests assigned to you today."
        actions={
          <span className="rounded-full bg-warning/12 px-3 py-1 text-xs font-semibold text-warning">
            {tasks.length} pending
          </span>
        }
      />

      <TasksClientPage tasks={tasks} />
    </div>
  );
}
