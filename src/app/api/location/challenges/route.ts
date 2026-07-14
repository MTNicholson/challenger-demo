import { NextResponse } from "next/server";
import { canManageLocationCampaigns, locationUnauthorized, requireLocationSession } from "@/lib/location-auth";
import { prisma } from "@/lib/prisma";

type Payload = {
  title?: string;
  description?: string;
  category?: string;
  mechanicType?: string;
  mechanicParams?: unknown;
  rewardId?: string;
  rewardTitle?: string;
  rewardDescription?: string;
  rewardPoints?: number;
  startsAt?: string;
  endsAt?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
  reward?: { mode?: string; title?: string; description?: string; points?: number; templateId?: string | null };
};

function parseDate(value?: string) {
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function valid(body: Payload) {
  return Boolean(body.title?.trim() && body.description?.trim() && body.mechanicType?.trim() && (body.rewardTitle?.trim() || body.reward?.title?.trim()));
}

export async function GET() {
  const session = await requireLocationSession();
  if (!session) return locationUnauthorized();
  if (!canManageLocationCampaigns(session)) return NextResponse.json({ error: "Раздел недоступен для этой роли или режима точки." }, { status: 403 });

  if (session.location.mode === "FLAGSHIP") {
    const challenges = await prisma.brandChallenge.findMany({
      where: { brandId: session.brand.id, locationIds: { has: session.location.id } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ kind: "challenges", challenges });
  }

  const requests = await prisma.locationChallengeRequest.findMany({
    where: { brandId: session.brand.id, locationId: session.location.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ kind: "requests", requests });
}

export async function POST(request: Request) {
  const session = await requireLocationSession();
  if (!session) return locationUnauthorized();
  if (!canManageLocationCampaigns(session)) return NextResponse.json({ error: "Создание челленджей недоступно для этой точки." }, { status: 403 });

  const body = await request.json().catch(() => null) as Payload | null;
  if (!body || !valid(body)) return NextResponse.json({ error: "Заполните название, описание, механику и награду." }, { status: 400 });
  const title = body.title!.trim();
  const description = body.description!.trim();
  const mechanicType = body.mechanicType!.trim();

  // templateId is meaningful only for a selected existing reward. A custom reward
  // must never be treated as an id of a reward record.
  const rewardId = body.rewardId ?? (body.reward?.mode === "template" ? body.reward.templateId ?? undefined : undefined);
  const reward = rewardId
    ? await prisma.brandReward.findFirst({
        where: {
          id: rewardId,
          brandId: session.brand.id,
          OR: [{ locationId: session.location.id }, { locationId: null, source: "brand" }],
        },
      })
    : null;
  if (rewardId && !reward) return NextResponse.json({ error: "Награда не найдена или недоступна для этой точки." }, { status: 404 });

  const rewardData = {
    rewardId: reward?.id ?? null,
    title: reward?.title ?? body.rewardTitle?.trim() ?? body.reward?.title?.trim() ?? "Награда точки",
    description: reward?.description ?? body.rewardDescription?.trim() ?? body.reward?.description?.trim() ?? null,
    points: reward?.points ?? Math.max(0, Number(body.rewardPoints ?? body.reward?.points ?? 0)),
  };

  if (session.location.mode === "FLAGSHIP") {
    const requestedStatus = body.status === "draft" ? "draft" : "active";
    const challenge = await prisma.$transaction(async (tx) => {
      // Local rewards remain private until a Flagship challenge using them is launched.
      if (requestedStatus === "active" && reward?.source === "location" && reward.status !== "active") {
        await tx.brandReward.update({ where: { id: reward.id }, data: { status: "active", archivedAt: null } });
      }

      return tx.brandChallenge.create({
        data: {
          brandId: session.brand.id,
          source: "location",
          createdByLocationUserId: session.user.id,
          title,
          description,
          category: body.category?.trim() || "visit",
          mechanicType,
          mechanicParams: body.mechanicParams as object ?? {},
          reward: rewardData.title,
          rewardData,
          startsAt: parseDate(body.startsAt ?? body.startDate),
          endsAt: parseDate(body.endsAt ?? body.endDate),
          locationIds: [session.location.id],
          status: requestedStatus,
          publishedAt: requestedStatus === "active" ? new Date() : null,
        },
      });
    });
    return NextResponse.json({ kind: "challenge", challenge }, { status: 201 });
  }

  const item = await prisma.locationChallengeRequest.create({
    data: {
      brandId: session.brand.id,
      locationId: session.location.id,
      createdByLocationUserId: session.user.id,
      title,
      description,
      category: body.category?.trim() || "visit",
      mechanicType,
      mechanicParams: body.mechanicParams as object ?? {},
      rewardData,
      rewardId: reward?.id ?? null,
      startsAt: parseDate(body.startsAt ?? body.startDate),
      endsAt: parseDate(body.endsAt ?? body.endDate),
      status: body.status === "draft" ? "draft" : "submitted",
    },
  });
  return NextResponse.json({ kind: "request", request: item, challenge: item }, { status: 201 });
}
