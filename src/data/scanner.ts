export const scannerMockResult = {
  id: "scan-cp-4829",
  status: "valid",
  userName: "Алекс",
  userLabel: "Участник челленджа",
  rewardTitle: "Напиток на выбор",
  rewardBrand: "Coffee Place",
  rewardCode: "CP-4829",
  expiresAt: "Сегодня, 22:00",
  challengeTitle: "Кофейный маршрут",
  scannedAt: "Сегодня, 18:42",
  location: "Coffee Place, Невский 24",
  stockBefore: 158,
  stockAfter: 157,
};

export const scannerErrorStates = [
  { title: "QR просрочен", description: "Проверьте срок действия награды у гостя." },
  { title: "Уже использован", description: "Этот код ранее активировали в другой точке." },
  { title: "Код не найден", description: "Проверьте символы и попробуйте ввести код снова." },
];
