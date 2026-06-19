import Link from "next/link";
import { PlusCircle, Target } from "lucide-react";
import { challenges } from "@/data/challenges";
import { routes } from "@/lib/routes";

export default function BrandChallengesPage() {
  return (
    <main className="space-y-6">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-400">Механики</div>
          <h1 className="mt-1 text-3xl font-black">Челленджи бренда</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Простая витрина текущих кампаний для демо-кабинета.
          </p>
        </div>
        <Link
          href={routes.brand.newChallenge}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white"
        >
          <PlusCircle className="h-4 w-4" />
          Создать
        </Link>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {challenges.map((challenge) => (
          <div key={challenge.id} className="rounded-[30px] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50">
                <Target className="h-5 w-5 text-slate-600" />
              </div>
              <span
                className={
                  challenge.isActive
                    ? "rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700"
                    : "rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-500"
                }
              >
                {challenge.isActive ? "Активен" : "Черновик"}
              </span>
            </div>
            <h2 className="mt-5 text-xl font-black">{challenge.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {challenge.description}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="font-black">+{challenge.coinsReward}</div>
                <div className="text-xs text-slate-400">монет</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="font-black">{challenge.daysLeft}</div>
                <div className="text-xs text-slate-400">дней</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="font-black">{challenge.category}</div>
                <div className="text-xs text-slate-400">сегмент</div>
              </div>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
