import { requireAuth } from "@/services/auth";
import { getPendingTasks } from "@/services/washes";
import { TasksClientPage } from "./client-page";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  const user = await requireAuth();

  // Technically Admin handles tasks too in an emergency or we restrict to Staff?
  if (user.role === "customer") {
    redirect("/dashboard");
  }

  const tasks = await getPendingTasks();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">My Tasks</h2>
        <p className="text-muted-foreground">
          View and complete wash requests assigned to you today.
        </p>
      </div>

      <TasksClientPage tasks={tasks} />
    </div>
  );
}
