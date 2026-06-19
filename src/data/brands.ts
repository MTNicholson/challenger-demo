export type Brand = {
  id: string;
  name: string;
  category: string;
  description: string;
  city: string;
  locationsCount: number;
  followers: number;
  logo: string;
  cover: string;
};

export const brands: Brand[] = [
  {
    id: "coffee-place",
    name: "Coffee Place",
    category: "Кофейня",
    description: "Городская кофейня с авторскими напитками и челленджами за визиты.",
    city: "Санкт-Петербург",
    locationsCount: 7,
    followers: 4560,
    logo: "☕",
    cover: "coffee",
  },
  {
    id: "fitpro",
    name: "FitPro",
    category: "Фитнес",
    description: "Фитнес-студия с активными челленджами, шагами и бонусами за регулярность.",
    city: "Санкт-Петербург",
    locationsCount: 3,
    followers: 2810,
    logo: "💪",
    cover: "fitness",
  },
  {
    id: "beauty-store",
    name: "Beauty Store",
    category: "Beauty",
    description: "Beauty-пространство с наградами за визиты, покупки и рекомендации.",
    city: "Санкт-Петербург",
    locationsCount: 4,
    followers: 3190,
    logo: "✨",
    cover: "beauty",
  },
];
