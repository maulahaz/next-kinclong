import { NextRequest, NextResponse } from "next/server";
import { createPackage, getAllPackages } from "@/services/packages";
import { requireAuth } from "@/services/auth";

export async function GET() {
  try {
    const data = await getAllPackages();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth();
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const data = await createPackage({
      name: body.name,
      description: body.description,
      duration: parseInt(body.duration),
      price: parseInt(body.price),
      totalWash: parseInt(body.totalWash) || 1,
      includes: Array.isArray(body.includes) ? body.includes : [body.includes],
      popularity: parseInt(body.popularity) || 0,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
