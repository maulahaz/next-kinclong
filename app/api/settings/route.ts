import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/services/settings";
import { requireAuth } from "@/services/auth";

export async function GET() {
  try {
    const settings = await getSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }
    
    const data = await req.json();
    const updated = await updateSettings(data);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
