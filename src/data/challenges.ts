export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeType = "qr_visit" | "visit_series" | "steps" | "coins" | "vk_share";

export type Challenge = {
  id: string;
  title: string;
  brandId: string;
  brandName: string;
  category: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  description: string;
  condition: string;
  reward: string;
  coinsReward: number;
  coinsPrice?: number;
  progress?: {
    current: number;
    total: number;
    label: string;
  };
  distanceKm?: number;
  daysLeft: number;
  isActive: boolean;
  isFeatured: boolean;
};

export const challenges: Challenge[] = [
  {
    id: "coffee-week",
    title: "Кофейная неделя",
    brandId: "coffee-place",
    brandName: "Coffee Place",
    category: "Кофе",
    type: "visit_series",
    difficulty: "easy",
    description: "Загляни в Coffee Place 5 раз за неделю и получи авторский напиток в подарок.",
    condition: "5 визитов за 7 дней",
    reward: "Авторский раф бесплатно",
    coinsReward: 120,
    progress: {
      current: 3,
      total: 5,
      label: "3 из 5 визитов",
    },
    distanceKm: 0.8,
    daysLeft: 4,
    isActive: true,
    isFeatured: true,
  },
  {
    id: "ten-thousand-steps",
    title: "10 000 шагов",
    brandId: "fitpro",
    brandName: "FitPro",
    category: "Фитнес",
    type: "steps",
    difficulty: "medium",
    description: "Пройди 10 000 шагов в день и забери бонусные монетки.",
    condition: "10 000 шагов сегодня",
    reward: "200 монеток",
    coinsReward: 200,
    progress: {
      current: 7200,
      total: 10000,
      label: "7 200 из 10 000 шагов",
    },
    distanceKm: 1.4,
    daysLeft: 1,
    isActive: true,
    isFeatured: true,
  },
  {
    id: "beauty-rewards",
    title: "Beauty Rewards",
    brandId: "beauty-store",
    brandName: "Beauty Store",
    category: "Beauty",
    type: "qr_visit",
    difficulty: "easy",
    description: "Посети Beauty Store и получи скидку на следующую процедуру.",
    condition: "1 QR-визит в точке",
    reward: "Скидка 20%",
    coinsReward: 80,
    distanceKm: 2.1,
    daysLeft: 10,
    isActive: false,
    isFeatured: false,
  },
  {
    id: "sweet-june",
    title: "Сладкий июнь",
    brandId: "sweetly-desserts",
    brandName: "Sweetly Desserts",
    category: "Десерты",
    type: "coins",
    difficulty: "medium",
    description: "Открой сладкий челлендж за монетки и получи десерт после серии визитов.",
    condition: "3 визита, вход 150 монеток",
    reward: "Десерт бесплатно",
    coinsReward: 180,
    coinsPrice: 150,
    distanceKm: 1.9,
    daysLeft: 12,
    isActive: false,
    isFeatured: true,
  },
];
