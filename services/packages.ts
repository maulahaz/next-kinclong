import { db } from "@/lib/db";
import { packagesTable } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function getAllPackages() {
  return await db.query.packagesTable.findMany({
    orderBy: [packagesTable.name],
  });
}

export async function createPackage(data: {
  name: string;
  description: string;
  duration: number;
  price: number;
  totalWash?: number;
  includes: string[];
  popularity?: number;
  isActive: boolean;
}) {
  const [newPackage] = await db
    .insert(packagesTable)
    .values({
      name: data.name,
      description: data.description,
      duration: data.duration,
      price: data.price,
      totalWash: data.totalWash ?? 1,
      includes: data.includes,
      popularity: data.popularity ?? 0,
      isActive: data.isActive,
    })
    .returning();

  return newPackage;
}

export async function updatePackage(id: number, data: {
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  totalWash?: number;
  includes?: string[];
  popularity?: number;
  isActive?: boolean;
}) {
  const pkg = await db.query.packagesTable.findFirst({
    where: eq(packagesTable.id, id),
  });

  if (!pkg) throw new Error("Package not found");

  const [updatedPackage] = await db
    .update(packagesTable)
    .set({
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.duration !== undefined && { duration: data.duration }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.totalWash !== undefined && { totalWash: data.totalWash }),
      ...(data.includes !== undefined && { includes: data.includes }),
      ...(data.popularity !== undefined && { popularity: data.popularity }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    })
    .where(eq(packagesTable.id, id))
    .returning();

  return updatedPackage;
}

export async function deletePackage(id: number) {
  const pkg = await db.query.packagesTable.findFirst({
    where: eq(packagesTable.id, id),
  });

  if (!pkg) throw new Error("Package not found");

  // We should not delete packages that have existing contracts to preserve historical integrity,
  // but if we are hard-deleting, we might cascade. Usually, we just set isActive to false.
  // The user asked for CRUD. I'll implement a real delete, but note that it might fail due to foreign keys.
  await db.delete(packagesTable).where(eq(packagesTable.id, id));

  return { success: true };
}
