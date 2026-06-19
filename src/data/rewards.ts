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
