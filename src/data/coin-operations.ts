export type CoinOperationGroup = "Сегодня" | "Вчера" | "Ранее";

export type CoinOperation = {
  id: string;
  title: string;
  date: string;
  amount: number;
  emoji: string;
  group: CoinOperationGroup;
};

export const coinOperations: CoinOperation[] = [
  {
    id: "coffee-route",
    title: "Кофейный маршрут",
    date: "Сегодня",
    amount: 200,
    emoji: "☕",
    group: "Сегодня",
  },
  {
    id: "daily-task",
    title: "Задача дня",
    date: "Сегодня",
    amount: 10,
    emoji: "✨",
    group: "Сегодня",
  },
  {
    id: "sweet-june",
    title: "Сладкий июнь",
    date: "Вчера",
    amount: -150,
    emoji: "🍓",
    group: "Вчера",
  },
  {
    id: "ten-thousand-steps",
    title: "10 000 шагов",
    date: "15 июня",
    amount: 120,
    emoji: "👟",
    group: "Ранее",
  },
  {
    id: "login-bonus",
    title: "Бонус за вход",
    date: "14 июня",
    amount: 10,
    emoji: "🎉",
    group: "Ранее",
  },
  {
    id: "beauty-rewards",
    title: "Beauty Rewards",
    date: "13 июня",
    amount: 80,
    emoji: "✨",
    group: "Ранее",
  },
  {
    id: "book-challenge",
    title: "Книжный челлендж",
    date: "12 июня",
    amount: 140,
    emoji: "📚",
    group: "Ранее",
  },
  {
    id: "dessert-after-six",
    title: "Десерт после 18:00",
    date: "11 июня",
    amount: 90,
    emoji: "🧁",
    group: "Ранее",
  },
  {
    id: "new-place",
    title: "Посещение новой точки",
    date: "10 июня",
    amount: 30,
    emoji: "📍",
    group: "Ранее",
  },
  {
    id: "brand-bonus",
    title: "Бонус от бренда",
    date: "9 июня",
    amount: 100,
    emoji: "🎁",
    group: "Ранее",
  },
  {
    id: "morning-filter",
    title: "Утренний фильтр",
    date: "8 июня",
    amount: 60,
    emoji: "🌤️",
    group: "Ранее",
  },
  {
    id: "reward-activation",
    title: "Активация награды",
    date: "7 июня",
    amount: -200,
    emoji: "🏆",
    group: "Ранее",
  },
];
