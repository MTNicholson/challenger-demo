import { getOptionalNumberField, getOptionalStringField, getStringField } from "@/lib/brand-settings-validation";
import { rewardTypes, type BrandRewardStatus } from "@/lib/brand-rewards";

const editableStatuses: BrandRewardStatus[] = ["active", "draft"];

export function getRewardPayload(body: Record<string, unknown> | null) {
  const title = getStringField(body, "title");
  const type = getStringField(body, "type");
  const description = getStringField(body, "description");
  const status = getStringField(body, "status") as BrandRewardStatus;
  const limit = getOptionalNumberField(body, "limit");
  const points = getOptionalNumberField(body, "points") ?? 0;
  const expiresInDays = getOptionalNumberField(body, "expiresInDays");
  const usageTerms = getOptionalStringField(body, "usageTerms");

  return { title, type, description, status, limit, points, expiresInDays, usageTerms };
}

export function validateRewardPayload(payload: ReturnType<typeof getRewardPayload>) {
  if (!payload.title || !payload.description) return "Заполните название и описание награды.";
  if (!rewardTypes.includes(payload.type as (typeof rewardTypes)[number])) return "Выберите корректный тип награды.";
  if (!editableStatuses.includes(payload.status)) return "Выберите корректный статус награды.";
  if (payload.limit !== null && payload.limit < 0) return "Лимит не может быть отрицательным.";
  if (payload.points < 0) return "Количество баллов не может быть отрицательным.";
  if (payload.expiresInDays !== null && payload.expiresInDays < 1) return "Срок действия должен быть больше нуля.";
  return null;
}
