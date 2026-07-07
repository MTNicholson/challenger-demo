import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import { DadataConfigError, DadataRequestError, suggestAddress } from "@/lib/geocoding/dadata";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as {
    query?: unknown;
    city?: unknown;
    count?: unknown;
  } | null;
  const query = typeof body?.query === "string" ? body.query.trim() : "";
  const city = typeof body?.city === "string" ? body.city.trim() : null;
  const count = typeof body?.count === "number" && Number.isFinite(body.count) ? body.count : 8;

  if (query.length < 3) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const suggestions = await suggestAddress({ query, city, count });
    return NextResponse.json({ suggestions });
  } catch (error) {
    if (error instanceof DadataConfigError) {
      return NextResponse.json({ error: "Геокодинг временно недоступен" }, { status: 503 });
    }

    if (error instanceof DadataRequestError) {
      return NextResponse.json({ error: "Не удалось получить подсказки адреса" }, { status: 502 });
    }

    return NextResponse.json({ error: "Не удалось получить подсказки адреса" }, { status: 502 });
  }
}
