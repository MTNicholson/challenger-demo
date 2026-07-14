import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { getRewardPayload, validateRewardPayload } from "@/lib/brand-reward-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const url = new URL(request.url);
  const archived = url.searchParams.get("status") === "archived";
  const rewards = await prisma.brandReward.findMany({
    where: {
      brandId: session.brand.id,
      OR: [{ source: { not: "location" } }, { source: "location", status: "active" }],
      status: archived ? "archived" : { not: "archived" },
    },
    orderBy: [{ updatedAt: "desc" }],
  });

  return NextResponse.json({ rewards });
}

export async function POST(request: Request) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const payload = getRewardPayload(body);
  const error = validateRewardPayload(payload);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const reward = await prisma.brandReward.create({
    data: {
      brandId: session.brand.id,
      title: payload.title,
      type: payload.type,
      description: payload.description,
      status: payload.status,
      limit: payload.limit,
      points: payload.points,
      expiresInDays: payload.expiresInDays,
      usageTerms: payload.usageTerms,
    },
  });

  return NextResponse.json({ reward }, { status: 201 });
}
