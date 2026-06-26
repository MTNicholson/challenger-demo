export type MapChallengeCategory =
  | "Кофе"
  | "Еда"
  | "Спорт"
  | "Beauty"
  | "Книги";

export type MapChallengePoint = {
  id: string;
  challengeId: string;
  brand: string;
  category: MapChallengeCategory;
  challenge: string;
  description: string;
  reward: number;
  distance: string;
  coordinates: [number, number];
  emoji: string;
  isActive?: boolean;
};

export const mapChallengePoints: MapChallengePoint[] = [
  {
    id: "coffee-place-center",
    challengeId: "coffee-route",
    brand: "Coffee Place",
    category: "Кофе",
    challenge: "Кофейный маршрут",
    description: "Посети 5 кофеен Coffee Place",
    reward: 200,
    distance: "450 м",
    coordinates: [59.9343, 30.3351],
    emoji: "☕",
    isActive: true,
  },
  {
    id: "fitpro-center",
    challengeId: "ten-thousand-steps",
    brand: "FitPro",
    category: "Спорт",
    challenge: "10 000 шагов",
    description: "Пройди дневную цель и получи баллы",
    reward: 200,
    distance: "1,4 км",
    coordinates: [59.942, 30.3158],
    emoji: "👟",
    isActive: true,
  },
  {
    id: "beauty-store-center",
    challengeId: "beauty-rewards",
    brand: "Beauty Store",
    category: "Beauty",
    challenge: "Beauty Rewards",
    description: "QR-визит в точке",
    reward: 80,
    distance: "2,1 км",
    coordinates: [59.9288, 30.3609],
    emoji: "✨",
  },
  {
    id: "sweetly-center",
    challengeId: "dessert-after-six",
    brand: "Sweetly Desserts",
    category: "Еда",
    challenge: "Десерт после 18:00",
    description: "Забери десерт вечером",
    reward: 90,
    distance: "1,2 км",
    coordinates: [59.9461, 30.3484],
    emoji: "🧁",
  },
  {
    id: "book-space-center",
    challengeId: "reading-weekend",
    brand: "Book Space",
    category: "Книги",
    challenge: "Книжные выходные",
    description: "1 визит и отзыв о книге",
    reward: 140,
    distance: "900 м",
    coordinates: [59.9312, 30.3061],
    emoji: "📚",
  },
  {
    id: "pet-care-center",
    challengeId: "photo-walk",
    brand: "Pet Care",
    category: "Еда",
    challenge: "Фото-прогулка",
    description: "Фото-прогулка у точки",
    reward: 90,
    distance: "1,8 км",
    coordinates: [59.951, 30.3169],
    emoji: "🐾",
  },
];
