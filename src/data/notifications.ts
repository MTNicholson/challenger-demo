export type DemoNotification = {
  id: string;
  title: string;
  text: string;
  time: string;
  tone: "coffee" | "warning" | "gift" | "progress" | "reward" | "info";
  unread?: boolean;
};

export const demoNotifications: DemoNotification[] = [
  { id: "new-coffee", title: "У Coffee House новый челлендж", text: "Загляните за утренним кофе и получите первые баллы.", time: "2 мин назад", tone: "coffee", unread: true },
  { id: "route-progress", title: "Вы почти у цели", text: "До завершения «Кофейного маршрута» осталось всего два визита.", time: "Сегодня", tone: "progress", unread: true },
  { id: "summer", title: "100 баллов в подарок", text: "Поздравляем с первым днём лета — бонус уже на вашем балансе.", time: "Сегодня", tone: "gift", unread: true },
  { id: "deadline", title: "Успейте выполнить челлендж", text: "Задание «10 000 шагов» завершится сегодня вечером.", time: "Сегодня", tone: "warning" },
  { id: "reward", title: "Вам доступна новая награда", text: "Откройте QR-код и заберите авторский раф в Coffee Place.", time: "Вчера", tone: "reward" },
  { id: "nearby", title: "Новое место рядом", text: "В 450 метрах появилась точка с активным заданием.", time: "Вчера", tone: "info" },
];
