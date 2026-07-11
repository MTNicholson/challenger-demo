export type BrandChallengeDraft = {
  id: string;
  status: "draft";
  category: "activity" | "visit" | "purchase";
  title: string;
  description: string;
  heroImageUrl: string | null;
  mechanicType: string;
  mechanicParams: {
    visitsCount: number;
    stepsCount: number;
    dailyStepsCount: number;
    activeDaysCount: number;
    purchaseCount: number;
    minPurchaseAmount: number;
    purchaseAmount: number;
    taskDescription: string;
    visitInterval: string;
    allowDifferentLocations: boolean;
    purchaseConfirmation: string;
  };
  selectedLocationIds: string[];
  reward: {
    mode: "custom" | "template";
    templateId: string | null;
    title: string;
    description: string;
    limit: number | null;
    points: number;
    expiresInDays: number;
  };
  period: {
    startDate: string;
    endDate: string;
  };
  createdAt: string;
  updatedAt: string;
};

const STORAGE_KEY = "challenger_brand_challenges";

function canUseStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readBrandChallengeDrafts(): BrandChallengeDraft[] {
  if (!canUseStorage()) return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as BrandChallengeDraft[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getBrandChallengeDraft(id: string) {
  return readBrandChallengeDrafts().find((draft) => draft.id === id) ?? null;
}

export function saveBrandChallengeDraft(draft: BrandChallengeDraft) {
  if (!canUseStorage()) return draft;

  const drafts = readBrandChallengeDrafts();
  const nextDrafts = drafts.some((item) => item.id === draft.id)
    ? drafts.map((item) => (item.id === draft.id ? draft : item))
    : [draft, ...drafts];

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextDrafts));
  window.dispatchEvent(new Event("challenger_brand_challenges_changed"));
  return draft;
}
