import { NextRequest, NextResponse } from "next/server";
import { createStaff, getAllStaffs } from "@/services/staff";
import { requireAuth } from "@/services/auth";

export async function GET() {
  try {
    const user = await requireAuth();
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const staffs = await getAllStaffs();
    return NextResponse.json({ success: true, data: staffs });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    const result = await createStaff(data);
    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
