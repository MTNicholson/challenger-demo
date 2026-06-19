import { Clock, Copy, Gift, ShieldCheck } from "lucide-react";

const qrCells = [
  0, 1, 2, 4, 5, 7, 8, 10, 12, 13, 16, 18, 20, 21, 22, 24, 25, 27, 28, 31, 32,
  34, 36, 38, 39, 40, 42, 45, 46, 48, 49, 50, 52, 54, 56, 57, 59, 60, 62, 63,
];

const rules = [
  "Покажите QR-код сотруднику Coffee Place.",
  "Награда действует только один раз.",
  "Код нельзя передать другому пользователю.",
];

export default function UserRewardPage() {
  return (
    <main className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-slate-400">Кошелек</p>
        <h1 className="mt-1 text-3xl font-black">Награда</h1>
      </header>

      <section className="rounded-[34px] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] bg-amber-100 text-3xl">
            ☕
          </div>
          <div>
            <p className="text-sm font-bold text-slate-400">Coffee Place</p>
            <h2 className="mt-1 text-2xl font-black">Напиток на выбор</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Получено за прохождение кофейного маршрута.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[36px] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/15">
        <div className="mx-auto grid h-64 w-64 grid-cols-8 gap-1 rounded-[28px] bg-white p-5">
          {Array.from({ length: 64 }).map((_, index) => (
            <div
              key={index}
              className={
                qrCells.includes(index)
                  ? "rounded-sm bg-slate-950"
                  : "rounded-sm bg-slate-100"
              }
            />
          ))}
        </div>

        <div className="mt-5 rounded-[24px] bg-white/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white/55">Ручной код</p>
              <p className="mt-1 text-2xl font-black tracking-[0.16em]">
                CP-4829
              </p>
            </div>
            <button
              className="grid h-11 w-11 place-items-center rounded-full bg-white text-slate-950"
              aria-label="Скопировать код"
            >
              <Copy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-[28px] bg-emerald-50 p-4 text-emerald-950 shadow-sm">
          <Clock className="h-6 w-6" />
          <p className="mt-4 text-sm font-bold text-emerald-700">Истекает</p>
          <p className="text-2xl font-black">02:14:36</p>
        </div>
        <div className="rounded-[28px] bg-white p-4 shadow-sm">
          <Gift className="h-6 w-6 text-slate-500" />
          <p className="mt-4 text-sm font-bold text-slate-400">Тип</p>
          <p className="text-2xl font-black">QR</p>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <h2 className="text-xl font-black">Правила</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {rules.map((rule) => (
            <li key={rule} className="flex gap-3 text-sm leading-6 text-slate-600">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
              {rule}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
