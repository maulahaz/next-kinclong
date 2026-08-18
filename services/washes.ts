import { db } from "@/lib/db";
import { washesTable, contractsTable, carsTable, customersTable, usersTable } from "@/lib/db/schema";
import { eq, and, lt } from "drizzle-orm";

export async function getPendingTasks() {
  const pendingWashes = await db
    .select({
      id: contractsTable.id,
      type: contractsTable.packageType,
      completed: contractsTable.completedWashes,
      target: contractsTable.totalWashes,
      car: {
        plateNumber: carsTable.plateNumber,
        type: carsTable.type,
      },
      customer: {
        name: usersTable.name,
      },
    })
    .from(contractsTable)
    .innerJoin(carsTable, eq(contractsTable.carId, carsTable.id))
    .innerJoin(customersTable, eq(contractsTable.customerId, customersTable.id))
    .innerJoin(usersTable, eq(customersTable.userId, usersTable.id))
    .where(lt(contractsTable.completedWashes, contractsTable.totalWashes))
    .orderBy(contractsTable.id);
    // .select({
    //   id: washesTable.id,
    //   type: washesTable.type,
    //   status: washesTable.status,
    //   createdAt: washesTable.createdAt,
    //   contractId: contractsTable.id,
    //   car: {
    //     plateNumber: carsTable.plateNumber,
    //     type: carsTable.type,
    //   },
    //   customer: {
    //     name: usersTable.name,
    //   },
    // })
    // .from(washesTable)
    // .innerJoin(contractsTable, eq(washesTable.contractId, contractsTable.id))
    // .innerJoin(carsTable, eq(contractsTable.carId, carsTable.id))
    // .innerJoin(customersTable, eq(contractsTable.customerId, customersTable.id))
    // .innerJoin(usersTable, eq(customersTable.userId, usersTable.id))
    // .where(eq(washesTable.status, "pending"))
    // .orderBy(washesTable.createdAt);

  return pendingWashes;
}

export async function completeWashTask(
  washId: number,
  staffId: number,
  imageUrl: string,
  washedDate: string
) {
  // 1. Update the wash record
  const [updatedWash] = await db
    // .insert(washesTable)
    // .values({
    //   type: 
    //   status: "done", // Washed mark as done, waiting for customer acknowledgment
    //   completedBy: staffId,
    //   imageUrl,
    //   createdAt: new Date(`${washedDate}T00:00:00`),
    // })
    // .returning();
    .update(washesTable)
    .set({
      status: "done", // Washed mark as done, waiting for customer acknowledgment
      completedBy: staffId,
      imageUrl,
      createdAt: new Date(`${washedDate}T00:00:00`),
    })
    .where(eq(washesTable.id, washId))
    .returning();

  if (!updatedWash) {
    throw new Error("Wash not found or couldn't be updated.");
  }

  // NOTE: Business Rule - Contract completes only when all washes are acknowledged
  // So we don't update contract state to 'completed' here. That happens on acknowledgment.

  return updatedWash;
}

export async function acknowledgeWashTask(washId: number, userId: number) {
  // 1. Fetch the wash and verify ownership
  const wash = await db.query.washesTable.findFirst({
    where: eq(washesTable.id, washId),
    with: {
      contract: {
        with: {
          customer: true
        }
      }
    }
  });

  if (!wash) throw new Error("Wash not found.");
  if (wash.contract.customer.userId !== userId) throw new Error("Unauthorized to acknowledge this wash.");
  if (wash.status !== "done") throw new Error("Wash is not waiting for acknowledgment.");

  // 2. Mark wash as acknowledged
  await db
    .update(washesTable)
    .set({
      status: "acknowledged",
      acknowledgedByCustomer: true,
    })
    .where(eq(washesTable.id, washId));

  // 3. Increment contract completed washes and check if done
  const contract = wash.contract;
  const newCompletedWashes = contract.completedWashes + 1;
  const isFinished = newCompletedWashes >= contract.totalWashes;

  await db
    .update(contractsTable)
    .set({
      completedWashes: newCompletedWashes,
      status: isFinished ? "completed" : "active",
    })
    .where(eq(contractsTable.id, contract.id));

  return true;
}
