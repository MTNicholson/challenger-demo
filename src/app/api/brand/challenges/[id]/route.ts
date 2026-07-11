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
  const payload = parseBrandChallengePayload(await request.json().catch(() => null));
  if (!payload) return NextResponse.json({ error: "Проверьте обязательные поля челленджа." }, { status: 400 });

  const existing = await prisma.brandChallenge.findFirst({ where: { id, brandId: session.brand.id }, select: { id: true } });
  if (!existing) return NextResponse.json({ error: "Челлендж не найден." }, { status: 404 });

  const challenge = await prisma.brandChallenge.update({
    where: { id },
    data: toBrandChallengeData(payload),
  });
  return NextResponse.json({ challenge: serializeBrandChallenge(challenge) });
}
