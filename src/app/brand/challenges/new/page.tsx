import Link from "next/link";
import { CalendarDays, Eye, Gift, MapPin, Target, Users } from "lucide-react";
import { companyBrand } from "@/data/brands";
import { getBrandChallenges } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";

const campaign = getBrandChallenges(companyBrand.id)[0];

const fields = [
  { label: "Название кампании", value: campaign.title, icon: Target },
  { label: "Условие челленджа", value: campaign.condition, icon: Target },
  { label: "Награда", value: campaign.reward, icon: Gift },
  { label: "Целевая аудитория", value: "Гости 18–35 лет, посещавшие кофейню за последние 30 дней", icon: Users },
  { label: "Точки проведения", value: `Все точки ${companyBrand.name} · ${companyBrand.locationsCount} адресов`, icon: MapPin },
  { label: "Длительность", value: "7 дней после старта участника", icon: CalendarDays },
];

export default function NewChallengePage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="rounded-[32px] bg-white p-6 shadow-sm">
        <div className="text-sm font-semibold text-slate-400">Конструктор · шаги 1–6</div>
        <h1 className="mt-1 text-3xl font-black">Настройка челленджа</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Готовый демо-сценарий кампании Coffee Place. Поля показывают структуру настройки без сохранения данных.
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {fields.map((field, index) => {
            const Icon = field.icon;
            return (
              <div key={field.label} className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400">
                  <Icon className="h-4 w-4" /> Шаг {index + 1}
                </div>
                <div className="mt-3 text-sm font-bold text-slate-600">{field.label}</div>
                <div className="mt-2 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm">
                  {field.value}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={routes.brand.preview} className={buttonClasses({ variant: "dark" })}>
            <Eye className="h-4 w-4" /> Посмотреть превью
          </Link>
          <Link href={routes.brand.challenges} className={buttonClasses({ variant: "ghost" })}>
            К списку челленджей
          </Link>
        </div>
      </section>

      <aside className="self-start rounded-[32px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10 lg:sticky lg:top-28">
        <div className="text-sm text-white/60">Превью карточки</div>
        <div className="mt-5 grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-3xl">{campaign.emoji}</div>
        <h2 className="mt-4 text-2xl font-black">{campaign.title}</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">{campaign.description}</p>
        <div className="mt-6 space-y-3 text-sm font-semibold">
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"><Target className="h-5 w-5 text-emerald-300" />{campaign.condition}</div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"><Gift className="h-5 w-5 text-amber-300" />{campaign.reward}</div>
          <div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3"><CalendarDays className="h-5 w-5 text-sky-300" />7 дней</div>
        </div>
      </aside>
    </main>
  );
}
