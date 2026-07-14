import { NextResponse } from "next/server";
import { canManageLocationCampaigns, locationUnauthorized, requireLocationSession } from "@/lib/location-auth";
import { prisma } from "@/lib/prisma";

const editableRequestStatuses = ["draft", "changes_requested", "rejected"];

export async function GET(_request: Request, context: RouteContext<"/api/location/challenges/[id]">) {
  const session = await requireLocationSession();
  if (!session) return locationUnauthorized();
  if (!canManageLocationCampaigns(session)) return NextResponse.json({ error: "Недостаточно прав." }, { status: 403 });
  const { id } = await context.params;

  if (session.location.mode === "EXTENDED") {
    const request = await prisma.locationChallengeRequest.findFirst({ where: { id, brandId: session.brand.id, locationId: session.location.id } });
    return request
      ? NextResponse.json({ request, editable: editableRequestStatuses.includes(request.status) })
      : NextResponse.json({ error: "Заявка не найдена." }, { status: 404 });
  }

  const challenge = await prisma.brandChallenge.findFirst({ where: { id, brandId: session.brand.id, locationIds: { has: session.location.id } } });
  return challenge
    ? NextResponse.json({ challenge, editable: challenge.source === "location" })
    : NextResponse.json({ error: "Челлендж не найден." }, { status: 404 });
}

export async function PATCH(request: Request, context: RouteContext<"/api/location/challenges/[id]">) {
  const session = await requireLocationSession();
  if (!session) return locationUnauthorized();
  if (!canManageLocationCampaigns(session)) return NextResponse.json({ error: "Недостаточно прав." }, { status: 403 });
  const { id } = await context.params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;

  if (session.location.mode === "EXTENDED") {
    const existing = await prisma.locationChallengeRequest.findFirst({ where: { id, brandId: session.brand.id, locationId: session.location.id } });
    if (!existing) return NextResponse.json({ error: "Заявка не найдена." }, { status: 404 });
    if (!editableRequestStatuses.includes(existing.status)) return NextResponse.json({ error: "Заявку нельзя редактировать в текущем статусе." }, { status: 409 });

    const reward = body?.reward && typeof body.reward === "object" ? body.reward as object : existing.rewardData as object ?? {};
    const item = await prisma.locationChallengeRequest.update({
      where: { id },
      data: {
        title: typeof body?.title === "string" ? body.title : existing.title,
        description: typeof body?.description === "string" ? body.description : existing.description,
        category: typeof body?.category === "string" ? body.category : existing.category,
        mechanicType: typeof body?.mechanicType === "string" ? body.mechanicType : existing.mechanicType,
        mechanicParams: body?.mechanicParams && typeof body.mechanicParams === "object" ? body.mechanicParams as object : existing.mechanicParams as object ?? {},
        rewardData: reward,
        status: body?.status === "draft" ? "draft" : "submitted",
        brandReviewComment: null,
      },
    });
    return NextResponse.json({ challenge: item, request: item });
  }

  const existing = await prisma.brandChallenge.findFirst({ where: { id, brandId: session.brand.id, locationIds: { has: session.location.id } } });
  if (!existing) return NextResponse.json({ error: "Челлендж не найден." }, { status: 404 });
  if (existing.source !== "location") return NextResponse.json({ error: "Челлендж, созданный основным кабинетом бренда, нельзя менять в кабинете точки." }, { status: 403 });
  if (existing.status === "active" && body?.title !== undefined) return NextResponse.json({ error: "Для запущенного челленджа нельзя менять основную информацию. Сначала верните его в черновик." }, { status: 409 });

  const data: Record<string, unknown> = {};
  if (body?.status === "draft" || body?.status === "active" || body?.status === "archived") {
    data.status = body.status;
    data.publishedAt = body.status === "active" ? existing.publishedAt ?? new Date() : existing.publishedAt;
  }
  if (existing.status !== "active") {
    for (const key of ["title", "description", "category", "mechanicType", "mechanicParams", "heroImageUrl"]) {
      if (body?.[key] !== undefined) data[key] = body[key];
    }
    if (body?.reward && typeof body.reward === "object") {
      const reward = body.reward as { title?: string };
      data.reward = reward.title ?? existing.reward;
      data.rewardData = body.reward;
    }
  }
  if (body?.status === "active" && body.reward && typeof body.reward === "object") {
    const reward = body.reward as { mode?: string; templateId?: string | null };
    if (reward.mode === "template" && reward.templateId) {
      await prisma.brandReward.updateMany({
        where: { id: reward.templateId, brandId: session.brand.id, locationId: session.location.id, source: "location", status: "draft" },
        data: { status: "active", archivedAt: null },
      });
    }
  }
  const challenge = await prisma.brandChallenge.update({ where: { id }, data });
  return NextResponse.json({ challenge });
}

export async function DELETE(_request: Request, context: RouteContext<"/api/location/challenges/[id]">) {
  const session = await requireLocationSession();
  if (!session) return locationUnauthorized();
  if (!canManageLocationCampaigns(session)) return NextResponse.json({ error: "Недостаточно прав." }, { status: 403 });
  const { id } = await context.params;

  if (session.location.mode === "EXTENDED") {
    const item = await prisma.locationChallengeRequest.findFirst({
      where: { id, brandId: session.brand.id, locationId: session.location.id, status: { in: editableRequestStatuses } },
    });
    if (!item) return NextResponse.json({ error: "Удалять можно только черновики, отклонённые заявки и заявки на доработке." }, { status: 403 });
    await prisma.locationChallengeRequest.delete({ where: { id } });
    return NextResponse.json({ deleted: true });
  }

  const challenge = await prisma.brandChallenge.findFirst({ where: { id, brandId: session.brand.id, locationIds: { has: session.location.id }, source: "location" } });
  if (!challenge) return NextResponse.json({ error: "Удалять можно только челленджи, созданные этой точкой." }, { status: 403 });
  await prisma.$transaction(async (tx) => {
    await tx.brandChallenge.delete({ where: { id } });
    await tx.locationChallengeRequest.updateMany({ where: { sourceChallengeId: id }, data: { sourceChallengeId: null } });
  });
  return NextResponse.json({ deleted: true });
}
