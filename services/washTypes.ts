import { db } from "@/lib/db";
import { washTypesTable } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getAllWashTypes() {
  return await db.query.washTypesTable.findMany({
    orderBy: [asc(washTypesTable.id)],
  });
}

export async function createWashType(data: { washType: string }) {
  const [newWashType] = await db
    .insert(washTypesTable)
    .values({
      washType: data.washType,
    })
    .returning();

  return newWashType;
}

export async function updateWashType(id: number, data: { washType?: string }) {
  const washType = await db.query.washTypesTable.findFirst({
    where: eq(washTypesTable.id, id),
  });

  if (!washType) throw new Error("Wash type not found");

  const [updatedWashType] = await db
    .update(washTypesTable)
    .set({
      ...(data.washType !== undefined && { washType: data.washType }),
    })
    .where(eq(washTypesTable.id, id))
    .returning();

  return updatedWashType;
}

export async function deleteWashType(id: number) {
  const washType = await db.query.washTypesTable.findFirst({
    where: eq(washTypesTable.id, id),
  });

  if (!washType) throw new Error("Wash type not found");

  await db.delete(washTypesTable).where(eq(washTypesTable.id, id));

  return { success: true };
}
