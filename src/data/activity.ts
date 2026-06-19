export type ActivityEvent = {
  id: string;
  title: string;
  date: string;
  amount?: number;
  type: "coins_in" | "coins_out" | "visit" | "reward";
};

export const activityEvents: ActivityEvent[] = [
  {
    id: "coffee-route-reward",
    title: "Кофейный маршрут",
    date: "Сегодня",
    amount: 200,
    type: "coins_in",
  },
  {
    id: "daily-task",
    title: "Задача дня",
    date: "Сегодня",
    amount: 10,
    type: "coins_in",
  },
  {
    id: "sweet-june-entry",
    title: "Сладкий июнь",
    date: "Вчера",
    amount: -150,
    type: "coins_out",
  },
  {
    id: "steps",
    title: "10 000 шагов",
    date: "15 июня",
    amount: 120,
    type: "coins_in",
  },
  {
    id: "beauty-qr",
    title: "Beauty Rewards",
    date: "14 июня",
    type: "visit",
  },
];
