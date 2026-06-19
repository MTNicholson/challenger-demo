import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Coins,
  Heart,
  MapPin,
  Share2,
} from "lucide-react";
import { challenges, getChallengeById } from "@/data/challenges";
import { getBrandLocations } from "@/data/locations";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";

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
  const progressPercent = Math.min(
    100,
    Math.round((progress.current / progress.total) * 100),
  );
  const locations = getBrandLocations(challenge.brandId).slice(0, 5);

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
          <div className="flex gap-2">
            <span
              className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur"
              aria-label="Поделиться"
            >
              <Share2 className="h-5 w-5" />
            </span>
            <span
              className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur"
              aria-label="В избранное"
            >
              <Heart className="h-5 w-5" />
            </span>
          </div>
        </div>
        <div className="relative z-10 mt-16">
          <div className="mb-4 grid h-20 w-20 place-items-center rounded-[28px] bg-white/15 text-5xl backdrop-blur">
            {challenge.emoji}
          </div>
          <p className="text-sm font-bold text-white/60">
            {challenge.brandName}
          </p>
          <h1 className="mt-2 text-4xl font-black leading-none">
            {challenge.title}
          </h1>
        </div>
        <div className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-amber-300/30" />
        <div className="absolute right-20 top-24 h-24 w-24 rounded-full bg-emerald-300/25" />
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-[28px] bg-amber-100 p-4 text-amber-950 shadow-sm">
          <Coins className="h-6 w-6" />
          <p className="mt-5 text-sm font-bold text-amber-700">Награда</p>
          <p className="text-3xl font-black">{challenge.coinsReward}</p>
          <p className="text-sm font-semibold">монет</p>
        </div>
        <div className="rounded-[28px] bg-white p-4 shadow-sm">
          <p className="text-sm font-bold text-slate-400">Прогресс</p>
          <p className="mt-4 text-3xl font-black">
            {progress.current}/{progress.total}
          </p>
          <div className="mt-3 h-3 rounded-full bg-slate-100">
            <div
              className="h-3 rounded-full bg-emerald-400"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Что нужно сделать</h2>
        <div className="mt-4 grid gap-3">
          <div className="rounded-[24px] bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-400">Условие</p>
            <p className="mt-1 font-black">{challenge.condition}</p>
          </div>
          <div className="rounded-[24px] bg-emerald-50 p-4 text-emerald-950">
            <p className="text-sm font-bold text-emerald-700">Финальная награда</p>
            <p className="mt-1 font-black">{challenge.reward}</p>
          </div>
          <div className="rounded-[24px] bg-amber-50 p-4 text-amber-950">
            <p className="text-sm font-bold text-amber-700">Статус</p>
            <p className="mt-1 font-black">{progress.label}</p>
          </div>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Правила</h2>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {challenge.description} Условие: {challenge.condition}. После
          выполнения награда «{challenge.reward}» появится в кошельке
          автоматически.
        </p>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Адреса маршрута</h2>
        <div className="mt-4 space-y-3">
          {locations.map((location) => (
            <div key={location.id} className="flex items-center gap-3">
              <div
                className={
                  location.visited
                    ? "grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700"
                    : "grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-400"
                }
              >
                {location.visited ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <MapPin className="h-5 w-5" />
                )}
              </div>
              <span className="text-sm font-semibold text-slate-700">
                {location.title}
              </span>
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
        <div className="grid grid-cols-2 gap-2">
          <Link
            href={routes.user.map}
            className={buttonClasses({
              variant: "secondary",
              size: "sm",
              className: "w-full",
            })}
          >
            Показать на карте
          </Link>
          <Link
            href={routes.user.challenges}
            className={buttonClasses({
              variant: "secondary",
              size: "sm",
              className: "w-full",
            })}
          >
            Назад к челленджам
          </Link>
        </div>
      </section>
    </main>
  );
}
