import { CalendarDays, Gift, Target } from "lucide-react";

const fields = [
  { label: "Название", value: "Кофейная неделя" },
  { label: "Условие", value: "5 визитов за 7 дней" },
  { label: "Награда", value: "Авторский раф бесплатно" },
];

export default function NewChallengePage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="rounded-[32px] bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-400">Конструктор</div>
        <h1 className="mt-1 text-3xl font-black">Новый челлендж</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Статичный демо-экран показывает будущий сценарий создания механики.
        </p>

        <div className="mt-6 space-y-4">
          {fields.map((field) => (
            <label key={field.label} className="block">
              <span className="text-sm font-bold text-slate-600">
                {field.label}
              </span>
              <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800">
                {field.value}
              </div>
            </label>
          ))}
        </div>

        <button className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-black text-white">
          Сохранить черновик
        </button>
      </section>

      <aside className="rounded-[32px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
        <div className="text-sm text-white/60">Превью карточки</div>
        <h2 className="mt-3 text-2xl font-black">Кофейная неделя</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Загляни 5 раз за неделю и забери авторский напиток.
        </p>
        <div className="mt-6 space-y-3 text-sm font-semibold">
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
            <Target className="h-5 w-5 text-emerald-300" />
            5 визитов
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
            <Gift className="h-5 w-5 text-amber-300" />
            Авторский раф
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3">
            <CalendarDays className="h-5 w-5 text-sky-300" />
            7 дней
          </div>
        </div>
      </aside>
    </main>
  );
}
