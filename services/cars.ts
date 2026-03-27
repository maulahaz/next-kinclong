import { db } from "@/lib/db";
import { carsTable, contractsTable, washesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

interface CarInput {
  customerId: number;
  type: "small" | "big";
  plateNumber: string;
  brand?: string;
  model?: string;
  color?: string;
  imageUrl?: string;
  notes?: string;
}

export async function createCar(data: CarInput) {
  const [car] = await db
    .insert(carsTable)
    .values({
      customerId: data.customerId,
      type: data.type,
      plateNumber: data.plateNumber,
      brand: data.brand || null,
      model: data.model || null,
      color: data.color || null,
      imageUrl: data.imageUrl || null,
      notes: data.notes || null,
    })
    .returning();

  return car;
}

export async function updateCar(id: number, data: Omit<CarInput, "customerId">) {
  const [car] = await db
    .update(carsTable)
    .set({
      type: data.type,
      plateNumber: data.plateNumber,
      brand: data.brand || null,
      model: data.model || null,
      color: data.color || null,
      imageUrl: data.imageUrl || null,
      notes: data.notes || null,
      updatedAt: new Date(),
    })
    .where(eq(carsTable.id, id))
    .returning();

  return car;
}

export async function deleteCar(id: number) {
  const car = await db.query.carsTable.findFirst({
    where: eq(carsTable.id, id),
  });

  if (!car) throw new Error("Car not found");

  const contracts = await db.query.contractsTable.findMany({
    where: eq(contractsTable.carId, id),
  });

  await db.transaction(async (tx) => {
    for (const contract of contracts) {
      await tx.delete(washesTable).where(eq(washesTable.contractId, contract.id));
    }
    if (contracts.length > 0) {
      await tx.delete(contractsTable).where(eq(contractsTable.carId, id));
    }
    await tx.delete(carsTable).where(eq(carsTable.id, id));
  });

  return { success: true };
}
