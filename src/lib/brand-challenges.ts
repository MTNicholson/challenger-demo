import type { BrandChallenge, Prisma } from "@prisma/client";

export type BrandChallengeStatus = "draft" | "scheduled" | "active" | "completed";

export type BrandChallengePayload = {
  title: string;
  description: string;
  category: "activity" | "visit" | "purchase";
  mechanicType: string;
  mechanicParams: Record<string, unknown>;
  reward: {
    mode: "custom" | "template";
    templateId: string | null;
    title: string;
    description: string;
    limit: number | null;
    points: number;
    expiresInDays: number;
  };
  heroImageUrl: string | null;
  locationIds: string[];
  startDate: string;
  endDate: string;
  status: BrandChallengeStatus;
  scheduledAt?: string | null;
};

export type BrandChallengeDto = Omit<BrandChallenge, "startsAt" | "endsAt" | "scheduledAt" | "publishedAt" | "createdAt" | "updatedAt" | "mechanicParams" | "rewardData"> & {
  startsAt: string | null;
  endsAt: string | null;
  scheduledAt: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  mechanicParams: Record<string, unknown> | null;
  rewardData: BrandChallengePayload["reward"] | null;
};

export function serializeBrandChallenge(challenge: BrandChallenge): BrandChallengeDto {
  return {
    ...challenge,
    status: challenge.status as BrandChallengeStatus,
    startsAt: challenge.startsAt?.toISOString() ?? null,
    endsAt: challenge.endsAt?.toISOString() ?? null,
    scheduledAt: challenge.scheduledAt?.toISOString() ?? null,
    publishedAt: challenge.publishedAt?.toISOString() ?? null,
    createdAt: challenge.createdAt.toISOString(),
    updatedAt: challenge.updatedAt.toISOString(),
    mechanicParams: challenge.mechanicParams as Record<string, unknown> | null,
    rewardData: challenge.rewardData as BrandChallengePayload["reward"] | null,
  };
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function asNumber(value: unknown, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function toStoredDate(value: string) {
  if (!value) return null;
  const russianDate = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
  if (russianDate) {
    const [, day, month, year] = russianDate;
    return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function parseBrandChallengePayload(body: unknown): BrandChallengePayload | null {
  if (!body || typeof body !== "object") return null;
  const input = body as Record<string, unknown>;
  const category = asString(input.category);
  const status = asString(input.status);
  const rewardInput = input.reward && typeof input.reward === "object" ? input.reward as Record<string, unknown> : null;
  const locationIds = Array.isArray(input.locationIds) ? input.locationIds.filter((id): id is string => typeof id === "string") : [];
  const mechanicParams = input.mechanicParams && typeof input.mechanicParams === "object" && !Array.isArray(input.mechanicParams)
    ? input.mechanicParams as Record<string, unknown>
    : {};

  if (!asString(input.title) || !["activity", "visit", "purchase"].includes(category) || !["draft", "scheduled", "active", "completed"].includes(status) || !rewardInput) return null;

  const scheduledAt = input.scheduledAt === null || input.scheduledAt === undefined ? null : asString(input.scheduledAt);
  if (status === "scheduled" && (!scheduledAt || Number.isNaN(new Date(scheduledAt).getTime()))) return null;

  return {
    title: asString(input.title),
    description: asString(input.description),
    category: category as BrandChallengePayload["category"],
    mechanicType: asString(input.mechanicType),
    mechanicParams,
    reward: {
      mode: asString(rewardInput.mode) === "template" ? "template" : "custom",
      templateId: typeof rewardInput.templateId === "string" ? rewardInput.templateId : null,
      title: asString(rewardInput.title),
      description: asString(rewardInput.description),
      limit: typeof rewardInput.limit === "number" && Number.isFinite(rewardInput.limit) ? rewardInput.limit : null,
      points: asNumber(rewardInput.points),
      expiresInDays: asNumber(rewardInput.expiresInDays),
    },
    heroImageUrl: typeof input.heroImageUrl === "string" && input.heroImageUrl ? input.heroImageUrl : null,
    locationIds,
    startDate: asString(input.startDate),
    endDate: asString(input.endDate),
    status: status as BrandChallengeStatus,
    scheduledAt,
  };
}

export function toBrandChallengeData(payload: BrandChallengePayload): Omit<Prisma.BrandChallengeUncheckedCreateInput, "brandId"> {
  const publishedAt = payload.status === "active" ? new Date() : null;
  return {
    title: payload.title,
    description: payload.description || null,
    status: payload.status,
    type: payload.category,
    category: payload.category,
    mechanicType: payload.mechanicType || null,
    mechanicParams: payload.mechanicParams as Prisma.InputJsonValue,
    reward: payload.reward.title || null,
    rewardData: payload.reward as Prisma.InputJsonValue,
    heroImageUrl: payload.heroImageUrl,
    locationIds: payload.locationIds,
    startsAt: toStoredDate(payload.startDate),
    endsAt: toStoredDate(payload.endDate),
    scheduledAt: payload.status === "scheduled" && payload.scheduledAt ? new Date(payload.scheduledAt) : null,
    publishedAt,
  };
}
