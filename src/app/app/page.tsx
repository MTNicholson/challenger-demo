import Link from "next/link";
import { ArrowRight, Gift, MapPin, Sparkles } from "lucide-react";
import { challenges } from "@/data/challenges";
import { demoUser } from "@/data/user";
import { routes } from "@/lib/routes";

export default function UserHomePage() {
  const featured = challenges.filter((challenge) => challenge.isFeatured);
  const active = challenges.find((challenge) => challenge.isActive);

  return (
    <main className="space-y-6">
      <section className="rounded-[32px] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/15">
        <div className="text-sm text-white/60">{demoUser.city}</div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black">Привет, {demoUser.name}</h1>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Выбери челлендж рядом с собой и забери награду у любимого бренда.
            </p>
          </div>
          <Link
            href={routes.user.coins}
            className="rounded-2xl bg-white px-3 py-2 text-sm font-black text-slate-950"
          >
            {demoUser.coins} 🪙
          </Link>
        </div>
      </section>

      {active ? (
        <Link
          href={routes.user.activeChallenge}
          className="block rounded-[28px] border border-white/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-emerald-700">
                Продолжить
              </div>
              <h2 className="mt-1 text-2xl font-black">{active.title}</h2>
            </div>
            <ArrowRight className="h-5 w-5 text-slate-400" />
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {active.progress?.label}. Награда: {active.reward}.
          </p>
          <div className="mt-4 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-emerald-400"
              style={{
                width: `${Math.round(
                  ((active.progress?.current ?? 0) /
                    (active.progress?.total ?? 1)) *
                    100,
                )}%`,
              }}
            />
          </div>
        </Link>
      ) : null}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-black">Подборка рядом</h2>
          <Link href={routes.user.challenges} className="text-sm font-bold">
            Все
          </Link>
        </div>
        <div className="space-y-3">
          {featured.map((challenge) => (
            <Link
              key={challenge.id}
              href={routes.user.challengeDetail(challenge.id)}
              className="flex gap-4 rounded-[28px] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-3xl bg-[#f2eadf]">
                <Sparkles className="h-6 w-6 text-amber-600" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-black">{challenge.title}</h3>
                  <span className="text-sm font-bold text-emerald-700">
                    +{challenge.coinsReward}
                  </span>
                </div>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                  {challenge.description}
                </p>
                <div className="mt-3 flex items-center gap-3 text-xs font-semibold text-slate-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {challenge.distanceKm} км
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Gift className="h-3.5 w-3.5" />
                    {challenge.reward}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
