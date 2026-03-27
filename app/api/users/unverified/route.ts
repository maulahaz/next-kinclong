import { NextResponse } from "next/server";
import { getUnverifiedUsers } from "@/services/users";
import { requireAuth } from "@/services/auth";

export async function GET() {
  try {
    const user = await requireAuth();
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const users = await getUnverifiedUsers();
    return NextResponse.json({ success: true, data: users });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
