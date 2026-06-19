import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Coffee,
  Dumbbell,
  Gift,
  MapPin,
  Navigation,
  Sparkles,
  Utensils,
} from "lucide-react";
import { getChallengeById } from "@/data/challenges";
import { getBrandLocations } from "@/data/locations";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";

const chips = ["Все", "Кофе", "Еда", "Спорт", "Beauty"];

const mapPins = [
  {
    id: "coffee-place",
    label: "Coffee Place",
    className: "left-[44%] top-[44%] bg-slate-950 text-white ring-4 ring-amber-300",
    icon: Coffee,
    selected: true,
  },
  {
    id: "fitpro",
    label: "FitPro",
    className: "left-[18%] top-[58%] bg-sky-500 text-white",
    icon: Dumbbell,
  },
  {
    id: "beauty-store",
    label: "Beauty Store",
    className: "right-[18%] top-[26%] bg-violet-500 text-white",
    icon: Sparkles,
  },
  {
    id: "sweetly",
    label: "Sweetly Desserts",
    className: "right-[24%] bottom-[28%] bg-rose-500 text-white",
    icon: Utensils,
  },
  {
    id: "coffee-second",
    label: "Coffee Place",
    className: "left-[24%] top-[24%] bg-amber-500 text-white",
    icon: Coffee,
  },
];

const nearbyPoints = [
  {
    brandId: "coffee-place",
    title: "Coffee Place",
    category: "Кофе",
    distance: "450 м от вас",
    reward: "Кофейный маршрут · 200 монет",
    icon: Coffee,
    className: "bg-amber-100 text-amber-800",
  },
  {
    brandId: "fitpro",
    title: "FitPro",
    category: "Спорт",
    distance: "1,4 км от вас",
    reward: "10 000 шагов · 200 монет",
    icon: Dumbbell,
    className: "bg-sky-100 text-sky-800",
  },
  {
    brandId: "beauty-store",
    title: "Beauty Store",
    category: "Beauty",
    distance: "2,1 км от вас",
    reward: "Beauty Rewards · скидка 20%",
    icon: Sparkles,
    className: "bg-violet-100 text-violet-800",
  },
  {
    brandId: "sweetly-desserts",
    title: "Sweetly Desserts",
    category: "Еда",
    distance: "1,2 км от вас",
    reward: "Десерт после 18:00 · 90 монет",
    icon: Utensils,
    className: "bg-rose-100 text-rose-800",
  },
];

export default function UserMapPage() {
  const challenge = getChallengeById("coffee-route")!;
  const progress = challenge.progress!;
  const coffeeLocations = getBrandLocations(challenge.brandId);
  const selectedLocation = coffeeLocations.find((location) => !location.visited) ?? coffeeLocations[0];

  return (
    <main className="-mx-5 -my-5 min-h-screen overflow-hidden bg-[#e6efe6] pb-28">
      <section className="relative min-h-[690px] overflow-hidden px-5 pb-6 pt-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.62)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.62)_1px,transparent_1px)] bg-[size:56px_56px]" />
        <div className="absolute -left-16 top-28 h-28 w-[130%] rotate-[-17deg] rounded-full bg-white/45" />
        <div className="absolute -right-20 top-56 h-24 w-[125%] rotate-[22deg] rounded-full bg-white/40" />
        <div className="absolute -left-24 bottom-36 h-24 w-[140%] rotate-[-9deg] rounded-full bg-white/35" />
        <div className="absolute left-10 top-40 h-28 w-24 rounded-[28px] border border-white/60 bg-emerald-200/30" />
        <div className="absolute right-8 top-40 h-24 w-32 rounded-[30px] border border-white/60 bg-amber-100/45" />
        <div className="absolute bottom-48 left-16 h-24 w-32 rounded-[30px] border border-white/60 bg-sky-100/45" />
        <div className="absolute bottom-28 right-10 h-28 w-24 rounded-[28px] border border-white/60 bg-rose-100/45" />

        <div className="relative z-10 flex gap-2 overflow-x-auto pb-4">
          {chips.map((chip, index) => (
            <span
              key={chip}
              className={
                index === 0
                  ? "shrink-0 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-lg shadow-slate-900/15"
                  : "shrink-0 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm backdrop-blur"
              }
            >
              {chip}
            </span>
          ))}
        </div>

        <div className="relative z-10 flex items-center justify-between rounded-[26px] bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
              <Navigation className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-400">Петроградская · рядом с вами</p>
              <p className="truncate text-sm font-black">{coffeeLocations.length} точек Coffee Place поблизости</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
            онлайн
          </span>
        </div>

        <div className="absolute left-[50%] top-[51%] z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border border-emerald-400/30 bg-emerald-400/10" />
        <div className="absolute left-1/2 top-[51%] z-10 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500 ring-4 ring-white shadow-lg" />

        {mapPins.map((pin) => {
          const Icon = pin.icon;

          return (
            <div
              key={pin.id}
              className={`absolute z-20 grid h-12 w-12 place-items-center rounded-full shadow-2xl shadow-slate-900/20 ${pin.className}`}
              aria-label={pin.label}
            >
              <Icon className="h-5 w-5" />
              {pin.selected ? (
                <span className="absolute -bottom-7 whitespace-nowrap rounded-full bg-white px-3 py-1 text-[11px] font-black text-slate-950 shadow-sm">
                  выбрано
                </span>
              ) : null}
            </div>
          );
        })}

        <Link
          href={routes.user.activeChallenge}
          className="absolute bottom-6 left-5 right-5 z-30 rounded-[32px] bg-white p-5 shadow-2xl shadow-slate-900/18 transition hover:-translate-y-0.5"
        >
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] bg-amber-100 text-3xl">
              {challenge.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-sm font-bold text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />
                Активный челлендж
              </div>
              <h1 className="mt-1 text-xl font-black">{challenge.title}</h1>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                {challenge.brandName} · {selectedLocation.distance}
              </p>
              <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3">
                <div className="min-w-0">
                  <div className="flex items-center justify-between gap-3 text-xs font-bold text-slate-400">
                    <span>Прогресс</span>
                    <span>{progress.current}/{progress.total}</span>
                  </div>
                  <ProgressBar
                    value={progress.current}
                    max={progress.total}
                    className="mt-2 h-2"
                    indicatorClassName="bg-emerald-400"
                  />
                </div>
                <div className="flex items-center gap-1 rounded-full bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">
                  <Gift className="h-4 w-4" />
                  {challenge.reward}
                </div>
              </div>
            </div>
          </div>
          <div className={buttonClasses({ variant: "dark", size: "md", className: "mt-4 w-full" })}>
            Продолжить
            <ArrowRight className="h-4 w-4" />
          </div>
        </Link>
      </section>

      <section className="relative z-10 -mt-1 space-y-3 rounded-t-[34px] bg-[#f8f5ef] px-5 pb-8 pt-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-slate-400">Рядом на карте</p>
            <h2 className="text-2xl font-black">Точки и награды</h2>
          </div>
          <MapPin className="h-5 w-5 text-slate-400" />
        </div>

        <div className="space-y-3">
          {nearbyPoints.map((point) => {
            const Icon = point.icon;

            return (
              <Link
                key={point.brandId}
                href={point.brandId === "coffee-place" ? routes.user.activeChallenge : routes.user.challenges}
                className="grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-[24px] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className={`grid h-12 w-12 place-items-center rounded-2xl ${point.className}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-black">{point.title}</p>
                    <span className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-500">
                      {point.category}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold text-slate-500">
                    {point.reward}
                  </p>
                </div>
                <span className="text-right text-xs font-black text-slate-400">
                  {point.distance}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
