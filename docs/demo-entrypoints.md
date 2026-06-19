# Точки входа в демо

Все маршруты относятся к frontend-прототипу и используют моковые данные из `src/data`.

## Публичный вход

- `/` — лендинг и выбор одного из трёх демо-сценариев.

## Пользовательский сценарий

- `/app` — главная пользовательского приложения.
- `/app/challenges` — каталог челленджей.
- `/app/active-challenge` — прогресс активного челленджа.
- `/app/reward` — QR-награда пользователя.

Рекомендуемый маршрут: `/app → /app/challenges → /app/active-challenge → /app/reward`.

## Сценарий бренда

- `/brand` — дашборд бренда.
- `/brand/challenges/new` — конструктор челленджа.
- `/brand/preview` — пользовательское превью механики.
- `/brand/analytics` — аналитика кампаний.
- `/brand/rewards` — управление наградами.

Рекомендуемый маршрут: `/brand → /brand/challenges/new → /brand/preview → /brand/analytics → /brand/rewards`.

## Сценарий сотрудника

- `/brand/scanner` — проверка QR-награды.
- `/brand/scan-result` — результат проверки.

Рекомендуемый маршрут: `/brand/scanner → /brand/scan-result`.
