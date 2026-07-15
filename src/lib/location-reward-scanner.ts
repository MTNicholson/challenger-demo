import "server-only";

import { Prisma, RewardScanLogStatus, RewardTokenStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type LocationSession = NonNullable<Awaited<ReturnType<typeof import("@/lib/auth-server").getCurrentLocationSession>>>;
type DatabaseClient = Prisma.TransactionClient | typeof prisma;

const tokenInclude = {
  challenge: { include: { brand: { select: { id: true, name: true } } } },
  participation: { include: { user: { select: { id: true, name: true } }, reward: true } },
} satisfies Prisma.RewardTokenInclude;

type TokenWithDetails = Prisma.RewardTokenGetPayload<{ include: typeof tokenInclude }>;
export type ScannerStatus = "VALID" | "NOT_FOUND" | "EXPIRED" | "ALREADY_REDEEMED" | "WRONG_LOCATION" | "CHALLENGE_NOT_COMPLETED" | "CANCELLED" | "ERROR";

export type ScannerValidation =
  | { ok: true; status: "VALID"; token: TokenWithDetails; rewardType: string }
  | { ok: false; status: Exclude<ScannerStatus, "VALID">; message: string; token?: TokenWithDetails };

function normalizeShortCode(value: string) {
  const compact = value.replace(/[\s-]/g, "").toUpperCase();
  return /^[A-Z0-9]{6}$/.test(compact) ? `${compact.slice(0, 3)}-${compact.slice(3)}` : null;
}

export function normalizeRewardScanCode(rawCode: string) {
  const value = rawCode.trim();
  if (!value) return { token: null, shortCode: null };
  if (value.toLowerCase().startsWith("reward:")) return { token: value.slice(7).trim(), shortCode: null };

  try {
    const url = new URL(value, "https://challenger.local");
    const queryToken = url.searchParams.get("token");
    if (queryToken) return { token: queryToken.trim(), shortCode: null };
    const parts = url.pathname.split("/").filter(Boolean);
    const rewardIndex = parts.findIndex((part) => part === "reward");
    if (rewardIndex >= 0 && parts[rewardIndex + 1]) return { token: parts[rewardIndex + 1], shortCode: null };
  } catch {
    // Обычный ручной код не обязан быть URL.
  }

  const shortCode = normalizeShortCode(value);
  return shortCode ? { token: null, shortCode } : { token: value, shortCode: null };
}

function messageForStatus(status: Exclude<ScannerStatus, "VALID">) {
  const messages: Record<Exclude<ScannerStatus, "VALID">, string> = {
    NOT_FOUND: "Код не найден. Проверьте QR или ручной код.",
    EXPIRED: "QR-код истёк. Попросите пользователя обновить код.",
    ALREADY_REDEEMED: "Награда уже использована.",
    WRONG_LOCATION: "Награда не относится к этой точке.",
    CHALLENGE_NOT_COMPLETED: "Челлендж ещё не завершён.",
    CANCELLED: "QR-код больше не действует.",
    ERROR: "Не удалось проверить QR-код.",
  };
  return messages[status];
}

async function getRewardType(db: DatabaseClient, token: TokenWithDetails) {
  if (!token.rewardId) return "custom";
  const reward = await db.brandReward.findFirst({ where: { id: token.rewardId, brandId: token.brandId }, select: { type: true } });
  return reward?.type ?? "custom";
}

async function checkTokenForLocation(db: DatabaseClient, token: TokenWithDetails, session: LocationSession): Promise<ScannerValidation> {
  if (token.brandId !== session.brand.id) return { ok: false, status: "WRONG_LOCATION", message: messageForStatus("WRONG_LOCATION"), token };
  if (token.status === RewardTokenStatus.REDEEMED || token.participation.reward?.status === "used") return { ok: false, status: "ALREADY_REDEEMED", message: messageForStatus("ALREADY_REDEEMED"), token };
  if (token.status === RewardTokenStatus.CANCELLED) return { ok: false, status: "CANCELLED", message: messageForStatus("CANCELLED"), token };

  const now = new Date();
  if (token.status === RewardTokenStatus.EXPIRED || token.expiresAt <= now) {
    if (token.status === RewardTokenStatus.ACTIVE) {
      await db.rewardToken.updateMany({ where: { id: token.id, status: RewardTokenStatus.ACTIVE }, data: { status: RewardTokenStatus.EXPIRED } });
    }
    return { ok: false, status: "EXPIRED", message: messageForStatus("EXPIRED"), token };
  }
  if (token.status !== RewardTokenStatus.ACTIVE) return { ok: false, status: "ERROR", message: messageForStatus("ERROR"), token };
  if (token.participation.status !== "completed" || !token.participation.completedAt) return { ok: false, status: "CHALLENGE_NOT_COMPLETED", message: messageForStatus("CHALLENGE_NOT_COMPLETED"), token };
  if (token.locationId && token.locationId !== session.location.id) return { ok: false, status: "WRONG_LOCATION", message: messageForStatus("WRONG_LOCATION"), token };
  if (!token.locationId && token.challenge.locationIds.length > 0 && !token.challenge.locationIds.includes(session.location.id)) {
    return { ok: false, status: "WRONG_LOCATION", message: messageForStatus("WRONG_LOCATION"), token };
  }
  return { ok: true, status: "VALID", token, rewardType: await getRewardType(db, token) };
}

async function findTokenByCode(db: DatabaseClient, rawCode: string) {
  const normalized = normalizeRewardScanCode(rawCode);
  if (!normalized.token && !normalized.shortCode) return null;
  return db.rewardToken.findFirst({
    where: normalized.shortCode ? { shortCode: normalized.shortCode } : { token: normalized.token ?? "" },
    include: tokenInclude,
  });
}

export async function validateRewardTokenForLocation(rawCode: string, session: LocationSession): Promise<ScannerValidation> {
  const token = await findTokenByCode(prisma, rawCode);
  if (!token) return { ok: false, status: "NOT_FOUND", message: messageForStatus("NOT_FOUND") };
  return checkTokenForLocation(prisma, token, session);
}

export async function createRewardScanLog({
  session,
  status,
  message,
  token,
}: {
  session: LocationSession;
  status: ScannerStatus;
  message: string;
  token?: TokenWithDetails;
}) {
  const logStatus = status === "VALID" ? RewardScanLogStatus.VALIDATED : RewardScanLogStatus[status];
  return prisma.rewardScanLog.create({
    data: {
      brandId: session.brand.id,
      locationId: session.location.id,
      locationUserId: session.user.id,
      userId: token?.userId,
      rewardTokenId: token?.id,
      challengeId: token?.challengeId,
      rewardId: token?.rewardId,
      status: logStatus,
      codeRaw: token?.shortCode ?? null,
      message,
    },
  });
}

export function toScannerPayload(validation: Extract<ScannerValidation, { ok: true }>, session: LocationSession) {
  const { token } = validation;
  return {
    tokenId: token.id,
    reward: { title: token.participation.reward?.title ?? token.challenge.reward ?? "Награда от бренда", description: token.participation.reward?.description ?? null, type: validation.rewardType },
    challenge: { title: token.challenge.title },
    brand: { name: token.challenge.brand.name },
    user: { displayName: token.participation.user.name },
    location: { title: session.location.name ?? "Точка бренда", address: session.location.fullAddress ?? session.location.address },
    expiresAt: token.expiresAt.toISOString(),
    shortCode: token.shortCode,
  };
}

export async function redeemRewardTokenForLocation(tokenId: string, session: LocationSession) {
  return prisma.$transaction(async (tx) => {
    const token = await tx.rewardToken.findUnique({ where: { id: tokenId }, include: tokenInclude });
    if (!token) return { ok: false as const, status: "NOT_FOUND" as const, message: messageForStatus("NOT_FOUND") };
    const validation = await checkTokenForLocation(tx, token, session);
    if (!validation.ok) {
      await tx.rewardScanLog.create({ data: { brandId: session.brand.id, locationId: session.location.id, locationUserId: session.user.id, userId: token.userId, rewardTokenId: token.id, challengeId: token.challengeId, rewardId: token.rewardId, status: RewardScanLogStatus[validation.status], codeRaw: token.shortCode, message: validation.message } });
      return validation;
    }

    const now = new Date();
    const updated = await tx.rewardToken.updateMany({
      where: { id: token.id, status: RewardTokenStatus.ACTIVE, expiresAt: { gt: now } },
      data: { status: RewardTokenStatus.REDEEMED, redeemedAt: now, redeemedByLocationUserId: session.user.id, redeemedAtLocationId: session.location.id },
    });
    if (updated.count !== 1) {
      const current = await tx.rewardToken.findUnique({ where: { id: token.id }, include: tokenInclude });
      const currentValidation = current ? await checkTokenForLocation(tx, current, session) : { ok: false as const, status: "NOT_FOUND" as const, message: messageForStatus("NOT_FOUND") };
      if (!currentValidation.ok && current) await tx.rewardScanLog.create({ data: { brandId: session.brand.id, locationId: session.location.id, locationUserId: session.user.id, userId: current.userId, rewardTokenId: current.id, challengeId: current.challengeId, rewardId: current.rewardId, status: RewardScanLogStatus[currentValidation.status], codeRaw: current.shortCode, message: currentValidation.message } });
      return currentValidation;
    }

    if (token.participation.reward) await tx.userReward.update({ where: { participationId: token.participationId }, data: { status: "used", usedAt: now } });
    if (token.rewardId) await tx.brandReward.updateMany({ where: { id: token.rewardId, brandId: session.brand.id }, data: { redeemedCount: { increment: 1 } } });
    await tx.userChallengeEvent.create({ data: { userId: token.userId, challengeId: token.challengeId, participationId: token.participationId, type: "reward_redeemed", metadata: { locationId: session.location.id, locationUserId: session.user.id, shortCode: token.shortCode } } });
    await tx.rewardScanLog.create({ data: { brandId: session.brand.id, locationId: session.location.id, locationUserId: session.user.id, userId: token.userId, rewardTokenId: token.id, challengeId: token.challengeId, rewardId: token.rewardId, status: RewardScanLogStatus.REDEEMED, codeRaw: token.shortCode, message: "Награда выдана" } });
    return { ok: true as const, status: "REDEEMED" as const, message: "Награда выдана", redeemedAt: now.toISOString(), ...toScannerPayload(validation, session) };
  });
}
