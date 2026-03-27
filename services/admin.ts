import { db } from "@/lib/db";
import { contractsTable, customersTable, washesTable, usersTable, carsTable } from "@/lib/db/schema";
import { eq, desc, count, and } from "drizzle-orm";

export async function getAdminStats() {
  const [totalCustomers] = await db.select({ count: count() }).from(customersTable);
  const [activeContracts] = await db.select({ count: count() }).from(contractsTable).where(eq(contractsTable.status, "active"));
  const [completedWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.status, "acknowledged"));
  const [pendingWashes] = await db.select({ count: count() }).from(washesTable).where(eq(washesTable.status, "pending"));

  return {
    totalCustomers: totalCustomers.count,
    activeContracts: activeContracts.count,
    completedWashes: completedWashes.count,
    pendingWashes: pendingWashes.count,
  };
}

export async function getAllContracts() {
  return await db.query.contractsTable.findMany({
    orderBy: [desc(contractsTable.createdAt)],
    with: {
      customer: {
        with: { user: true },
      },
      car: true,
      washes: true,
    },
  });
}

export async function getAllCustomers() {
  return await db.query.customersTable.findMany({
    with: {
      user: true,
      cars: true,
      contracts: true,
    },
  });
}

export async function getAllCars() {
  return await db.query.carsTable.findMany({
    orderBy: [desc(carsTable.createdAt)],
    with: {
      customer: {
        with: { user: true },
      },
    },
  });
}
