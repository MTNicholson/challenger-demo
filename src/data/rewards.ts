export type Reward = {
  id: string;
  title: string;
  brandId: string;
  brandName: string;
  description: string;
  status: "available" | "used" | "expired";
  code: string;
  expiresAt: string;
  type: "QR" | "Промокод";
  emoji: string;
};

export const rewards: Reward[] = [
  {
    id: "coffee-raf",
    title: "Авторский раф бесплатно",
    brandId: "coffee-place",
    brandName: "Coffee Place",
    description: "Получено за прохождение кофейного маршрута.",
    status: "available",
    code: "CP-4829",
    expiresAt: "Сегодня, 22:00",
    type: "QR",
    emoji: "☕",
  },
  {
    id: "beauty-discount",
    title: "Скидка 20%",
    brandId: "beauty-store",
    brandName: "Beauty Store",
    description: "Действует на следующую процедуру или консультацию.",
    status: "available",
    code: "BS-1940",
    expiresAt: "5 дней",
    type: "Промокод",
    emoji: "✨",
  },
  {
    id: "sweet-dessert",
    title: "Десерт бесплатно",
    brandId: "sweetly-desserts",
    brandName: "Sweetly Desserts",
    description: "Можно обменять на чизкейк, тарт или десерт дня.",
    status: "available",
    code: "SD-0618",
    expiresAt: "7 дней",
    type: "QR",
    emoji: "🍰",
  },
  {
    id: "fitpro-water",
    title: "Изотоник после тренировки",
    brandId: "fitpro",
    brandName: "FitPro",
    description: "Награда за дневную цель по шагам.",
    status: "used",
    code: "FP-7200",
    expiresAt: "Использовано",
    type: "QR",
    emoji: "👟",
  },
];

export function getAvailableRewards() {
  return rewards.filter((reward) => reward.status === "available");
}

export type BrandReward = {
  id: string;
  title: string;
  description: string;
  status: "active" | "draft" | "paused";
  rewardType: "drink" | "discount" | "bonus";
  activations: number;
  stockLabel: string;
  stockPercent: number;
  challengeTitle: string;
  emoji: string;
  qrEnabled?: boolean;
};

export const coffeePlaceRewards: BrandReward[] = [
  {
    id: "coffee-drink-choice",
    title: "Напиток на выбор",
    description: "Любой напиток стандартного размера за завершение маршрута.",
    status: "active",
    rewardType: "drink",
    activations: 342,
    stockLabel: "158 из 500",
    stockPercent: 32,
    challengeTitle: "Кофейный маршрут",
    emoji: "☕",
    qrEnabled: true,
  },
  {
    id: "coffee-morning-discount",
    title: "Скидка 20% до полудня",
    description: "Скидка на заказ в будни с 08:00 до 12:00.",
    status: "paused",
    rewardType: "discount",
    activations: 96,
    stockLabel: "Бюджет 24 000 ₽",
    stockPercent: 48,
    challengeTitle: "Утренний фильтр",
    emoji: "%",
  },
  {
    id: "coffee-bonus-coins",
    title: "50 бонусных монет",
    description: "Бонус за серию из пяти визитов подряд.",
    status: "draft",
    rewardType: "bonus",
    activations: 0,
    stockLabel: "Бюджет 50 000",
    stockPercent: 100,
    challengeTitle: "Пять дней подряд",
    emoji: "✦",
  },
];
