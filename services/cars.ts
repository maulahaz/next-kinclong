import { db } from "@/lib/db";
import { carsTable, contractsTable, washesTable } from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";

export async function createCar(data: { customerId: number; type: "small" | "big"; plateNumber: string }) {
  const [car] = await db
    .insert(carsTable)
    .values({
      customerId: data.customerId,
      type: data.type,
      plateNumber: data.plateNumber,
    })
    .returning();

  return car;
}

export async function updateCar(id: number, data: { type: "small" | "big"; plateNumber: string }) {
  const [car] = await db
    .update(carsTable)
    .set({
      type: data.type,
      plateNumber: data.plateNumber,
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
    // Delete washes for all contracts associated with this car
    for (const contract of contracts) {
      await tx.delete(washesTable).where(eq(washesTable.contractId, contract.id));
    }
    // Delete contracts
    if (contracts.length > 0) {
      await tx.delete(contractsTable).where(eq(contractsTable.carId, id));
    }
    // Delete car
    await tx.delete(carsTable).where(eq(carsTable.id, id));
  });

  return { success: true };
}
