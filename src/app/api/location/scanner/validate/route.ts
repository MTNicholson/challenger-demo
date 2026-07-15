import { NextResponse } from "next/server";
import { locationUnauthorized, requireLocationSession } from "@/lib/location-auth";
import { createRewardScanLog, toScannerPayload, validateRewardTokenForLocation } from "@/lib/location-reward-scanner";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await requireLocationSession();
  if (!session) return locationUnauthorized();
  const body = (await request.json().catch(() => null)) as { code?: string } | null;
  const code = body?.code?.trim();
  if (!code) return NextResponse.json({ ok: false, status: "NOT_FOUND", message: "Введите QR или ручной код." }, { status: 400 });

  try {
    const validation = await validateRewardTokenForLocation(code, session);
    if (!validation.ok) {
      await createRewardScanLog({ session, status: validation.status, message: validation.message, token: validation.token });
      return NextResponse.json({ ok: false, status: validation.status, message: validation.message, redeemedAt: validation.token?.redeemedAt?.toISOString() ?? null });
    }
    return NextResponse.json({ ok: true, status: "VALID", ...toScannerPayload(validation, session) });
  } catch {
    return NextResponse.json({ ok: false, status: "ERROR", message: "Не удалось проверить QR-код." }, { status: 500 });
  }
}
