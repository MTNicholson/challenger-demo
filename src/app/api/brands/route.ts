import { NextResponse } from "next/server";
import { getPublicBrands } from "@/lib/public-brands";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const brands = await getPublicBrands();
  return NextResponse.json({ brands });
}
