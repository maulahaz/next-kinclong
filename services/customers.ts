import { db } from "@/lib/db";
import { usersTable, customersTable, carsTable, contractsTable, washesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createCustomer(data: { name: string; email: string; phone: string; contactEmail?: string; address?: string; points?: number; isActive?: boolean; imageUrl?: string; idCardUrl?: string }) {
  // Check if user exists
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, data.email),
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  // Use transaction to ensure both user and customer are created
  return await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(usersTable)
      .values({
        name: data.name,
        email: data.email,
        role: "customer",
      })
      .returning();

    const [customer] = await tx
      .insert(customersTable)
      .values({
        userId: user.id,
        phone: data.phone,
        email: data.contactEmail || null,
        address: data.address || null,
        points: data.points || 0,
        isActive: data.isActive !== false,
        imageUrl: data.imageUrl || null,
        idCardUrl: data.idCardUrl || null,
      })
      .returning();

    return { user, customer };
  });
}

export async function updateCustomer(id: number, data: { name: string; email: string; phone: string; contactEmail?: string; address?: string; points?: number; isActive?: boolean; imageUrl?: string; idCardUrl?: string }) {
  const customer = await db.query.customersTable.findFirst({
    where: eq(customersTable.id, id),
  });

  if (!customer) throw new Error("Customer not found");

  const [updatedUser] = await db
    .update(usersTable)
    .set({
      name: data.name,
      email: data.email,
    })
    .where(eq(usersTable.id, customer.userId))
    .returning();

  await db
    .update(customersTable)
    .set({
      phone: data.phone,
      email: data.contactEmail || null,
      address: data.address || null,
      points: data.points || 0,
      isActive: data.isActive !== false,
      imageUrl: data.imageUrl || null,
      idCardUrl: data.idCardUrl || null,
      updatedAt: new Date(),
    })
    .where(eq(customersTable.id, id));

  return updatedUser;
}

export async function deleteCustomer(id: number) {
  const customer = await db.query.customersTable.findFirst({
    where: eq(customersTable.id, id),
  });

  if (!customer) throw new Error("Customer not found");

  // Get all contracts for this customer to delete their washes
  const contracts = await db.query.contractsTable.findMany({
    where: eq(contractsTable.customerId, id),
  });

  await db.transaction(async (tx) => {
    // Delete washes
    for (const contract of contracts) {
      await tx.delete(washesTable).where(eq(washesTable.contractId, contract.id));
    }
    // Delete contracts
    await tx.delete(contractsTable).where(eq(contractsTable.customerId, id));
    // Delete cars
    await tx.delete(carsTable).where(eq(carsTable.customerId, id));
    // Delete customer
    await tx.delete(customersTable).where(eq(customersTable.id, id));
    // Delete user
    await tx.delete(usersTable).where(eq(usersTable.id, customer.userId));
  });

  return { success: true };
}
