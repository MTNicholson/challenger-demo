import { NextResponse } from "next/server";
import { getPublicBrandById } from "@/lib/public-brands";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug: id } = await context.params;
  const brand = await getPublicBrandById(id);

  if (!brand) {
    return NextResponse.json({ error: "Бренд не найден." }, { status: 404 });
  }

  return NextResponse.json({ brand });
}
