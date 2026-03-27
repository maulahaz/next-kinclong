import { NextRequest, NextResponse } from "next/server";
import { createCar } from "@/services/cars";
import { requireAuth } from "@/services/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const data = await createCar(body);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
