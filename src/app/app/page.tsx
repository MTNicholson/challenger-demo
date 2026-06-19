import Link from "next/link";
import {
  Bell,
  Coffee,
  Flame,
  Sparkles,
} from "lucide-react";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionTitle } from "@/components/ui/section-title";
import { ChallengeCard } from "@/components/user/challenge-card";
import { CoinBalanceCard } from "@/components/user/coin-balance-card";

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

      <CoinBalanceCard href={routes.user.coins} coins={1250} />

      <Link
        href={routes.user.activeChallenge}
        className="block overflow-hidden rounded-[34px] bg-slate-950 text-white shadow-2xl shadow-slate-900/15"
      >
        <div className="relative h-40 overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#facc15,transparent_24%),radial-gradient(circle_at_78%_25%,#34d399,transparent_22%),linear-gradient(135deg,#1e293b,#020617)]">
          <div className="absolute left-5 top-5 grid h-16 w-16 place-items-center rounded-[24px] bg-white/15 text-4xl backdrop-blur">
            ☕
          </div>
          <Badge className="absolute bottom-5 right-5 bg-white/15 px-4 py-2 text-sm text-white backdrop-blur">
            +200 монет
          </Badge>
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
          <ProgressBar
            value={3}
            max={5}
            className="mt-3 bg-white/15"
            indicatorClassName="bg-emerald-300"
          />
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
        <SectionTitle
          actionHref={routes.user.challenges}
          actionLabel="Все"
          className="mb-3"
          title="Рекомендации"
        />
        <div className="grid grid-cols-2 gap-3">
          {recommendations.map((item) => (
            <ChallengeCard
              key={item.title}
              href={routes.user.challenges}
              title={item.title}
              brand={item.brand}
              reward={`${item.reward} монет`}
              emoji={item.icon}
              className={`min-h-40 rounded-[28px] ${item.tone}`}
            />
          ))}
        </div>
      </section>

      <ChallengeCard
        href={routes.user.challengeDetail("coffee-week")}
        title="Кофе на Невском"
        brand="Coffee Place"
        reward="+отметка"
        emoji="☕"
        distance="450 м от вас"
        description="Зайди сегодня и получи отметку маршрута."
        variant="compact"
      />

      <div className="rounded-[24px] bg-white/70 p-4 text-sm leading-6 text-slate-500">
        <Sparkles className="mb-2 h-5 w-5 text-amber-500" />
        Чем больше маршрутов закрываешь, тем точнее становятся рекомендации.
      </div>
    </main>
  );
}
