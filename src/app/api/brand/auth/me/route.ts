import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ brand: null, member: null }, { status: 401 });

  return NextResponse.json(session);
}
