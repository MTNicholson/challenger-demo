import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import {
  getOrCreateRewardTokenForParticipation,
  RewardTokenError,
  toRewardQrPayload,
} from "@/lib/reward-tokens";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  challengeId?: string;
  participationId?: string;
  forceRefresh?: boolean;
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Требуется вход пользователя." }, { status: 401 });

  const body = (await request.json().catch(() => null)) as Body | null;
  if (!body?.challengeId && !body?.participationId) {
    return NextResponse.json({ error: "Не указан челлендж." }, { status: 400 });
  }

  try {
    const { token, participation } = await getOrCreateRewardTokenForParticipation({
      userId: user.id,
      challengeId: body.challengeId,
      participationId: body.participationId,
      forceRefresh: body.forceRefresh === true,
    });
    const location = token.locationId
      ? await prisma.brandLocation.findFirst({
          where: { id: token.locationId, brandId: participation.challenge.brandId },
          select: { id: true, name: true, address: true },
        })
      : null;

    return NextResponse.json({
      ok: true,
      token: token.token,
      shortCode: token.shortCode,
      qrPayload: toRewardQrPayload(token.token),
      expiresAt: token.expiresAt.toISOString(),
      status: token.status,
      reward: {
        id: token.rewardId ?? participation.reward?.id ?? null,
        title: participation.reward?.title ?? participation.challenge.reward ?? "Награда от бренда",
        description: participation.reward?.description ?? null,
      },
      challenge: { id: participation.challenge.id, title: participation.challenge.title },
      brand: participation.challenge.brand,
      location: location ? { id: location.id, title: location.name ?? "Точка бренда", address: location.address } : null,
    });
  } catch (error) {
    if (error instanceof RewardTokenError) {
      const status = error.code === "NOT_FOUND" ? 404 : 409;
      return NextResponse.json({ error: error.message, code: error.code }, { status });
    }
    return NextResponse.json({ error: "Не удалось создать QR-код. Попробуйте ещё раз." }, { status: 500 });
  }
}
