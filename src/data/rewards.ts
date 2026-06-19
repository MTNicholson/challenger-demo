export type Reward = {
  id: string;
  title: string;
  brandName: string;
  description: string;
  status: "available" | "used" | "expired";
  code: string;
  expiresAt: string;
};

export const rewards: Reward[] = [
  {
    id: "coffee-raf",
    title: "Авторский раф бесплатно",
    brandName: "Coffee Place",
    description: "Покажите QR-код сотруднику на кассе.",
    status: "available",
    code: "CP-4829",
    expiresAt: "Сегодня, 22:00",
  },
  {
    id: "beauty-discount",
    title: "Скидка 20%",
    brandName: "Beauty Store",
    description: "Действует на следующую процедуру.",
    status: "available",
    code: "BS-1940",
    expiresAt: "5 дней",
  },
];
