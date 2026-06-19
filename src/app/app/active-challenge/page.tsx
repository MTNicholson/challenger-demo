import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Gift,
  Map,
  MapPin,
  QrCode,
  Sparkles,
} from "lucide-react";
import { getChallengeById } from "@/data/challenges";
import { getBrandLocations } from "@/data/locations";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function ActiveChallengePage() {
  const challenge = getChallengeById("coffee-route")!;
  const progress = challenge.progress!;
  const visits = getBrandLocations(challenge.brandId).slice(0, progress.total);
  const remainingVisits = progress.total - progress.current;
  const completedVisits = visits.filter((visit) => visit.visited);
  const pendingVisits = visits.filter((visit) => !visit.visited);

  return (
    <main className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-slate-400">Активный челлендж</p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-black">{challenge.title}</h1>
            <p className="mt-2 text-sm font-semibold text-slate-500">
              {challenge.brandName} · {challenge.condition}
            </p>
          </div>
          <Badge variant="success" className="mt-1 shrink-0">
            В процессе
          </Badge>
        </div>
      </header>

      <section className="relative overflow-hidden rounded-[36px] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/15">
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-emerald-300">
              Почти у цели
            </p>
            <p className="mt-2 text-6xl font-black tracking-tight">
              {progress.current}/{progress.total}
            </p>
            <p className="mt-2 text-sm leading-6 text-white/65">
              Осталось {remainingVisits} визита, чтобы открыть QR-награду.
            </p>
          </div>
          <div className="grid h-20 w-20 shrink-0 place-items-center rounded-[28px] bg-white/10 text-4xl">
            {challenge.emoji}
          </div>
        </div>

        <ProgressBar
          value={progress.current}
          max={progress.total}
          className="relative z-10 mt-6 bg-white/15"
          indicatorClassName="bg-emerald-300"
        />

        <div className="relative z-10 mt-6 flex items-center">
          {visits.map((visit, index) => (
            <div key={visit.id} className="flex flex-1 items-center">
              <div
                className={
                  visit.visited
                    ? "grid h-10 w-10 place-items-center rounded-full bg-emerald-300 text-slate-950"
                    : "grid h-10 w-10 place-items-center rounded-full bg-white/15 text-sm font-black text-white/60"
                }
              >
                {visit.visited ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              {index < visits.length - 1 ? (
                <div
                  className={
                    visits[index + 1]?.visited
                      ? "h-1 flex-1 bg-emerald-300"
                      : "h-1 flex-1 bg-white/15"
                  }
                />
              ) : null}
            </div>
          ))}
        </div>
        <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-emerald-300/20" />
        <div className="absolute right-20 top-10 h-24 w-24 rounded-full bg-amber-300/20" />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-[28px] bg-emerald-50 p-4 text-emerald-950 shadow-sm">
          <Sparkles className="h-6 w-6" />
          <p className="mt-4 text-sm font-bold text-emerald-700">До награды</p>
          <p className="text-2xl font-black">{remainingVisits} визита</p>
        </div>
        <div className="rounded-[28px] bg-white p-4 shadow-sm">
          <CalendarDays className="h-6 w-6 text-slate-500" />
          <p className="mt-4 text-sm font-bold text-slate-400">Осталось</p>
          <p className="text-2xl font-black">{challenge.daysLeft} дня</p>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-amber-100 text-amber-800">
            <Gift className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-400">Награда маршрута</p>
            <h2 className="mt-1 text-xl font-black">{challenge.reward}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Еще немного, и на следующем экране можно показать QR-код сотруднику на кассе.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Визиты</h2>

        <div className="mt-4 space-y-3">
          {completedVisits.map((visit) => (
            <div key={visit.id} className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                <Check className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold">{visit.title}</p>
                <p className="text-sm text-slate-500">{visit.visitTime}</p>
              </div>
            </div>
          ))}

          {pendingVisits.map((visit) => (
            <div key={visit.id} className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-400">
                <MapPin className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-slate-700">{visit.title}</p>
                <p className="text-sm text-slate-500">
                  {visit.distance} · ожидает визит
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-600">
            <Clock3 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400">Время на маршрут</p>
            <p className="text-xl font-black">4 дня до завершения</p>
          </div>
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
          <QrCode className="h-5 w-5" />
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
          Показать на карте
        </Link>
      </section>
    </main>
  );
}
