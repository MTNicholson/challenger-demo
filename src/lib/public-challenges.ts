import "server-only";

import type { Brand, BrandChallenge } from "@prisma/client";
import type { Challenge, ChallengeType } from "@/data/challenges";
import { prisma } from "@/lib/prisma";

const categoryLabels: Record<string, string> = {
  activity: "Активность",
  visit: "Посещение",
  purchase: "Покупки",
};

function challengeType(mechanicType: string | null): ChallengeType {
  if (mechanicType === "qr_visit") return "qr_visit";
  if (mechanicType?.includes("step")) return "steps";
  if (mechanicType?.includes("purchase") || mechanicType === "receipt_upload") return "coins";
  if (mechanicType?.includes("photo") || mechanicType === "video_task") return "photo";
  return "visit_series";
}

function getCondition(challenge: BrandChallenge) {
  const params = challenge.mechanicParams as Record<string, unknown> | null;
  if (!params) return "Условия указаны брендом";
  if (challenge.mechanicType === "qr_visit") return "1 QR-визит";
  if (challenge.mechanicType?.includes("step")) {
    const value = typeof params.dailyStepsCount === "number" ? params.dailyStepsCount : params.stepsCount;
    return typeof value === "number" ? `${value.toLocaleString("ru-RU")} шагов` : "Активность в приложении";
  }
  if (challenge.mechanicType?.includes("purchase")) {
    const value = params.purchaseCount;
    return typeof value === "number" ? `${value} покупок` : "Покупка в точке бренда";
  }
  const visits = params.visitsCount;
  return typeof visits === "number" ? `${visits} визитов` : "Посетите точки бренда";
}

function getRewardPoints(challenge: BrandChallenge) {
  const reward = challenge.rewardData as { points?: unknown } | null;
  return typeof reward?.points === "number" ? reward.points : 0;
}

function getDaysLeft(endsAt: Date | null) {
  if (!endsAt) return 14;
  return Math.max(0, Math.ceil((endsAt.getTime() - Date.now()) / 86_400_000));
}

function serializeChallenge(challenge: BrandChallenge & { brand: Brand }, index: number): Challenge {
  return {
    id: challenge.id,
    title: challenge.title,
    brandId: challenge.brandId,
    brandName: challenge.brand.name,
    brandLogo: challenge.brand.logoUrl ?? undefined,
    category: categoryLabels[challenge.category ?? challenge.type ?? ""] ?? challenge.brand.category ?? "Челлендж",
    type: challengeType(challenge.mechanicType),
    difficulty: "medium",
    description: challenge.description ?? "Описание челленджа появится здесь.",
    condition: getCondition(challenge),
    reward: challenge.reward ?? "Награда от бренда",
    coinsReward: getRewardPoints(challenge),
    emoji: challenge.category === "purchase" ? "🛍️" : challenge.category === "activity" ? "✨" : "📍",
    cardClassName: "min-h-48 bg-slate-100 text-slate-950",
    distanceKm: Number((0.4 + index * 0.7).toFixed(1)),
    daysLeft: getDaysLeft(challenge.endsAt),
    participants: 0,
    isActive: false,
    isFeatured: true,
    image: challenge.heroImageUrl ?? challenge.brand.coverImageUrl ?? "/landing/challenges/coffee.webp",
    startDate: challenge.startsAt?.toISOString().slice(0, 10),
    endDate: challenge.endsAt?.toISOString().slice(0, 10),
  };
}

export async function getPublishedUserChallenges(): Promise<Challenge[]> {
  const challenges = await prisma.brandChallenge.findMany({
    where: { status: "active" },
    include: { brand: true },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return challenges.map(serializeChallenge);
}

export async function getPublishedUserChallengeById(id: string): Promise<Challenge | null> {
  const challenge = await prisma.brandChallenge.findFirst({
    where: { id, status: "active" },
    include: { brand: true },
  });
  return challenge ? serializeChallenge(challenge, 0) : null;
}
