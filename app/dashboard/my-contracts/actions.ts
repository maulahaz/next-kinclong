"use server";

import { requireAuth } from "@/services/auth";
import { acknowledgeWashTask } from "@/services/washes";
import { revalidatePath } from "next/cache";

export async function submitAcknowledgeWash(washId: number) {
  try {
    const user = await requireAuth();
    if (user.role !== "customer") {
      return { error: "Unauthorized access. Only customers can acknowledge washes." };
    }

    await acknowledgeWashTask(washId, user.id);

    revalidatePath("/dashboard/my-contracts");
    return { success: true, message: "Wash acknowledged successfully!" };
  } catch (error: any) {
    return { error: error.message || "Failed to acknowledge wash." };
  }
}
