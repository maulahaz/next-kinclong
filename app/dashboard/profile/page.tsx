import { requireAuth } from "@/services/auth";
import { ProfileClientPage } from "./client-page";

export default async function ProfilePage() {
  const user = await requireAuth();

  return <ProfileClientPage user={user} />;
}
