import { db } from "@/lib/db";
import { usersTable, staffsTable, washesTable } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function getAllStaffs() {
  return await db.query.staffsTable.findMany({
    with: {
      user: true,
    },
    orderBy: (staffs, { desc }) => [desc(staffs.hireDate)],
  });
}

export async function createStaff(data: {
  name: string;
  email: string;
  phone: string;
  address?: string;
  position?: string;
  salary?: number;
  isActive?: boolean;
  imageUrl?: string;
  idCardUrl?: string;
  hireDate?: Date;
}) {
  const existingUser = await db.query.usersTable.findFirst({
    where: eq(usersTable.email, data.email),
  });

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  return await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(usersTable)
      .values({
        name: data.name,
        email: data.email,
        role: "staff",
      })
      .returning();

    const [staff] = await tx
      .insert(staffsTable)
      .values({
        userId: user.id,
        phone: data.phone,
        address: data.address || null,
        position: data.position || null,
        salary: data.salary || null,
        isActive: data.isActive !== false,
        imageUrl: data.imageUrl || null,
        idCardUrl: data.idCardUrl || null,
        hireDate: data.hireDate || new Date(),
      })
      .returning();

    return { user, staff };
  });
}

export async function updateStaff(
  id: number,
  data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    position?: string;
    salary?: number;
    isActive?: boolean;
    imageUrl?: string;
    idCardUrl?: string;
    hireDate?: Date;
  }
) {
  const staff = await db.query.staffsTable.findFirst({
    where: eq(staffsTable.id, id),
  });

  if (!staff) throw new Error("Staff not found");

  const [updatedUser] = await db
    .update(usersTable)
    .set({
      name: data.name,
      email: data.email,
    })
    .where(eq(usersTable.id, staff.userId))
    .returning();

  await db
    .update(staffsTable)
    .set({
      phone: data.phone,
      address: data.address || null,
      position: data.position || null,
      salary: data.salary || null,
      isActive: data.isActive !== false,
      imageUrl: data.imageUrl || null,
      idCardUrl: data.idCardUrl || null,
      hireDate: data.hireDate || staff.hireDate,
      updatedAt: new Date(),
    })
    .where(eq(staffsTable.id, id));

  return updatedUser;
}

export async function deleteStaff(id: number) {
  const staff = await db.query.staffsTable.findFirst({
    where: eq(staffsTable.id, id),
  });

  if (!staff) throw new Error("Staff not found");

  await db.transaction(async (tx) => {
    // Unlink washes
    await tx
      .update(washesTable)
      .set({ completedBy: null })
      .where(eq(washesTable.completedBy, staff.userId));

    // Delete staff profile
    await tx.delete(staffsTable).where(eq(staffsTable.id, id));

    // Delete user account
    await tx.delete(usersTable).where(eq(usersTable.id, staff.userId));
  });

  return { success: true };
}
