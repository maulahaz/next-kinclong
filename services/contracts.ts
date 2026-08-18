import { db } from "@/lib/db";
import { contractsTable, carsTable, customersTable, washesTable } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function getCustomerContracts(userId: number) {
  // 1. Get customer ID from user ID
  const [customer] = await db
    .select({ id: customersTable.id })
    .from(customersTable)
    .where(eq(customersTable.userId, userId))
    .limit(1);

  if (!customer) {
    return [];
  }

  // 2. Fetch contracts with related car and washes
  const contracts = await db.query.contractsTable.findMany({
    where: eq(contractsTable.customerId, customer.id),
    orderBy: [desc(contractsTable.createdAt)],
    with: {
      car: true,
      washes: {
        orderBy: [desc(washesTable.createdAt)],
      },
    },
  });

  return contracts;
}

export async function createContract(data: { customerId: number; carId: number; packageId: number; packageType: string; totalWashes: number; startDate?: string }) {
  // Business rule: One active contract per car
  const activeContracts = await db.query.contractsTable.findMany({
    where: and(
      eq(contractsTable.carId, data.carId),
      eq(contractsTable.status, 'active')
    ),
  });

  if (activeContracts.length > 0) {
    throw new Error("This car already has an active contract");
  }

  const [contract] = await db
    .insert(contractsTable)
    .values({
      customerId: data.customerId,
      carId: data.carId,
      packageId: data.packageId,
      packageType: data.packageType,
      startDate: data.startDate || new Date().toISOString().split('T')[0],
      totalWashes: data.totalWashes,
      status: "active",
      completedWashes: 0,
    })
    .returning();

  return contract;
}

export async function updateContract(id: number, data: { packageId?: number; packageType?: string; totalWashes?: number; status?: "active" | "completed" | "cancelled" }) {
  const contract = await db.query.contractsTable.findFirst({
    where: eq(contractsTable.id, id),
  });

  if (!contract) throw new Error("Contract not found");

  if (data.status === "active" && contract.status !== "active") {
    // Check if another active contract exists for this car
    const activeContracts = await db.query.contractsTable.findMany({
      where: and(
        eq(contractsTable.carId, contract.carId),
        eq(contractsTable.status, 'active')
      ),
    });
    if (activeContracts.length > 0) {
      throw new Error("This car already has an active contract");
    }
  }

  const [updatedContract] = await db
    .update(contractsTable)
    .set({
      ...(data.packageId !== undefined && { packageId: data.packageId }),
      ...(data.packageType !== undefined && { packageType: data.packageType }),
      ...(data.totalWashes !== undefined && { totalWashes: data.totalWashes }),
      ...(data.status !== undefined && { status: data.status }),
    })
    .where(eq(contractsTable.id, id))
    .returning();

  return updatedContract;
}

export async function deleteContract(id: number) {
  const contract = await db.query.contractsTable.findFirst({
    where: eq(contractsTable.id, id),
  });

  if (!contract) throw new Error("Contract not found");

  await db.transaction(async (tx) => {
    // Delete washes for this contract
    await tx.delete(washesTable).where(eq(washesTable.contractId, id));
    // Delete contract
    await tx.delete(contractsTable).where(eq(contractsTable.id, id));
  });

  return { success: true };
}
