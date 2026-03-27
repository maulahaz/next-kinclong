import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  cookieStore.delete("kinclong_session_id");
  return NextResponse.redirect(new URL("/login", req.url), 302);
}
