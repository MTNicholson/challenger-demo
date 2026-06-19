import { companyBrand } from "@/data/brands";

export const companyAnalytics = {
  brandId: companyBrand.id,
  activeChallenges: 2,
  followers: companyBrand.followers,
  rewardActivations: 342,
  repeatVisitsPercent: 38,
  participants: 1284,
  issuedRewards: 342,
  newParticipants: 248,
  qrScans: 1568,
  rewardConversionPercent: 27,
  visitsGrowthPercent: 18,
  totalVisits: 2146,
};

export const weeklyActivity = [
  { day: "Пн", visits: 228, participants: 146, activations: 34 },
  { day: "Вт", visits: 264, participants: 172, activations: 41 },
  { day: "Ср", visits: 251, participants: 164, activations: 38 },
  { day: "Чт", visits: 307, participants: 196, activations: 49 },
  { day: "Пт", visits: 356, participants: 224, activations: 57 },
  { day: "Сб", visits: 398, participants: 258, activations: 66 },
  { day: "Вс", visits: 342, participants: 231, activations: 57 },
];

export const rewardActivationTrend = [
  { week: "26 мая", activations: 212 },
  { week: "2 июня", activations: 248 },
  { week: "9 июня", activations: 287 },
  { week: "16 июня", activations: 342 },
];

export const locationPerformance = [
  { id: "coffee-bolshoy", name: "Coffee Place Петроградская", shortName: "Петроградская", visits: 812, scans: 604, rewards: 148, repeatVisits: 329, trend: 24 },
  { id: "coffee-nevsky", name: "Coffee Place Невский", shortName: "Невский", visits: 746, scans: 552, rewards: 119, repeatVisits: 271, trend: 16 },
  { id: "coffee-vasileostrovskaya", name: "Coffee Place Василеостровская", shortName: "Василеостровская", visits: 588, scans: 412, rewards: 75, repeatVisits: 216, trend: 11 },
];

export const challengePerformance = [
  { name: "Кофейный маршрут", participants: 482, completed: 184, conversion: 38 },
  { name: "Утренний фильтр", participants: 318, completed: 106, conversion: 33 },
  { name: "Кофе с другом", participants: 276, completed: 72, conversion: 26 },
  { name: "Пять дней подряд", participants: 208, completed: 43, conversion: 21 },
];

export const campaignAnalytics = {
  challengeId: "coffee-route",
  title: "Кофейный маршрут",
  progressPercent: 68,
  participants: 482,
  completedUsers: 184,
  rewardsIssued: 176,
  repeatVisits: 329,
  bestLocation: "Coffee Place Петроградская",
};

export const engagementFunnel = [
  { label: "Увидели челлендж", value: 4280 },
  { label: "Начали", value: 1284 },
  { label: "Сделали первый визит", value: 986 },
  { label: "Завершили", value: 382 },
  { label: "Получили награду", value: 342 },
];

export const rewardAnalytics = {
  activations: companyAnalytics.rewardActivations,
  activationGrowthPercent: 19,
  mostUsedReward: "Авторский раф бесплатно",
  mostUsedRewardActivations: 342,
};
