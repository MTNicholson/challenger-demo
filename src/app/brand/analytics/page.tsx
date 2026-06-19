import { BarChart3, TrendingUp, Users } from "lucide-react";

const bars = [42, 64, 58, 78, 86, 73, 92];

export default function BrandAnalyticsPage() {
  return (
    <main className="space-y-6">
      <section>
        <div className="text-sm font-semibold text-slate-400">Аналитика</div>
        <h1 className="mt-1 text-3xl font-black">Динамика кампаний</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Легкий демо-срез по участникам, визитам и выдаче наград.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Новые участники", "248", Users],
          ["Повторные визиты", "41%", TrendingUp],
          ["Сканов QR", "612", BarChart3],
        ].map(([label, value, Icon]) => (
          <div key={label as string} className="rounded-[28px] bg-white p-5 shadow-sm">
            <Icon className="h-6 w-6 text-slate-500" />
            <div className="mt-5 text-3xl font-black">{value as string}</div>
            <div className="mt-1 text-sm font-semibold text-slate-500">
              {label as string}
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[32px] bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black">Активность за неделю</h2>
        <div className="mt-8 flex h-64 items-end gap-3">
          {bars.map((height, index) => (
            <div key={index} className="flex flex-1 flex-col items-center gap-3">
              <div
                className="w-full rounded-t-2xl bg-emerald-400"
                style={{ height: `${height}%` }}
              />
              <span className="text-xs font-bold text-slate-400">
                {index + 1}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
