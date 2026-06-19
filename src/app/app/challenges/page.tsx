import Link from "next/link";
import { Clock, Coins, MapPin } from "lucide-react";
import { challenges } from "@/data/challenges";
import { routes } from "@/lib/routes";

export default function UserChallengesPage() {
  return (
    <main className="space-y-5">
      <section>
        <div className="text-sm font-semibold text-slate-400">Каталог</div>
        <h1 className="mt-1 text-3xl font-black">Челленджи</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Демо-подборка заданий от брендов рядом с пользователем.
        </p>
      </section>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {["Все", "Кофе", "Фитнес", "Beauty", "Десерты"].map((filter) => (
          <button
            key={filter}
            className="shrink-0 rounded-full border border-white bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-sm"
          >
            {filter}
          </button>
        ))}
      </div>

      <section className="space-y-3">
        {challenges.map((challenge) => (
          <Link
            key={challenge.id}
            href={routes.user.challengeDetail(challenge.id)}
            className="block rounded-[30px] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-slate-400">
                  {challenge.brandName}
                </div>
                <h2 className="mt-1 text-xl font-black">{challenge.title}</h2>
              </div>
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                +{challenge.coinsReward}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              {challenge.description}
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-2">
                <Clock className="h-3.5 w-3.5" />
                {challenge.daysLeft} дн.
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-2">
                <MapPin className="h-3.5 w-3.5" />
                {challenge.distanceKm ?? 0} км
              </span>
              {challenge.coinsPrice ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-2 text-amber-700">
                  <Coins className="h-3.5 w-3.5" />
                  вход {challenge.coinsPrice}
                </span>
              ) : null}
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
