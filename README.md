# Челленджер — демо прототип

Challenger Demo — фронтенд-прототип платформы городских челленджей. Пользователь проходит задания у партнёров, получает демо-монеты и открывает награды, а бренд просматривает моковые челленджи, аналитику и сценарий проверки награды.

## Current checkpoint

Текущий этап — **Week 4 predeploy checkpoint**. Публичный лендинг, пользовательский путь, кабинет бренда, моковая аналитика и сценарий сканера собраны в связное инвесторское демо. Интерфейсы работают только с моковыми данными из `src/data` и готовы к демонстрационной production-сборке, но не к использованию как реальный сервис.

- Локальный запуск: `npm install`, настройте PostgreSQL и `.env.local`, затем `npm run dev`; приложение откроется на `http://localhost:3000`.
- Полная автоматическая проверка: `npm run check`; отдельно доступны `npm run lint` и `npm run build`.
- Production-проверка: `npm run build`, затем `npm run start` и ручной проход демо-маршрутов.
- Документация находится в [`docs`](docs): начните с [`docs/week-4-report.md`](docs/week-4-report.md), [`docs/prototype-status.md`](docs/prototype-status.md), [`docs/investor-demo-script.md`](docs/investor-demo-script.md) и [`docs/predeploy-checklist.md`](docs/predeploy-checklist.md).
- Для показа готовы лендинг, пользовательский сценарий, кабинет бренда, аналитика, награды и моковый сценарий проверки QR-награды.

## Технологии

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- lucide-react
- framer-motion
- recharts
- Prisma 7
- PostgreSQL
- bcryptjs
- jose

## Локальный запуск

Установить зависимости:

```bash
npm install
```

Создать `.env.local` на основе `.env.example`:

```bash
cp .env.example .env.local
```

Минимальный локальный PostgreSQL можно поднять в Docker:

```bash
docker run --name challenger-postgres \
  -e POSTGRES_USER=challenger \
  -e POSTGRES_PASSWORD=challenger \
  -e POSTGRES_DB=challenger_demo \
  -p 5432:5432 \
  -d postgres:16
```

В `.env.local` должны быть заданы:

```bash
DATABASE_URL="postgresql://challenger:challenger@localhost:5432/challenger_demo?schema=public"
JWT_SECRET="минимум-32-случайных-символа"
```

Сгенерировать Prisma Client и применить миграции:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Запустить сервер разработки:

```bash
npm run dev
```

По умолчанию приложение будет доступно по адресу `http://localhost:3000`.

## Production-сборка

На VDS создайте `.env.production` или задайте переменные окружения в process manager:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
JWT_SECRET="production-secret-from-openssl-rand-base64-32"
```

Применить миграции на production-базе:

```bash
npm run prisma:generate
npm run prisma:migrate
```

Собрать приложение:

```bash
npm run build
```

Запустить собранную версию:

```bash
npm run start
```

## Проверки

Запустить линтер:

```bash
npm run lint
```

Последовательно запустить линтер и production-сборку:

```bash
npm run check
```

## Основные демо-маршруты

- `/` — публичный лендинг и точки входа в демо.
- `/app` — главная пользовательского демо.
- `/app/challenges` — каталог челленджей.
- `/app/challenges/coffee-route` — основной пользовательский демо-сценарий.
- `/app/active-challenge` — прогресс активного челленджа.
- `/app/reward` — демо полученной награды.
- `/app/coins`, `/app/map`, `/app/profile` — монеты, карта и профиль.
- `/brand` — главная кабинета бренда.
- `/brand/challenges` и `/brand/challenges/new` — список и моковая настройка челленджей.
- `/brand/analytics` и `/brand/rewards` — аналитика и награды.
- `/brand/scanner` и `/brand/scan-result` — моковый сценарий проверки награды.
- Любой неизвестный путь — русскоязычная страница 404.

Полный список приведён в [`docs/routes.md`](docs/routes.md), а подготовка к публикации — в [`docs/deployment.md`](docs/deployment.md).

## Текущие ограничения

- Пользовательская регистрация и вход используют PostgreSQL, Prisma и httpOnly cookie-сессию.
- Brand cabinet пока остаётся демо-зоной без авторизации.
- Используются только моковые данные из `src/data`.
- QR-коды и сканирование имитируются; доступа к камере нет.
- Реальные платежи и платёжные интеграции отсутствуют.
- Прогресс челленджей и онбординг остаются локальной демо-логикой текущего чекпоинта.
