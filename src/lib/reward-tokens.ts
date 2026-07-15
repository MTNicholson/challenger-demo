import "server-only";

import { randomBytes } from "crypto";
import { Prisma, RewardTokenStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const REWARD_TOKEN_TTL_MS = 60 * 60 * 1000;

export class RewardTokenError extends Error {
  constructor(
    public readonly code: "NOT_FOUND" | "NOT_COMPLETED" | "REDEEMED",
    message: string,
  ) {
    super(message);
  }
}

function createOpaqueToken() {
  return randomBytes(32).toString("base64url");
}

function createShortCode() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  const value = Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("");
  return `${value.slice(0, 3)}-${value.slice(3)}`;
}

function rewardIdFromData(rewardData: Prisma.JsonValue | null) {
  if (!rewardData || typeof rewardData !== "object" || Array.isArray(rewardData)) return null;
  const value = (rewardData as Record<string, unknown>).rewardId;
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function toRewardQrPayload(token: string) {
  return `reward:${token}`;
}

export async function getOrCreateRewardTokenForParticipation({
  userId,
  challengeId,
  participationId,
  forceRefresh = false,
}: {
  userId: string;
  challengeId?: string;
  participationId?: string;
  forceRefresh?: boolean;
}) {
  return prisma.$transaction(async (tx) => {
    const participation = await tx.userChallenge.findFirst({
      where: {
        userId,
        ...(participationId ? { id: participationId } : {}),
        ...(challengeId ? { challengeId } : {}),
      },
      include: {
        reward: true,
        challenge: { include: { brand: { select: { id: true, name: true, logoUrl: true } } } },
      },
    });

    if (!participation) throw new RewardTokenError("NOT_FOUND", "Участие в челлендже не найдено.");
    if (participation.status !== "completed" || !participation.completedAt) {
      throw new RewardTokenError("NOT_COMPLETED", "Награда станет доступна после выполнения челленджа.");
    }
    if (participation.reward?.status === "used") {
      throw new RewardTokenError("REDEEMED", "Награда уже использована.");
    }

    const now = new Date();
    await tx.rewardToken.updateMany({
      where: { participationId: participation.id, status: RewardTokenStatus.ACTIVE, expiresAt: { lte: now } },
      data: { status: RewardTokenStatus.EXPIRED },
    });

    const redeemedToken = await tx.rewardToken.findFirst({
      where: { participationId: participation.id, status: RewardTokenStatus.REDEEMED },
      orderBy: { redeemedAt: "desc" },
    });
    if (redeemedToken) throw new RewardTokenError("REDEEMED", "Награда уже использована.");

    if (forceRefresh) {
      await tx.rewardToken.updateMany({
        where: { participationId: participation.id, status: RewardTokenStatus.ACTIVE },
        data: { status: RewardTokenStatus.CANCELLED },
      });
    } else {
      const currentToken = await tx.rewardToken.findFirst({
        where: { participationId: participation.id, status: RewardTokenStatus.ACTIVE, expiresAt: { gt: now } },
        orderBy: { createdAt: "desc" },
      });
      if (currentToken) return { token: currentToken, participation };
    }

    const expiresAt = new Date(now.getTime() + REWARD_TOKEN_TTL_MS);
    let createdToken = null;
    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        createdToken = await tx.rewardToken.create({
          data: {
            token: createOpaqueToken(),
            shortCode: createShortCode(),
            userId,
            brandId: participation.challenge.brandId,
            challengeId: participation.challengeId,
            participationId: participation.id,
            rewardId: rewardIdFromData(participation.challenge.rewardData),
            locationId: participation.challenge.locationIds.length === 1 ? participation.challenge.locationIds[0] : null,
            status: RewardTokenStatus.ACTIVE,
            expiresAt,
          },
        });
        break;
      } catch (error) {
        if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== "P2002" || attempt === 4) throw error;
      }
    }

    if (!createdToken) throw new Error("Не удалось выпустить QR-код награды.");
    return { token: createdToken, participation };
  });
}
