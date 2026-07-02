import { NextResponse } from "next/server";
import { getPublicBrandBySlug } from "@/lib/public-brands";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const brand = await getPublicBrandBySlug(slug);

  if (!brand) {
    return NextResponse.json({ error: "Бренд не найден." }, { status: 404 });
  }

  return NextResponse.json({ brand });
}
