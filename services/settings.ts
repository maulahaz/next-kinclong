"use server";

import { db } from "@/lib/db";
import { settingsTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSettings() {
  const result = await db.select().from(settingsTable).where(eq(settingsTable.id, 1)).limit(1);
  return result[0] || null;
}

export async function updateSettings(data: any) {
  const result = await db
    .update(settingsTable)
    .set({
      appName: data.appName,
      companyName: data.companyName,
      companyLogo: data.companyLogo,
      companyIcon: data.companyIcon,
      companyAddress: data.companyAddress,
      phone: data.phone,
      email: data.email,
      currency: data.currency,
      timezone: data.timezone,
      socialMedia: data.socialMedia,
      others: data.others,
      updatedAt: new Date(),
    })
    .where(eq(settingsTable.id, 1))
    .returning();
  
  revalidatePath("/", "layout"); // Revalidate all layouts using app sidebar
  return result[0];
}
