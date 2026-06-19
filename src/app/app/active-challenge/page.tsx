import Link from "next/link";
import { CalendarDays, Check, Coins, Map, MapPin } from "lucide-react";
import { routes } from "@/lib/routes";

const visits = [
  { place: "Невский 24", time: "Сегодня, 10:20", done: true },
  { place: "Гороховая 12", time: "Вчера, 18:05", done: true },
  { place: "Большой пр. 8", time: "15 июня, 12:40", done: true },
  { place: "Литейный 40", time: "Ожидает визит", done: false },
  { place: "Малая Морская 5", time: "Ожидает визит", done: false },
];

export default function ActiveChallengePage() {
  return (
    <main className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-slate-400">Активный маршрут</p>
        <h1 className="mt-1 text-3xl font-black">Кофейный маршрут</h1>
      </header>

      <section className="rounded-[34px] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/15">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white/55">Прогресс</p>
            <p className="mt-1 text-5xl font-black">3/5</p>
          </div>
          <div className="grid h-20 w-20 place-items-center rounded-[28px] bg-white/10 text-4xl">
            ☕
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2">
          {visits.map((visit, index) => (
            <div key={visit.place} className="flex flex-1 items-center">
              <div
                className={
                  visit.done
                    ? "grid h-9 w-9 place-items-center rounded-full bg-emerald-300 text-slate-950"
                    : "grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white/50"
                }
              >
                {visit.done ? <Check className="h-5 w-5" /> : index + 1}
              </div>
              {index < visits.length - 1 ? (
                <div
                  className={
                    visit.done
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
          <p className="text-2xl font-black">200 монет</p>
        </div>
        <div className="rounded-[28px] bg-white p-4 shadow-sm">
          <CalendarDays className="h-6 w-6 text-slate-500" />
          <p className="mt-4 text-sm font-bold text-slate-400">Осталось</p>
          <p className="text-2xl font-black">4 дня</p>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">История визитов</h2>
        <div className="mt-4 space-y-3">
          {visits.map((visit) => (
            <div key={visit.place} className="flex items-center gap-3">
              <div
                className={
                  visit.done
                    ? "grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"
                    : "grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-400"
                }
              >
                {visit.done ? <Check className="h-5 w-5" /> : <MapPin className="h-5 w-5" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold">Coffee Place, {visit.place}</p>
                <p className="text-sm text-slate-500">{visit.time}</p>
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
