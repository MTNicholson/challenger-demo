import Link from "next/link";
import {
  ArrowRight,
  Coffee,
  Flame,
  Sparkles,
} from "lucide-react";
import { routes } from "@/lib/routes";
import { getActiveChallenges, getFeaturedChallenges } from "@/data/challenges";
import { demoUser } from "@/data/user";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { SectionTitle } from "@/components/ui/section-title";
import { ChallengeCard } from "@/components/user/challenge-card";
import { CoinBalanceCard } from "@/components/user/coin-balance-card";

export default function UserHomePage() {
  const activeChallenge = getActiveChallenges()[0];
  const recommendations = getFeaturedChallenges()
    .filter((challenge) => challenge.id !== activeChallenge.id)
    .slice(0, 2);
  const nearbyChallenge = getFeaturedChallenges()[0];
  const progress = activeChallenge.progress;

  return (
    <main className="space-y-5">
      <header className="flex items-center justify-between">
        <Link href={routes.user.profile}>
          <p className="text-sm font-semibold text-slate-400">
            {demoUser.district}
          </p>
          <h1 className="mt-1 text-3xl font-black">
            Привет, {demoUser.name}! 👋
          </h1>
        </Link>
        <Link
          href={routes.user.profile}
          className="relative grid h-12 w-12 place-items-center rounded-full bg-white text-slate-700 shadow-sm"
          aria-label="Профиль"
        >
          <span className="text-base font-black">{demoUser.initials}</span>
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
        </Link>
      </header>

      <CoinBalanceCard href={routes.user.coins} coins={demoUser.coins} />

      <Link
        href={routes.user.activeChallenge}
        className="block overflow-hidden rounded-[34px] bg-slate-950 text-white shadow-2xl shadow-slate-900/15"
      >
        <div className="relative h-40 overflow-hidden bg-[radial-gradient(circle_at_20%_20%,#facc15,transparent_24%),radial-gradient(circle_at_78%_25%,#34d399,transparent_22%),linear-gradient(135deg,#1e293b,#020617)]">
          <div className="absolute left-5 top-5 grid h-16 w-16 place-items-center rounded-[24px] bg-white/15 text-4xl backdrop-blur">
            {activeChallenge.emoji}
          </div>
          <Badge className="absolute bottom-5 right-5 bg-white/15 px-4 py-2 text-sm text-white backdrop-blur">
            +{activeChallenge.coinsReward} монет
          </Badge>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Активный челлендж
              </p>
              <h2 className="mt-1 text-2xl font-black">
                {activeChallenge.title}
              </h2>
            </div>
            <Coffee className="h-6 w-6 text-white/50" />
          </div>
          <div className="mt-5 flex items-center justify-between text-sm font-bold text-white/70">
            <span>
              Прогресс {progress?.current}/{progress?.total}
            </span>
            <span>
              {(progress?.total ?? 0) - (progress?.current ?? 0)} визита осталось
            </span>
          </div>
          <ProgressBar
            value={progress?.current ?? 0}
            max={progress?.total ?? 1}
            className="mt-3 bg-white/15"
            indicatorClassName="bg-emerald-300"
          />
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">
            Продолжить
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>

      <Link
        href={routes.user.map}
        className="grid grid-cols-[1fr_auto] items-center gap-3 rounded-[28px] bg-emerald-50 p-4 text-emerald-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      >
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
      </Link>

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
              key={item.id}
              href={routes.user.challengeDetail(item.id)}
              title={item.title}
              brand={item.brandName}
              reward={item.coinsReward}
              emoji={item.emoji}
              className={`min-h-40 rounded-[28px] ${item.cardClassName}`}
            />
          ))}
        </div>
      </section>

      <ChallengeCard
        href={routes.user.map}
        title={nearbyChallenge.title}
        brand={nearbyChallenge.brandName}
        reward="+отметка"
        emoji={nearbyChallenge.emoji}
        distance={`${nearbyChallenge.distanceKm} км от вас`}
        description={nearbyChallenge.condition}
        variant="compact"
      />

      <div className="rounded-[24px] bg-white/70 p-4 text-sm leading-6 text-slate-500">
        <Sparkles className="mb-2 h-5 w-5 text-amber-500" />
        Чем больше челленджей закрываешь, тем точнее становятся рекомендации.
      </div>
    </main>
  );
}
