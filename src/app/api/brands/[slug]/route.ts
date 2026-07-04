import { NextResponse } from "next/server";
import { getPublicBrandBySlug } from "@/lib/public-brands";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function decodeSlugParam(slug: string) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  const decodedSlug = decodeSlugParam(slug);
  const brand = await getPublicBrandBySlug(decodedSlug);

  if (!brand) {
    return NextResponse.json({ error: "Бренд не найден." }, { status: 404 });
  }

  return NextResponse.json({ brand });
}
