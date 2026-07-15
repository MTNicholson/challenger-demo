import { NextResponse } from "next/server";
import { locationUnauthorized, requireLocationSession } from "@/lib/location-auth";
import { redeemRewardTokenForLocation } from "@/lib/location-reward-scanner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await requireLocationSession();
  if (!session) return locationUnauthorized();
  const body = (await request.json().catch(() => null)) as { tokenId?: string } | null;
  if (!body?.tokenId) return NextResponse.json({ ok: false, status: "NOT_FOUND", message: "Не указан токен награды." }, { status: 400 });

  try {
    const result = await redeemRewardTokenForLocation(body.tokenId, session);
    if (!result.ok) {
      return NextResponse.json({ ok: false, status: result.status, message: result.message, redeemedAt: result.token?.redeemedAt?.toISOString() ?? null }, { status: 409 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ ok: false, status: "ERROR", message: "Не удалось подтвердить выдачу награды." }, { status: 500 });
  }
}
