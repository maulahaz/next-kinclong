"use server";

import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { usersTable, customersTable } from "@/lib/db/schema";
import { eq, or } from "drizzle-orm";
import { redirect } from "next/navigation";
import bcrypt from "bcrypt";

const COOKIE_NAME = "kinclong_session_id";

export async function loginWithIdentifier(id: string, password: string) {
  const [user] = await db
    .select()
    .from(usersTable)
    .where(or(eq(usersTable.email, id), eq(usersTable.phone, id)))
    .limit(1);

  if (!user) {
    return { error: "User not found. Use your Email or Phone." };
  }

  if (!user.passwordHash) {
    return { error: "Account has no password set. Contact admin." };
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return { error: "Invalid password" };
  }

  //--Check if user is active
  if (!user.isActive) {
    return { error: "Account is not active. Please contact admin." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, user.id.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return { success: true };
}

export async function registerUser(data: { name: string; id: string; password: string }) {
  if (!data.password || data.password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  const isEmail = data.id.includes("@");

  const existingUser = await db
    .select()
    .from(usersTable)
    .where(isEmail ? eq(usersTable.email, data.id) : eq(usersTable.phone, data.id))
    .limit(1);

  if (existingUser.length > 0) {
    return { error: "Email or phone already registered" };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return await db.transaction(async (tx) => {
    const [user] = await tx
      .insert(usersTable)
      .values({
        name: data.name,
        email: isEmail ? data.id : null,
        phone: isEmail ? null : data.id,
        role: "unverified",
        passwordHash: hashedPassword,
        isActive: false,
      })
      .returning();

    //--Insert to customers:
    // await tx.insert(customersTable).values({
    //   userId: user.id,
    //   phone: !isEmail ? data.id : "N/A",
    // });

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, user.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    //--Send Message that wait for admin approval:
    return { error: true, message: "Account created successfully! Please wait for admin approval." };
    // return { success: true};
  });
}

export async function updatePassword(currentPassword: string, newPassword: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Not authenticated");

  if (!user.passwordHash) {
    throw new Error("Account has no password set");
  }

  const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!isValid) {
    throw new Error("Incorrect current password");
  }

  const hashedNew = await bcrypt.hash(newPassword, 10);

  await db
    .update(usersTable)
    .set({ passwordHash: hashedNew })
    .where(eq(usersTable.id, user.id));

  return { success: true };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/login");
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const userIdStr = cookieStore.get(COOKIE_NAME)?.value;

  if (!userIdStr) return null;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, parseInt(userIdStr, 10)))
    .limit(1);

  return user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
