export type BrandRewardType =
  | "gift"
  | "discount"
  | "points"
  | "service"
  | "access"
  | "custom";

export type BrandRewardStatus = "active" | "draft" | "archived";

export type BrandRewardDto = {
  id: string;
  title: string;
  type: BrandRewardType;
  description: string;
  status: BrandRewardStatus;
  limit: number | null;
  points: number;
  expiresInDays: number | null;
  usageTerms: string | null;
  issuedCount: number;
  redeemedCount: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export const rewardTypeLabels: Record<BrandRewardType, string> = {
  gift: "Подарок",
  discount: "Скидка",
  points: "Баллы",
  service: "Услуга",
  access: "Доступ",
  custom: "Другая награда",
};

export const rewardStatusLabels: Record<BrandRewardStatus, string> = {
  active: "Активна",
  draft: "Черновик",
  archived: "Архив",
};

export const rewardTypes = Object.keys(rewardTypeLabels) as BrandRewardType[];
export const editableRewardStatuses: Array<Exclude<BrandRewardStatus, "archived">> = ["active", "draft"];
