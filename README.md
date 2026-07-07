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

## Локальная разработка с PostgreSQL

### Требования

- Node.js
- npm
- Docker Desktop

### Первый запуск локально

Установить зависимости:

```bash
npm install
```

Создать `.env.local` на основе `.env.example`:

```bash
copy .env.example .env.local
```

Поднять независимую локальную PostgreSQL-БД в Docker:

```bash
npm run db:dev:up
```

Сгенерировать Prisma Client и применить dev-миграции:

```bash
npx prisma generate
npx prisma migrate dev
```

При желании наполнить локальную БД тестовыми данными:

```bash
npm run db:seed
```

Запустить сервер разработки:

```bash
npm run dev
```

По умолчанию приложение будет доступно по адресу `http://localhost:3000`.

### Локальные адреса

- Приложение: `http://localhost:3000`
- Пользовательский вход: `/auth/login`
- Пользовательская регистрация: `/auth/register`
- Вход бренда: `/brand/auth/login`
- Регистрация бренда: `/brand/auth/register`

### Тестовые аккаунты после seed

- User: `demo-user@challenger.local` / `demo12345`
- Brand: `demo-brand@challenger.local` / `demo12345`

### Важно

- Локальная БД из `docker-compose.dev.yml` независима от VDS и production-БД.
- Данные из локальной БД хранятся в Docker volume `challenger_postgres_dev_data` и не попадают в Git.
- На VDS используются свои `.env`/переменные окружения и своя PostgreSQL-БД.
- В Git попадают только schema, migrations, код и seed, но не реальные данные БД.
- Не копируйте локальную `.env.local` на VDS.

## Production-сборка

На VDS создайте `.env.production` или задайте переменные окружения в process manager:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB_NAME?schema=public"
JWT_SECRET="production-secret-from-openssl-rand-base64-32"
```

Применить миграции на production-базе:

```bash
npm run prisma:generate
npx prisma migrate deploy
```

На production/VDS используйте `migrate deploy`, а не `migrate dev`.

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

## Brand auth

- `/brand/auth/register` — регистрация бренда и owner-аккаунта для корпоративного кабинета.
- `/brand/auth/login` — вход владельца/администратора бренда.
- Brand auth API: `POST /api/brand/auth/register`, `POST /api/brand/auth/login`, `POST /api/brand/auth/logout`, `GET /api/brand/auth/me`.
- Brand session хранится отдельно от пользовательской сессии в httpOnly cookie `challenger_brand_session`.
- Кабинет `/brand` теперь защищён brand-сессией и берёт базовый профиль бренда из PostgreSQL/Prisma; моковые графики, таблицы и демо-сценарии пока остаются в `src/data`.
- Регистрация бренда поддерживает загрузку `logo` и `coverImage` через `multipart/form-data`; пути сохраняются в `Brand.logoUrl` и `Brand.coverImageUrl`.
- Город бренда при регистрации обязателен и выбирается из фиксированного списка городов РФ, чтобы дальше использовать его для городских витрин.
- Для demo-прототипа изображения сохраняются локально в `public/uploads/brands`. Папка `public/uploads` не коммитится; на production/VDS файлы будут лежать локально на сервере. Это временная реализация, которую позже можно заменить на S3/object storage.
- `/brand/settings` — настройки бренда: редактирование профиля, визуалов и точек бренда.
- Добавлена сущность `BrandLocation`: у бренда может быть несколько точек, а новые бренды получают первую точку при регистрации без обязательного статуса основной.

## Public brands

- Публичные read-only API брендов: `GET /api/brands` и `GET /api/brands/[slug]`.
- `/app/challenges` теперь показывает реальные бренды из PostgreSQL/Prisma отдельной секцией над моковой витриной челленджей.
- `/app/brands/[slug]` показывает публичную карточку бренда, базовые данные и список его `BrandChallenge` внутри защищённого пользовательского приложения.

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

## Geocoding

- Для подсказок и геокодинга адресов точек бренда используется Dadata.
- Добавьте `DADATA_API_TOKEN` в `.env.local` для разработки или в `.env.production`/переменные окружения на VDS. `DADATA_SECRET` можно указать дополнительно.
- Реальные ключи не коммитятся; `.env.local` и `.env.production` уже находятся в `.gitignore`.
- Если `DADATA_API_TOKEN` не задан, адрес можно ввести вручную, но координаты у точки не сохранятся.
- `/app/map?locationId=...` открывает карту на точке, если у неё есть координаты.
