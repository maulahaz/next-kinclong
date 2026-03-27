import { requireAuth } from "@/services/auth";
import { getSettings } from "@/services/settings";
import { redirect } from "next/navigation";
import { SettingsClientPage } from "./client-page";

export default async function SettingsPage() {
  const user = await requireAuth();

  if (user.role !== "admin") {
    redirect("/dashboard");
  }

  const settings = await getSettings();

  return <SettingsClientPage settings={settings} />;
}
