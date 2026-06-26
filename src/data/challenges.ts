import { getBrandById } from "@/data/brands";

export type ChallengeDifficulty = "easy" | "medium" | "hard";
export type ChallengeType =
  | "qr_visit"
  | "visit_series"
  | "steps"
  | "coins"
  | "photo"
  | "morning";

export type Challenge = {
  id: string;
  slug?: string;
  title: string;
  brandId: string;
  brandName: string;
  category: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  description: string;
  shortDescription?: string;
  fullDescription?: string;
  condition: string;
  reward: string;
  coinsReward: number;
  coinsPrice?: number;
  emoji: string;
  cardClassName: string;
  progress?: {
    current: number;
    total: number;
    label: string;
  };
  distanceKm?: number;
  daysLeft: number;
  participants: number;
  isActive: boolean;
  isFeatured: boolean;
  image?: string;
  brandLogo?: string;
  qrCodeValue?: string;
};

export const challenges: Challenge[] = [
  {
    id: "coffee-route",
    slug: "coffee-route",
    title: "Кофейный маршрут",
    brandId: "coffee-place",
    brandName: "Coffee Place",
    category: "Кофе",
    type: "visit_series",
    difficulty: "easy",
    description:
      "Загляните в пять разных Coffee Place за неделю и соберите маршрут любимых напитков.",
    shortDescription: "Посети 5 кофеен сети Coffee Place",
    fullDescription:
      "Открой новые места, собери кофейный маршрут по городу и получи награду от нашей сети кофеен.",
    condition: "5 визитов за 7 дней",
    reward: "Авторский раф бесплатно",
    coinsReward: 200,
    emoji: "☕",
    cardClassName:
      "min-h-64 bg-[linear-gradient(145deg,#111827,#334155)] text-white",
    progress: {
      current: 3,
      total: 5,
      label: "3 из 5 визитов",
    },
    distanceKm: 0.45,
    daysLeft: 4,
    participants: 482,
    isActive: true,
    isFeatured: true,
    image: "/landing/challenges/coffee.webp",
    qrCodeValue: "CHALLENGER:COFFEE-ROUTE:DEMO-VISIT",
  },
  {
    id: "ten-thousand-steps",
    title: "10 000 шагов",
    brandId: "fitpro",
    brandName: "FitPro",
    category: "Фитнес",
    type: "steps",
    difficulty: "medium",
    description:
      "Пройдите 10 000 шагов за день и получите бонусные баллы от FitPro.",
    condition: "10 000 шагов сегодня",
    reward: "200 баллов",
    coinsReward: 200,
    emoji: "👟",
    cardClassName: "min-h-48 bg-sky-100 text-sky-950",
    progress: {
      current: 7200,
      total: 10000,
      label: "7 200 из 10 000 шагов",
    },
    distanceKm: 1.4,
    daysLeft: 1,
    participants: 931,
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
    description:
      "Посетите Beauty Store, отсканируйте QR на кассе и получите скидку на следующую процедуру.",
    condition: "1 QR-визит в точке",
    reward: "Скидка 20%",
    coinsReward: 80,
    emoji: "✨",
    cardClassName: "min-h-64 bg-violet-100 text-violet-950",
    distanceKm: 2.1,
    daysLeft: 10,
    participants: 286,
    isActive: false,
    isFeatured: false,
  },
  {
    id: "sweet-june",
    title: "Сладкий июнь",
    brandId: "sweetly-desserts",
    brandName: "Sweetly Desserts",
    category: "Еда",
    type: "coins",
    difficulty: "medium",
    description:
      "Откройте сезонный челлендж за баллы и соберите три сладкие отметки в июне.",
    condition: "3 визита, вход 150 баллов",
    reward: "Десерт бесплатно",
    coinsReward: 180,
    coinsPrice: 150,
    emoji: "🍓",
    cardClassName: "min-h-48 bg-rose-100 text-rose-950",
    distanceKm: 1.9,
    daysLeft: 12,
    participants: 367,
    isActive: false,
    isFeatured: true,
  },
  {
    id: "book-challenge",
    title: "Книжный челлендж",
    brandId: "book-space",
    brandName: "Book Space",
    category: "Книги",
    type: "qr_visit",
    difficulty: "medium",
    description:
      "Зайдите в Book Space, выберите книгу месяца и получите баллы за короткий отзыв.",
    condition: "1 визит и отзыв о книге",
    reward: "Закладка и 140 баллов",
    coinsReward: 140,
    emoji: "📚",
    cardClassName: "min-h-48 bg-lime-100 text-lime-950",
    distanceKm: 2.8,
    daysLeft: 8,
    participants: 154,
    isActive: false,
    isFeatured: true,
  },
  {
    id: "photo-walk",
    title: "Фото-прогулка",
    brandId: "pet-care",
    brandName: "Pet Care",
    category: "Питомцы",
    type: "photo",
    difficulty: "easy",
    description:
      "Сделайте фото с прогулки рядом с партнерской точкой Pet Care и получите бонус для питомца.",
    condition: "Фото-прогулка у точки",
    reward: "Скидка 15% на уход",
    coinsReward: 90,
    emoji: "📸",
    cardClassName: "min-h-44 bg-teal-100 text-teal-950",
    distanceKm: 3.2,
    daysLeft: 6,
    participants: 211,
    isActive: false,
    isFeatured: false,
  },
  {
    id: "morning-filter",
    title: "Утренний фильтр",
    brandId: "coffee-place",
    brandName: "Coffee Place",
    category: "Кофе",
    type: "morning",
    difficulty: "easy",
    description:
      "Зайдите за фильтр-кофе до 11:00 и получите утренние баллы к балансу.",
    condition: "Визит до 11:00",
    reward: "60 баллов",
    coinsReward: 60,
    emoji: "🌤️",
    cardClassName: "min-h-44 bg-amber-100 text-amber-950",
    progress: {
      current: 0,
      total: 1,
      label: "0 из 1 визита",
    },
    distanceKm: 0.8,
    daysLeft: 3,
    participants: 318,
    isActive: true,
    isFeatured: false,
  },
  {
    id: "dessert-after-six",
    title: "Десерт после 18:00",
    brandId: "sweetly-desserts",
    brandName: "Sweetly Desserts",
    category: "Еда",
    type: "qr_visit",
    difficulty: "easy",
    description:
      "Приходите за десертом вечером, сканируйте QR и забирайте бонусные баллы.",
    condition: "Визит после 18:00",
    reward: "90 баллов",
    coinsReward: 90,
    emoji: "🧁",
    cardClassName: "min-h-44 bg-emerald-100 text-emerald-950",
    distanceKm: 1.2,
    daysLeft: 5,
    participants: 256,
    isActive: false,
    isFeatured: false,
  },
  {
    id: "reading-weekend",
    title: "Книжные выходные",
    brandId: "book-space",
    brandName: "Book Space",
    category: "Книги",
    type: "visit_series",
    difficulty: "easy",
    description:
      "Загляните в Book Space на выходных, выберите книгу месяца и получите баллы за новый читательский маршрут.",
    condition: "2 визита за выходные",
    reward: "120 баллов",
    coinsReward: 120,
    emoji: "📖",
    cardClassName: "min-h-44 bg-lime-100 text-lime-950",
    distanceKm: 2.5,
    daysLeft: 7,
    participants: 128,
    isActive: false,
    isFeatured: false,
  },
  {
    id: "stretch-break",
    title: "Перерыв на разминку",
    brandId: "fitpro",
    brandName: "FitPro",
    category: "Фитнес",
    type: "steps",
    difficulty: "easy",
    description:
      "Сделайте короткую разминку в течение рабочего дня и отметьте активность в челлендже FitPro.",
    condition: "3 активных перерыва за день",
    reward: "70 баллов",
    coinsReward: 70,
    emoji: "🧘",
    cardClassName: "min-h-44 bg-sky-100 text-sky-950",
    distanceKm: 1.7,
    daysLeft: 4,
    participants: 204,
    isActive: false,
    isFeatured: false,
  },
];

export function getChallengeById(id: string) {
  return challenges.find((challenge) => challenge.id === id);
}

export function getActiveChallenges() {
  return challenges.filter((challenge) => challenge.isActive);
}

export function getFeaturedChallenges() {
  return challenges.filter((challenge) => challenge.isFeatured);
}

export function getBrandChallenges(brandId: string) {
  return challenges.filter((challenge) => challenge.brandId === brandId);
}

export function getChallengeBrand(challengeId: string) {
  const challenge = getChallengeById(challengeId);
  return challenge ? getBrandById(challenge.brandId) : undefined;
}
