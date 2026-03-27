import { db } from "@/lib/db";
import { usersTable, customersTable, carsTable, contractsTable, washesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function createCustomer(data: {
  userId: number;
  phone?: string;
  email?: string;
  address?: string;
  points?: number;
  isActive?: boolean;
  imageUrl?: string;
  idCardUrl?: string;
}) {
  // Verify user exists and is unverified
  const user = await db.query.usersTable.findFirst({
    where: eq(usersTable.id, data.userId),
  });

  if (!user) throw new Error("User not found");
  if (user.role !== "unverified") throw new Error("User is already assigned a role");

  return await db.transaction(async (tx) => {
    // Promote user to customer role and activate
    await tx
      .update(usersTable)
      .set({ role: "customer", isActive: true })
      .where(eq(usersTable.id, data.userId));

    const [customer] = await tx
      .insert(customersTable)
      .values({
        userId: data.userId,
        phone: data.phone || null,
        email: data.email || null,
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

export async function updateCustomer(
  id: number,
  data: {
    name?: string;
    email?: string;
    phone?: string;
    contactEmail?: string;
    address?: string;
    points?: number;
    isActive?: boolean;
    imageUrl?: string;
    idCardUrl?: string;
  }
) {
  const customer = await db.query.customersTable.findFirst({
    where: eq(customersTable.id, id),
  });

  if (!customer) throw new Error("Customer not found");

  // Update user-level fields if provided
  if (data.name || data.email) {
    const userUpdate: Record<string, string> = {};
    if (data.name) userUpdate.name = data.name;
    if (data.email) userUpdate.email = data.email;

    await db
      .update(usersTable)
      .set(userUpdate)
      .where(eq(usersTable.id, customer.userId));
  }

  // Update customer-level fields
  await db
    .update(customersTable)
    .set({
      phone: data.phone ?? null,
      email: data.contactEmail ?? null,
      address: data.address ?? null,
      points: data.points ?? 0,
      isActive: data.isActive !== false,
      imageUrl: data.imageUrl ?? null,
      idCardUrl: data.idCardUrl ?? null,
      updatedAt: new Date(),
    })
    .where(eq(customersTable.id, id));

  return { success: true };
}

export async function deleteCustomer(id: number) {
  const customer = await db.query.customersTable.findFirst({
    where: eq(customersTable.id, id),
  });

  if (!customer) throw new Error("Customer not found");

  const contracts = await db.query.contractsTable.findMany({
    where: eq(contractsTable.customerId, id),
  });

  await db.transaction(async (tx) => {
    for (const contract of contracts) {
      await tx.delete(washesTable).where(eq(washesTable.contractId, contract.id));
    }
    await tx.delete(contractsTable).where(eq(contractsTable.customerId, id));
    await tx.delete(carsTable).where(eq(carsTable.customerId, id));
    await tx.delete(customersTable).where(eq(customersTable.id, id));
    await tx.delete(usersTable).where(eq(usersTable.id, customer.userId));
  });

  return { success: true };
}
