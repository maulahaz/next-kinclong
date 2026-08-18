"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { completeWashTask } from "@/services/washes";
import { requireAuth } from "@/services/auth";
import { revalidatePath } from "next/cache";

export async function submitWashEvidence(prevState: any, formData: FormData) {
  try {
    const user = await requireAuth();
    if (user.role !== "staff" && user.role !== "admin") {
      return { error: "Unauthorized access. Only staff can complete washes." };
    }

    const file = formData.get("file") as File;
    const washIdStr = formData.get("washId") as string;
    const washedDate = formData.get("washedDate") as string;
    console.log(">>> WashIDStr :"+ washIdStr)
    console.log(">>> Wash Date :"+ washedDate)

    if (!file || file.size === 0) {
      return { error: "An image file is required." };
    }
    if (!washIdStr) {
      return { error: "Missing wash ID." };
    }
    if (!washedDate) {
      return { error: "Washed date is required." };
    }

    if (washedDate > new Date().toISOString().split("T")[0]) {
      return { error: "Washed date cannot be in the future." };
    }

    const washId = parseInt(washIdStr, 10);
    console.log(">>> WashID :"+ washId)

    // Save locally
    // const bytes = await file.arrayBuffer();
    // const buffer = Buffer.from(bytes);
    
    // const ext = file.name.split('.').pop() || 'jpg';
    // const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
    // const uploadDir = join(process.cwd(), "public/uploads");
    // const path = join(uploadDir, filename);

    // await mkdir(uploadDir, { recursive: true });
    // await writeFile(path, buffer);

    // const imageUrl = `/uploads/${filename}`;
    const imageUrl = `x`;

    // Update DB
    await completeWashTask(washId, user.id, imageUrl, washedDate);

    revalidatePath("/dashboard/tasks");
    
    return { success: true, message: "Wash marked as completed successfully!" };
  } catch (error: any) {
    return { error: error.message || "Failed to upload evidence." };
  }
}
