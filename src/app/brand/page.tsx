import Link from "next/link";
import { ArrowUpRight, Coffee, Eye, Gift, Target, Users } from "lucide-react";
import { challenges } from "@/data/challenges";
import { routes } from "@/lib/routes";

const metrics = [
  { label: "Участников", value: "1 284", delta: "+14%", icon: Users },
  { label: "Активных челленджей", value: "6", delta: "+2", icon: Target },
  { label: "Выдано наград", value: "342", delta: "+31", icon: Gift },
];

export default function BrandDashboardPage() {
  return (
    <main className="space-y-6">
      <section className="rounded-[32px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-sm font-semibold text-white/70">
              <Coffee className="h-4 w-4" />
              Coffee Place
            </div>
            <h1 className="mt-5 text-4xl font-black">Обзор бренда</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
              Демо-кабинет показывает, как бренд управляет челленджами,
              вовлечением гостей и наградами без лишней сложности.
            </p>
          </div>
          <Link
            href={routes.brand.preview}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950"
          >
            <Eye className="h-4 w-4" />
            Превью гостя
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.label} className="rounded-[28px] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50">
                  <Icon className="h-5 w-5 text-slate-600" />
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                  {metric.delta}
                </span>
              </div>
              <div className="mt-5 text-3xl font-black">{metric.value}</div>
              <div className="mt-1 text-sm font-semibold text-slate-500">
                {metric.label}
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-black">Запущенные механики</h2>
          <Link
            href={routes.brand.challenges}
            className="inline-flex items-center gap-1 text-sm font-black"
          >
            Все <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {challenges.slice(0, 4).map((challenge) => (
            <div key={challenge.id} className="rounded-[24px] bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black">{challenge.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {challenge.condition}
                  </p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">
                  {challenge.daysLeft} дн.
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
