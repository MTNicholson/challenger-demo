import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import { parseBrandChallengePayload, serializeBrandChallenge, toBrandChallengeData } from "@/lib/brand-challenges";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const payload = parseBrandChallengePayload(await request.json().catch(() => null));
  if (!payload) return NextResponse.json({ error: "Проверьте обязательные поля челленджа." }, { status: 400 });

  const challenge = await prisma.brandChallenge.create({
    data: { ...toBrandChallengeData(payload), brandId: session.brand.id },
  });

  return NextResponse.json({ challenge: serializeBrandChallenge(challenge) }, { status: 201 });
}
