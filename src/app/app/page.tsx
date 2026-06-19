import Link from "next/link";
import {
  Bell,
  ChevronRight,
  Coffee,
  Coins,
  Flame,
  Gift,
  MapPin,
  Sparkles,
} from "lucide-react";
import { routes } from "@/lib/routes";

const recommendations = [
  {
    title: "Сладкий старт",
    brand: "Sweetly",
    reward: "+80",
    tone: "bg-rose-100 text-rose-900",
    icon: "🍰",
  },
  {
    title: "Шаги утром",
    brand: "FitPro",
    reward: "+120",
    tone: "bg-sky-100 text-sky-900",
    icon: "👟",
  },
];

export default function UserHomePage() {
  return (
    <main className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-400">Петроградская</p>
          <h1 className="mt-1 text-3xl font-black">Привет, Алекс! 👋</h1>
        </div>
        <button
          className="relative grid h-12 w-12 place-items-center rounded-full bg-white text-slate-700 shadow-sm"
          aria-label="Уведомления"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-3 top-3 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>
      </header>

      <Link
        href={routes.user.coins}
        className="flex items-center justify-between rounded-[28px] bg-white p-4 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-800">
            <Coins className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-400">Баланс</p>
            <p className="text-2xl font-black">1 250 монет</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-slate-300" />
      </Link>

      <Link
        href={routes.user.activeChallenge}
        className="block overflow-hidden rounded-[34px] bg-slate-950 text-white shadow-2xl shadow-slate-900/15"
      >
        <div className="relative h-40 overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#facc15,transparent_24%),radial-gradient(circle_at_78%_25%,#34d399,transparent_22%),linear-gradient(135deg,#1e293b,#020617)]">
          <div className="absolute left-5 top-5 grid h-16 w-16 place-items-center rounded-[24px] bg-white/15 text-4xl backdrop-blur">
            ☕
          </div>
          <div className="absolute bottom-5 right-5 rounded-full bg-white/15 px-4 py-2 text-sm font-black backdrop-blur">
            +200 монет
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Активный челлендж
              </p>
              <h2 className="mt-1 text-2xl font-black">Кофейный маршрут</h2>
            </div>
            <Coffee className="h-6 w-6 text-white/50" />
          </div>
          <div className="mt-5 flex items-center justify-between text-sm font-bold text-white/70">
            <span>Прогресс 3/5</span>
            <span>2 визита осталось</span>
          </div>
          <div className="mt-3 h-3 rounded-full bg-white/15">
            <div className="h-3 w-3/5 rounded-full bg-emerald-300" />
          </div>
        </div>
      </Link>

      <section className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[28px] bg-emerald-50 p-4 text-emerald-950 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white">
            <Flame className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="font-black">Задача дня</p>
            <p className="text-sm text-emerald-800/75">
              Открой карту и выбери место рядом
            </p>
          </div>
        </div>
        <span className="rounded-full bg-white px-3 py-2 text-sm font-black">
          +10
        </span>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black">Рекомендации</h2>
          <Link href={routes.user.challenges} className="text-sm font-black">
            Все
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recommendations.map((item) => (
            <Link
              key={item.title}
              href={routes.user.challenges}
              className={`min-h-40 rounded-[28px] p-4 shadow-sm ${item.tone}`}
            >
              <div className="text-3xl">{item.icon}</div>
              <h3 className="mt-5 text-lg font-black leading-5">{item.title}</h3>
              <p className="mt-1 text-sm opacity-70">{item.brand}</p>
              <p className="mt-4 inline-flex rounded-full bg-white/70 px-3 py-1 text-sm font-black">
                {item.reward} монет
              </p>
            </Link>
          ))}
        </div>
      </section>

      <Link
        href={routes.user.challengeDetail("coffee-week")}
        className="flex items-center gap-4 rounded-[30px] bg-white p-4 shadow-sm"
      >
        <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] bg-amber-100 text-3xl">
          ☕
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1 text-sm font-bold text-slate-400">
            <MapPin className="h-4 w-4" />
            450 м от вас
          </div>
          <h3 className="mt-1 text-lg font-black">Кофе на Невском</h3>
          <p className="mt-1 text-sm text-slate-500">
            Зайди сегодня и получи отметку маршрута.
          </p>
        </div>
        <Gift className="h-5 w-5 text-emerald-500" />
      </Link>

      <div className="rounded-[24px] bg-white/70 p-4 text-sm leading-6 text-slate-500">
        <Sparkles className="mb-2 h-5 w-5 text-amber-500" />
        Чем больше маршрутов закрываешь, тем точнее становятся рекомендации.
      </div>
    </main>
  );
}
