import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  CheckCircle2,
  Coins,
  Gift,
  LineChart,
  MapPin,
  QrCode,
  Repeat2,
  ScanLine,
  Smartphone,
  Sparkles,
  Store,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import { getFeaturedChallenges } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MarketingSection } from "@/components/marketing/marketing-section";
import { ValueCard } from "@/components/marketing/value-card";

const navItems = [
  { href: "#product", label: "Продукт" },
  { href: "#users", label: "Для пользователей" },
  { href: "#business", label: "Для бизнеса" },
  { href: "#demo", label: "Демо" },
];

const howItWorks = [
  {
    title: "Бренд запускает челлендж",
    description:
      "Выбирает механику: визит, серию покупок, шаги, фото или QR-подтверждение в точке.",
    icon: Store,
  },
  {
    title: "Пользователь выполняет действие",
    description:
      "Открывает карту, находит задание рядом и проходит его в привычном городском маршруте.",
    icon: Smartphone,
  },
  {
    title: "Начисляются монетки и награды",
    description:
      "Прогресс растет сразу, а подарок можно подтвердить по QR на кассе или у сотрудника.",
    icon: Coins,
  },
  {
    title: "Бизнес видит результат",
    description:
      "Кабинет показывает участников, активации, повторные визиты и динамику по кампаниям.",
    icon: BarChart3,
  },
];

const userValues = [
  {
    icon: MapPin,
    title: "Челленджи рядом",
    description: "Карта подсказывает места поблизости и превращает прогулку в понятный маршрут.",
    tone: "rose" as const,
  },
  {
    icon: Coins,
    title: "Монетки",
    description: "За визиты, шаги и действия начисляется внутренняя валюта для новых наград.",
    tone: "amber" as const,
  },
  {
    icon: Gift,
    title: "Награды",
    description: "Скидки, подарки и бонусы выглядят как цель, а не как обычная акция.",
    tone: "emerald" as const,
  },
  {
    icon: Trophy,
    title: "Прогресс",
    description: "Серии, статусы и активные задания дают повод вернуться и дойти до финала.",
    tone: "violet" as const,
  },
  {
    icon: QrCode,
    title: "QR-награда",
    description: "Получение подарка подтверждается на месте, без сложных интеграций в демо.",
    tone: "slate" as const,
  },
  {
    icon: Sparkles,
    title: "Игровой ритм",
    description: "Каждый визит ощущается как маленькая победа, а не как сухая программа лояльности.",
    tone: "sky" as const,
  },
];

const brandValues = [
  {
    icon: Target,
    title: "Запуск челленджей",
    description: "Кампании собираются вокруг реального действия: прийти, купить, отметить QR, повторить.",
    tone: "emerald" as const,
  },
  {
    icon: Gift,
    title: "Управление наградами",
    description: "Бренд задает ценность подарка, лимиты и условия выдачи в точках.",
    tone: "amber" as const,
  },
  {
    icon: ScanLine,
    title: "QR в точках",
    description: "Сканер помогает подтвердить награду на месте и закрыть цикл офлайн-действия.",
    tone: "slate" as const,
  },
  {
    icon: Users,
    title: "Участники",
    description: "В кабинете видно, сколько людей вступило, где они продвигаются и что активируют.",
    tone: "sky" as const,
  },
  {
    icon: LineChart,
    title: "Аналитика",
    description: "Метрики показывают вовлечение, активации, повторные визиты и эффективность механик.",
    tone: "violet" as const,
  },
  {
    icon: Repeat2,
    title: "Повторные визиты",
    description: "Серийные задания мягко возвращают гостей без тяжелой CRM-инфраструктуры.",
    tone: "rose" as const,
  },
];

const demoRoutes = [
  {
    href: routes.user.home,
    title: "Пользовательское демо",
    description:
      "Пользователь находит челлендж, выполняет прогресс и получает QR-награду.",
    cta: "Открыть пользовательский сценарий",
    path: "/app → /app/challenges → /app/active-challenge → /app/reward",
    icon: Smartphone,
  },
  {
    href: routes.brand.dashboard,
    title: "Кабинет бренда",
    description: "Бренд создаёт челлендж, смотрит аналитику и управляет наградами.",
    cta: "Открыть кабинет бренда",
    path: "/brand → /brand/challenges → /brand/analytics → /brand/rewards",
    icon: Building2,
  },
  {
    href: routes.brand.scanner,
    title: "Staff scanner",
    description: "Сотрудник проверяет QR-награду гостя.",
    cta: "Открыть сканер",
    path: "/brand/scanner → /brand/scan-result",
    icon: QrCode,
  },
];

export default function Home() {
  const featuredChallenges = getFeaturedChallenges().slice(0, 4);

  return (
    <main className="min-h-screen bg-[#f7f2ea] text-slate-950">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <header className="sticky top-4 z-20 flex items-center justify-between gap-4 rounded-full border border-white/80 bg-white/85 px-4 py-3 shadow-sm shadow-slate-900/5 backdrop-blur">
          <Link href={routes.marketing.home} className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-slate-950 text-base font-black text-white">
              Ч
            </span>
            <span className="text-lg font-black">Челленджер</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-bold text-slate-500 lg:flex">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} className="transition hover:text-slate-950">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href={routes.user.home}
              className={buttonClasses({
                variant: "secondary",
                size: "sm",
                className: "hidden sm:inline-flex",
              })}
            >
              /app
            </Link>
            <Link
              href={routes.brand.dashboard}
              className={buttonClasses({ variant: "dark", size: "sm" })}
            >
              /brand
            </Link>
          </div>
        </header>

        <section className="grid min-h-[calc(100vh-88px)] items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
          <div className="max-w-3xl">
            <Badge className="bg-white/80 px-4 py-2 text-slate-700 shadow-sm">
              Investor demo · frontend prototype
            </Badge>
            <h1 className="mt-6 text-4xl font-black leading-[1.04] text-slate-950 sm:text-6xl lg:text-7xl">
              Городские челленджи, монетки и награды для вовлечения гостей бренда
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              Челленджер соединяет привычные офлайн-действия с игровым прогрессом:
              пользователи открывают задания рядом, получают монетки и подарки, а
              бизнес видит результат в кабинете.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={routes.user.home}
                className={buttonClasses({ variant: "dark", size: "lg" })}
              >
                Открыть приложение
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={routes.brand.dashboard}
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                Открыть кабинет бренда
              </Link>
            </div>
          </div>

          <div id="product" className="relative mx-auto w-full max-w-[520px]">
            <div className="absolute -left-3 top-12 z-10 hidden rounded-[24px] bg-white p-4 shadow-xl shadow-slate-900/10 sm:block">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-black">QR подтвержден</p>
                  <p className="text-xs font-semibold text-slate-500">награда выдана</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-2 bottom-16 z-10 hidden rounded-[24px] bg-slate-950 p-4 text-white shadow-xl shadow-slate-900/20 sm:block">
              <p className="text-xs font-bold text-white/55">аналитика</p>
              <p className="mt-1 text-2xl font-black">+18%</p>
              <p className="text-xs text-white/60">повторные визиты</p>
            </div>

            <div className="rounded-[38px] border border-white/90 bg-white/75 p-4 shadow-2xl shadow-slate-900/12">
              <div className="rounded-[30px] bg-[#fbf8f2] p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                      Сегодня рядом
                    </p>
                    <h2 className="mt-2 text-2xl font-black">Кофейный маршрут</h2>
                  </div>
                  <div className="rounded-2xl bg-amber-100 px-3 py-2 text-sm font-black text-amber-950">
                    1 250 монет
                  </div>
                </div>

                <div className="mt-5 rounded-[28px] bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-white/12 text-white">3 из 5 визитов</Badge>
                    <QrCode className="h-5 w-5 text-white/55" />
                  </div>
                  <p className="mt-5 text-3xl font-black">До подарка осталось 2 шага</p>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    Следующая точка на карте, монетки после отметки, награда по QR в кофейне.
                  </p>
                  <div className="mt-6 h-3 rounded-full bg-white/15">
                    <div className="h-3 w-3/5 rounded-full bg-emerald-300" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-[24px] bg-white p-4 shadow-sm">
                    <MapPin className="h-5 w-5 text-rose-500" />
                    <p className="mt-4 text-lg font-black">0,8 км</p>
                    <p className="text-sm text-slate-500">до точки</p>
                  </div>
                  <div className="rounded-[24px] bg-white p-4 shadow-sm">
                    <Coins className="h-5 w-5 text-amber-500" />
                    <p className="mt-4 text-lg font-black">+120</p>
                    <p className="text-sm text-slate-500">за визит</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <MarketingSection
          eyebrow="Как это работает"
          title="Одна механика связывает город, пользователя и кабинет бренда"
          description="В демо вся цепочка показана без реальных интеграций: челлендж создается брендом, действие происходит офлайн, результат отражается в интерфейсе."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {howItWorks.map((step, index) => (
              <article
                key={step.title}
                className="rounded-[30px] border border-white/80 bg-white/85 p-5 shadow-sm shadow-slate-900/5"
              >
                <div className="flex items-center justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-black text-slate-300">0{index + 1}</span>
                </div>
                <h3 className="mt-6 text-lg font-black">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{step.description}</p>
              </article>
            ))}
          </div>
        </MarketingSection>

        <MarketingSection
          id="users"
          eyebrow="Для пользователей"
          title="Открывают приложение, потому что рядом есть цель и понятная награда"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {userValues.map((value) => (
              <ValueCard key={value.title} {...value} />
            ))}
          </div>
        </MarketingSection>

        <MarketingSection
          id="business"
          eyebrow="Для бизнеса"
          title="Бренды получают управляемую механику вовлечения без тяжелой интеграции"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brandValues.map((value) => (
              <ValueCard key={value.title} {...value} />
            ))}
          </div>
        </MarketingSection>

        <MarketingSection
          title="Примеры челленджей"
          description="Карточки используют существующие мок-данные проекта и показывают разные поводы для визита."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredChallenges.map((challenge) => (
              <Link
                key={challenge.id}
                href={routes.user.challengeDetail(challenge.id)}
                className={`relative overflow-hidden rounded-[30px] p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl ${challenge.cardClassName}`}
              >
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/25" />
                <div className="relative flex min-h-60 flex-col">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-4xl">{challenge.emoji}</span>
                    <Badge className="bg-white/70 text-slate-950">
                      +{challenge.coinsReward} монет
                    </Badge>
                  </div>
                  <div className="mt-auto pt-8">
                    <p className="text-sm font-bold opacity-65">{challenge.brandName}</p>
                    <h3 className="mt-2 text-2xl font-black leading-tight">
                      {challenge.title}
                    </h3>
                    <p className="mt-3 text-sm leading-6 opacity-75">
                      {challenge.condition}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-sm font-black opacity-75">
                      <Users className="h-4 w-4" />
                      {challenge.participants.toLocaleString("ru-RU")} участников
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </MarketingSection>

        <MarketingSection
          id="demo"
          eyebrow="Демо-сценарии"
          title="Выберите маршрут для показа инвестору"
          description="Каждый сценарий открывается с готовой стартовой точки и последовательно показывает одну сторону продукта."
        >
          <div className="grid gap-4 lg:grid-cols-3">
            {demoRoutes.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-950 text-white">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-950" />
                </div>
                <h3 className="mt-7 text-2xl font-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
                <p className="mt-5 font-mono text-xs leading-5 text-slate-400">
                  {item.path}
                </p>
                <div className="mt-6 flex items-center gap-2 text-sm font-black text-slate-950">
                  {item.cta}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </MarketingSection>

        <section className="py-14">
          <div className="overflow-hidden rounded-[36px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/20 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div>
                <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  investor demo prototype
                </div>
                <h2 className="mt-4 max-w-3xl text-3xl font-black leading-tight sm:text-5xl">
                  Публичная витрина показывает, как Челленджер превращает офлайн-визиты в измеримое вовлечение
                </h2>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href={routes.user.home}
                  className={buttonClasses({
                    variant: "secondary",
                    size: "lg",
                    className: "bg-white text-slate-950",
                  })}
                >
                  Пройти пользовательское демо
                </Link>
                <Link
                  href={routes.brand.dashboard}
                  className={buttonClasses({
                    variant: "ghost",
                    size: "lg",
                    className: "bg-white/10 text-white hover:bg-white/15",
                  })}
                >
                  Открыть кабинет
                </Link>
              </div>
            </div>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-slate-950/10 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-black text-slate-950">Челленджер</p>
          <p>Инвесторский демо-прототип без реальных интеграций.</p>
        </footer>
      </div>
    </main>
  );
}
