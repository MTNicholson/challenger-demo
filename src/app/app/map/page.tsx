import Link from "next/link";
import { Coffee, Coins, MapPin, Navigation, Sparkles } from "lucide-react";
import { routes } from "@/lib/routes";

const chips = ["Все", "Кофе", "Еда", "Спорт"];
const pins = [
  "left-12 top-24 bg-amber-500",
  "right-12 top-32 bg-rose-500",
  "left-24 bottom-28 bg-emerald-500",
  "right-24 bottom-40 bg-sky-500",
];

export default function UserMapPage() {
  return (
    <main className="-mx-5 -my-5 min-h-screen overflow-hidden bg-[#e8efe4] pb-28">
      <section className="relative min-h-screen px-5 pt-5">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.65)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.65)_1px,transparent_1px)] bg-[size:54px_54px]" />
        <div className="absolute left-0 top-32 h-28 w-full rotate-[-18deg] bg-white/35" />
        <div className="absolute left-0 top-80 h-24 w-full rotate-[22deg] bg-white/30" />

        <div className="relative z-10 flex gap-2 overflow-x-auto pb-4">
          {chips.map((chip, index) => (
            <button
              key={chip}
              className={
                index === 0
                  ? "shrink-0 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white shadow-lg"
                  : "shrink-0 rounded-full bg-white/90 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm backdrop-blur"
              }
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="relative z-10 mt-3 flex items-center justify-between rounded-full bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
          <div>
            <p className="text-xs font-bold text-slate-400">Сейчас рядом</p>
            <p className="text-sm font-black">5 точек Coffee Place</p>
          </div>
          <Navigation className="h-5 w-5 text-slate-500" />
        </div>

        {pins.map((pin, index) => (
          <div
            key={pin}
            className={`absolute z-10 grid h-12 w-12 place-items-center rounded-full text-white shadow-xl shadow-slate-900/20 ${pin}`}
          >
            {index === 0 ? (
              <Coffee className="h-5 w-5" />
            ) : (
              <MapPin className="h-5 w-5" />
            )}
          </div>
        ))}

        <Link
          href={routes.user.activeChallenge}
          className="absolute bottom-32 left-5 right-5 z-20 rounded-[32px] bg-white p-5 shadow-2xl shadow-slate-900/15"
        >
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] bg-amber-100 text-3xl">
              ☕
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 text-sm font-bold text-emerald-700">
                <Sparkles className="h-4 w-4" />
                Выбрано
              </div>
              <h1 className="mt-1 text-xl font-black">Кофейный маршрут</h1>
              <p className="mt-1 text-sm text-slate-500">
                3/5 визитов, ближайшая точка 450 м
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm font-black text-amber-700">
                <Coins className="h-4 w-4" />
                Награда 200 монет
              </div>
            </div>
          </div>
          <div className="mt-4 h-3 rounded-full bg-slate-100">
            <div className="h-3 w-3/5 rounded-full bg-emerald-400" />
          </div>
        </Link>
      </section>
    </main>
  );
}
