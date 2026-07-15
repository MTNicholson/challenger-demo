import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import { parseBrandChallengePayload, serializeBrandChallenge, toBrandChallengeData } from "@/lib/brand-challenges";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request: Request, context: RouteContext<"/api/brand/challenges/[id]">) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const existing = await prisma.brandChallenge.findFirst({ where: { id, brandId: session.brand.id } });
  if (!existing) return NextResponse.json({ error: "Челлендж не найден." }, { status: 404 });

  if (body?.action === "archive") {
    if (existing.status === "archived") return NextResponse.json({ error: "Челлендж уже в архиве." }, { status: 409 });
    const challenge = await prisma.brandChallenge.update({ where: { id }, data: { status: "archived" } });
    return NextResponse.json({ challenge: serializeBrandChallenge(challenge) });
  }
  if (body?.action === "restore") {
    if (existing.status !== "archived") return NextResponse.json({ error: "Восстановить можно только челлендж из архива." }, { status: 409 });
    const challenge = await prisma.brandChallenge.update({ where: { id }, data: { status: "draft", publishedAt: null, scheduledAt: null } });
    return NextResponse.json({ challenge: serializeBrandChallenge(challenge) });
  }

  const payload = parseBrandChallengePayload(body);
  if (!payload) return NextResponse.json({ error: "Проверьте обязательные поля челленджа." }, { status: 400 });
  const challenge = await prisma.brandChallenge.update({ where: { id }, data: toBrandChallengeData(payload) });
  return NextResponse.json({ challenge: serializeBrandChallenge(challenge) });
}

export async function DELETE(request: Request, context: RouteContext<"/api/brand/challenges/[id]">) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null) as { confirmWord?: string } | null;
  if (body?.confirmWord !== "УДАЛИТЬ") return NextResponse.json({ error: "Для удаления введите слово «УДАЛИТЬ»." }, { status: 400 });
  const challenge = await prisma.brandChallenge.findFirst({ where: { id, brandId: session.brand.id } });
  if (!challenge) return NextResponse.json({ error: "Челлендж не найден." }, { status: 404 });
  if (challenge.status !== "archived") return NextResponse.json({ error: "Удалить навсегда можно только челлендж из архива." }, { status: 409 });
  await prisma.$transaction(async (tx) => {
    await tx.locationChallengeRequest.updateMany({ where: { sourceChallengeId: id }, data: { sourceChallengeId: null } });
    await tx.brandChallenge.delete({ where: { id } });
  });
  return NextResponse.json({ deleted: true });
}
