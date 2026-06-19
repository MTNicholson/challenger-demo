import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Coins, Gift, Map, MapPin } from "lucide-react";
import { getChallengeById } from "@/data/challenges";
import { getBrandLocations } from "@/data/locations";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";

export default function ActiveChallengePage() {
  const challenge = getChallengeById("coffee-route")!;
  const progress = challenge.progress!;
  const visits = getBrandLocations(challenge.brandId).slice(0, progress.total);
  const remainingVisits = progress.total - progress.current;

  return (
    <main className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-slate-400">Активный маршрут</p>
        <h1 className="mt-1 text-3xl font-black">{challenge.title}</h1>
        <Link
          href={routes.user.challengeDetail(challenge.id)}
          className="mt-2 inline-flex text-sm font-black text-slate-500"
        >
          Открыть описание челленджа
        </Link>
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
        <p className="mt-5 text-sm leading-6 text-white/65">
          Осталось {remainingVisits} визита. Следующая отметка откроет новый
          чекпоинт маршрута, а финальная награда появится по QR.
        </p>

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
          <p className="mt-4 text-sm font-bold text-amber-700">Монетки</p>
          <p className="text-2xl font-black">{challenge.coinsReward} монет</p>
        </div>
        <div className="rounded-[28px] bg-white p-4 shadow-sm">
          <CalendarDays className="h-6 w-6 text-slate-500" />
          <p className="mt-4 text-sm font-bold text-slate-400">Осталось</p>
          <p className="text-2xl font-black">{challenge.daysLeft} дня</p>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400">Финал маршрута</p>
            <h2 className="mt-1 text-xl font-black">{challenge.reward}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              В демо QR-награда уже доступна, чтобы показать финальный шаг
              пользовательского сценария.
            </p>
          </div>
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

      <section className="space-y-3">
        <Link
          href={routes.user.reward}
          className={buttonClasses({
            variant: "dark",
            size: "lg",
            className: "w-full",
          })}
        >
          Показать QR-награду
          <ArrowRight className="h-5 w-5" />
        </Link>
        <Link
          href={routes.user.map}
          className={buttonClasses({
            variant: "secondary",
            size: "lg",
            className: "w-full",
          })}
        >
          <Map className="h-5 w-5" />
          Открыть карту
        </Link>
      </section>
    </main>
  );
}
