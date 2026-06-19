import Link from "next/link";
import { CalendarDays, Check, Coins, Map, MapPin } from "lucide-react";
import { getChallengeById } from "@/data/challenges";
import { getBrandLocations } from "@/data/locations";
import { routes } from "@/lib/routes";

export default function ActiveChallengePage() {
  const challenge = getChallengeById("coffee-route")!;
  const progress = challenge.progress!;
  const visits = getBrandLocations(challenge.brandId).slice(0, progress.total);

  return (
    <main className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-slate-400">Активный маршрут</p>
        <h1 className="mt-1 text-3xl font-black">{challenge.title}</h1>
      </header>

      <section className="rounded-[34px] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/15">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white/55">Прогресс</p>
            <p className="mt-1 text-5xl font-black">
              {progress.current}/{progress.total}
            </p>
          </div>
          <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-white/10 text-4xl">
            {challenge.emoji}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {visits.map((visit, index) => (
            <div key={visit.id} className="flex flex-1 items-center">
              <div
                className={
                  visit.visited
                    ? "grid h-9 w-9 place-items-center rounded-full bg-emerald-300 text-slate-950"
                    : "grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white/50"
                }
              >
                {visit.visited ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              {index < visits.length - 1 ? (
                <div
                  className={
                    visit.visited
                      ? "h-1 flex-1 bg-emerald-300"
                      : "h-1 flex-1 bg-white/15"
                  }
                />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-[28px] bg-amber-100 p-4 text-amber-950 shadow-sm">
          <Coins className="h-6 w-6" />
          <p className="mt-4 text-sm font-bold text-amber-700">Награда</p>
          <p className="text-2xl font-black">{challenge.coinsReward} монет</p>
        </div>
        <div className="rounded-[28px] bg-white p-4 shadow-sm">
          <CalendarDays className="h-6 w-6 text-slate-500" />
          <p className="mt-4 text-sm font-bold text-slate-400">Осталось</p>
          <p className="text-2xl font-black">{challenge.daysLeft} дня</p>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">История визитов</h2>
        <div className="mt-4 space-y-3">
          {visits.map((visit) => (
            <div key={visit.id} className="flex items-center gap-3">
              <div
                className={
                  visit.visited
                    ? "grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"
                    : "grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-400"
                }
              >
                {visit.visited ? <Check className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{visit.title}</p>
                <p className="text-sm text-slate-500">{visit.visitTime}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Link
        href={routes.user.map}
        className="flex items-center justify-center gap-2 rounded-full bg-slate-950 px-5 py-4 text-base font-black text-white shadow-2xl shadow-slate-900/15"
      >
        <Map className="h-5 w-5" />
        Показать на карте
      </Link>
    </main>
  );
}
