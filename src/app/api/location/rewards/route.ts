import { NextResponse } from "next/server";
import { canManageLocationCampaigns, locationUnauthorized, requireLocationSession } from "@/lib/location-auth";
import { prisma } from "@/lib/prisma";
import { getRewardPayload, validateRewardPayload } from "@/lib/brand-reward-validation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const session = await requireLocationSession();
  if (!session) return locationUnauthorized();
  if (!canManageLocationCampaigns(session)) return NextResponse.json({ error: "Раздел недоступен для этой роли или режима точки." }, { status: 403 });
  const archived = new URL(request.url).searchParams.get("status") === "archived";
  const rewards = await prisma.brandReward.findMany({
    where: { brandId: session.brand.id, locationId: session.location.id, status: archived ? "archived" : { not: "archived" } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ rewards });
}

export async function POST(request: Request) {
  const session = await requireLocationSession();
  if (!session) return locationUnauthorized();
  if (!canManageLocationCampaigns(session)) return NextResponse.json({ error: "Создание наград недоступно для этой точки." }, { status: 403 });
  const payload = getRewardPayload(await request.json().catch(() => null));
  const error = validateRewardPayload(payload);
  if (error) return NextResponse.json({ error }, { status: 400 });

  // A local reward becomes visible in the brand cabinet only when an active
  // Flagship challenge starts using it.
  const reward = await prisma.brandReward.create({
    data: {
      brandId: session.brand.id,
      locationId: session.location.id,
      createdByLocationUserId: session.user.id,
      source: "location",
      title: payload.title,
      type: payload.type,
      description: payload.description,
      status: "draft",
      limit: payload.limit,
      points: payload.points,
      expiresInDays: payload.expiresInDays,
      usageTerms: payload.usageTerms,
    },
  });
  return NextResponse.json({ reward }, { status: 201 });
}
