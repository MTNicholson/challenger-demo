import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Coins,
  Gift,
  MapPin,
} from "lucide-react";
import { challenges, getChallengeById } from "@/data/challenges";
import { getBrandLocations } from "@/data/locations";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";

export function generateStaticParams() {
  return challenges.map((challenge) => ({
    id: challenge.id,
  }));
}

export default async function ChallengeDetailPage({
  params,
}: PageProps<"/app/challenges/[id]">) {
  const { id } = await params;
  const challenge = getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  const progress = challenge.progress ?? {
    current: challenge.isActive ? 1 : 0,
    total: 1,
    label: challenge.isActive ? "1 из 1" : "Еще не начат",
  };
  const locations = getBrandLocations(challenge.brandId).slice(0, 5);
  const remaining = Math.max(0, progress.total - progress.current);

  return (
    <main className="space-y-5">
      <section className="relative overflow-hidden rounded-[36px] bg-[linear-gradient(145deg,#111827,#334155)] p-4 text-white shadow-2xl shadow-slate-900/15">
        <div className="relative z-10 flex items-center justify-between">
          <Link
            href={routes.user.challenges}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur"
            aria-label="Назад"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <Badge className="bg-white/15 px-4 py-2 text-white backdrop-blur">
            {challenge.category}
          </Badge>
        </div>

        <div className="relative z-10 mt-14">
          <div className="mb-4 grid h-20 w-20 place-items-center rounded-[28px] bg-white/15 text-5xl backdrop-blur">
            {challenge.emoji}
          </div>
          <p className="text-sm font-bold text-white/60">
            {challenge.brandName}
          </p>
          <h1 className="mt-2 text-4xl font-black leading-none">
            {challenge.title}
          </h1>
          <p className="mt-4 max-w-72 text-sm font-semibold leading-6 text-white/70">
            {challenge.description}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            <div className="rounded-[22px] bg-white/12 p-3 backdrop-blur">
              <p className="text-xs font-bold text-white/50">Условие</p>
              <p className="mt-1 text-sm font-black">{challenge.condition}</p>
            </div>
            <div className="rounded-[22px] bg-amber-300 p-3 text-slate-950">
              <p className="text-xs font-bold text-amber-900/70">Награда</p>
              <p className="mt-1 text-sm font-black">{challenge.reward}</p>
            </div>
          </div>
        </div>
        <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-amber-300/30" />
        <div className="absolute right-20 top-24 h-24 w-24 rounded-full bg-emerald-300/25" />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-[28px] bg-amber-100 p-4 text-amber-950 shadow-sm">
          <Coins className="h-6 w-6" />
          <p className="mt-5 text-sm font-bold text-amber-700">Бонус</p>
          <p className="text-3xl font-black">{challenge.coinsReward}</p>
          <p className="text-sm font-semibold">монет</p>
        </div>
        <div className="rounded-[28px] bg-white p-4 shadow-sm">
          <CalendarDays className="h-6 w-6 text-slate-500" />
          <p className="mt-5 text-sm font-bold text-slate-400">Осталось</p>
          <p className="text-3xl font-black">{challenge.daysLeft}</p>
          <p className="text-sm font-semibold text-slate-500">дня</p>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-400">Прогресс сейчас</p>
            <h2 className="mt-1 text-2xl font-black">{progress.label}</h2>
          </div>
          <Badge variant={challenge.isActive ? "success" : "neutral"}>
            {challenge.isActive ? "Уже начат" : "Готов к старту"}
          </Badge>
        </div>
        <ProgressBar
          value={progress.current}
          max={progress.total}
          className="mt-4"
        />
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {remaining > 0
            ? `До награды осталось ${remaining} визита.`
            : "Награда уже готова к получению."}{" "}
          Продолжите маршрут и откройте QR на финальном шаге.
        </p>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
            <Gift className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400">Финальная награда</p>
            <h2 className="mt-1 text-xl font-black">{challenge.reward}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              После выполнения условия награда появится на экране QR-кода для кассы.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Адреса и чек-лист</h2>
        <div className="mt-4 space-y-3">
          {locations.map((location, index) => (
            <div key={location.id} className="flex items-center gap-3">
              <div
                className={
                  location.visited
                    ? "grid h-10 w-10 place-items-center rounded-full bg-emerald-100 text-emerald-700"
                    : "grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-400"
                }
              >
                {location.visited ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-black">{index + 1}</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-black text-slate-800">
                  {location.title}
                </p>
                <p className="text-xs font-semibold text-slate-400">
                  {location.visited ? location.visitTime : location.distance}
                </p>
              </div>
              {!location.visited ? (
                <MapPin className="h-4 w-4 shrink-0 text-slate-300" />
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="sticky bottom-24 z-10 space-y-3 rounded-[30px] bg-white/90 p-3 shadow-2xl shadow-slate-900/15 backdrop-blur">
        <Link
          href={routes.user.activeChallenge}
          className={buttonClasses({
            variant: "dark",
            size: "lg",
            className: "w-full",
          })}
        >
          Принять челлендж
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
          <MapPin className="h-5 w-5" />
          Показать на карте
        </Link>
      </section>
    </main>
  );
}
