import { NextResponse } from "next/server";
import { getCurrentBrand } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { getRewardPayload, validateRewardPayload } from "@/lib/brand-reward-validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function getOwnedReward(id: string, brandId: string) {
  return prisma.brandReward.findFirst({ where: { id, brandId } });
}

export async function PATCH(request: Request, context: RouteContext<"/api/brand/rewards/[id]">) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const { id } = await context.params;
  const existing = await getOwnedReward(id, session.brand.id);
  if (!existing) return NextResponse.json({ error: "Награда не найдена." }, { status: 404 });

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const action = typeof body?.action === "string" ? body.action : null;

  if (action === "archive") {
    const reward = await prisma.brandReward.update({
      where: { id },
      data: { status: "archived", archivedAt: new Date() },
    });

    return NextResponse.json({ reward });
  }
  if (action === "restore") {
    if (existing.status !== "archived") return NextResponse.json({ error: "Вернуть можно только награду из архива." }, { status: 409 });
    const reward = await prisma.brandReward.update({ where: { id }, data: { status: "active", archivedAt: null } });
    return NextResponse.json({ reward });
  }

  const payload = getRewardPayload(body);
  const error = validateRewardPayload(payload);
  if (error) return NextResponse.json({ error }, { status: 400 });

  const reward = await prisma.brandReward.update({
    where: { id },
    data: {
      title: payload.title,
      type: payload.type,
      description: payload.description,
      status: payload.status,
      limit: payload.limit,
      points: payload.points,
      expiresInDays: payload.expiresInDays,
      usageTerms: payload.usageTerms,
      archivedAt: payload.status === "archived" ? existing.archivedAt ?? new Date() : null,
    },
  });

  return NextResponse.json({ reward });
}

export async function DELETE(_request: Request, context: RouteContext<"/api/brand/rewards/[id]">) {
  const session = await getCurrentBrand();
  if (!session) return NextResponse.json({ error: "Требуется вход бренда." }, { status: 401 });

  const { id } = await context.params;
  const existing = await getOwnedReward(id, session.brand.id);
  if (!existing) return NextResponse.json({ error: "Награда не найдена." }, { status: 404 });
  if (existing.status !== "archived") {
    return NextResponse.json({ error: "Удалить окончательно можно только архивную награду." }, { status: 400 });
  }

  await prisma.brandReward.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
