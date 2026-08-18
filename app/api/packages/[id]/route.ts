import { NextRequest, NextResponse } from "next/server";
import { updatePackage, deletePackage } from "@/services/packages";
import { requireAuth } from "@/services/auth";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const data = await updatePackage(parseInt(id), {
      ...body,
      ...(body.duration !== undefined && { duration: parseInt(body.duration) }),
      ...(body.price !== undefined && { price: parseInt(body.price) }),
      ...(body.totalWash !== undefined && { totalWash: parseInt(body.totalWash) }),
      ...(body.popularity !== undefined && { popularity: parseInt(body.popularity) }),
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireAuth();
    if (user.role !== "admin") {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    
    try {
      const data = await deletePackage(parseInt(id));
      return NextResponse.json({ success: true, data });
    } catch (e: any) {
      // If there's a foreign key constraint, we catch it specifically to provide a clean error.
      if (e.message && e.message.includes("violates foreign key constraint")) {
        return NextResponse.json(
          { success: false, error: "Cannot delete package as it is currently assigned to existing contracts." },
          { status: 409 }
        );
      }
      throw e;
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
