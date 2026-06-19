import Link from "next/link";
import { ArrowLeft, BarChart3, CalendarDays, Gift, MapPin, QrCode, Target, TrendingUp } from "lucide-react";
import { companyBrand } from "@/data/brands";
import { getBrandChallenges } from "@/data/challenges";
import { getBrandLocations } from "@/data/locations";
import { companyAnalytics } from "@/data/analytics";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const campaign = getBrandChallenges(companyBrand.id)[0];
const selectedLocations = getBrandLocations(companyBrand.id);

const summary = [
  { icon: QrCode, label: "Механика", value: "Серия из 5 QR-визитов" },
  { icon: Gift, label: "Награда", value: "Напиток на выбор + 200 монет" },
  { icon: MapPin, label: "География", value: `${selectedLocations.length} точек Coffee Place` },
  { icon: CalendarDays, label: "Срок кампании", value: "24 июня — 31 июля · 38 дней" },
];

export default function BrandPreviewPage() {
  return (
    <main className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div><div className="text-sm font-semibold text-slate-400">Шаг 5 · Превью</div><h1 className="mt-1 text-3xl font-black">Проверьте кампанию перед запуском</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Слева — экран гостя, справа — параметры для команды Coffee Place.</p></div>
        <Link href={routes.brand.newChallenge} className={buttonClasses({ variant: "ghost" })}><ArrowLeft className="h-4 w-4" />Вернуться к настройке</Link>
      </header>

      <div className="grid gap-6 xl:grid-cols-[430px_minmax(0,1fr)]">
        <section aria-label="Превью челленджа на телефоне" className="mx-auto w-full max-w-[430px] self-start rounded-[46px] border-[9px] border-slate-950 bg-slate-950 p-2 shadow-2xl shadow-slate-900/20">
          <div className="overflow-hidden rounded-[32px] bg-[#f6f2ea]">
            <div className="flex items-center justify-between bg-white px-5 py-3 text-[11px] font-black"><span>9:41</span><span className="h-2.5 w-20 rounded-full bg-slate-950" /><span>100%</span></div>
            <div className="p-5">
              <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-2xl shadow-sm">{companyBrand.logo}</div><div><div className="font-black">{companyBrand.name}</div><div className="text-xs text-slate-500">Челлендж от бренда</div></div></div><Badge variant="success">Активен</Badge></div>
              <article className="mt-5 rounded-[30px] bg-slate-950 p-5 text-white shadow-xl">
                <div className="flex items-start justify-between"><span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black text-emerald-300">Легко · 7 дней</span><span className="text-4xl">{campaign.emoji}</span></div>
                <h2 className="mt-5 text-2xl font-black">{campaign.title}</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">Посетите пять Coffee Place за неделю и откройте напиток на выбор.</p>
                <div className="mt-5 space-y-2"><div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sm font-bold"><Target className="h-5 w-5 text-emerald-300" />5 визитов за 7 дней</div><div className="flex items-center gap-3 rounded-2xl bg-white/10 p-3 text-sm font-bold"><Gift className="h-5 w-5 text-amber-300" />Напиток + 200 монет</div></div>
              </article>
              <div className="mt-4 rounded-[24px] bg-white p-4 shadow-sm"><div className="flex justify-between text-sm"><span className="font-black">Ваш прогресс</span><span className="font-bold text-emerald-700">3 из 5</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full w-3/5 rounded-full bg-emerald-500" /></div><p className="mt-3 text-xs leading-5 text-slate-500">Ещё 2 визита — и награда появится в кошельке.</p></div>
              <div className="mt-4 flex items-center gap-3 rounded-[24px] bg-emerald-100 p-4 text-emerald-950"><MapPin className="h-5 w-5 shrink-0" /><div><div className="text-sm font-black">Ближайшая точка · 450 м</div><div className="mt-0.5 text-xs text-emerald-800">Coffee Place, Невский 24</div></div></div>
            </div>
          </div>
        </section>

        <section className="space-y-5 self-start">
          <div className="rounded-[32px] bg-white p-6 shadow-sm"><div className="text-sm font-semibold text-slate-400">Сводка для бренда</div><h2 className="mt-1 text-2xl font-black">Кофейный маршрут</h2><div className="mt-5 grid gap-3 md:grid-cols-2">{summary.map(({ icon: Icon, label, value }) => <div key={label} className="rounded-2xl bg-slate-50 p-4"><Icon className="h-5 w-5 text-slate-400" /><div className="mt-3 text-xs font-black uppercase tracking-wider text-slate-400">{label}</div><div className="mt-1 text-sm font-black">{value}</div></div>)}</div></div>
          <div className="rounded-[32px] bg-slate-950 p-6 text-white shadow-xl shadow-slate-900/10"><div className="flex items-center gap-2 text-sm font-semibold text-emerald-300"><TrendingUp className="h-4 w-4" />Ожидаемый KPI</div><div className="mt-4 grid gap-3 sm:grid-cols-3"><div><div className="text-3xl font-black">600+</div><div className="mt-1 text-xs text-white/50">участников</div></div><div><div className="text-3xl font-black">35%</div><div className="mt-1 text-xs text-white/50">завершат маршрут</div></div><div><div className="text-3xl font-black">210</div><div className="mt-1 text-xs text-white/50">активаций награды</div></div></div><p className="mt-5 border-t border-white/10 pt-4 text-xs leading-5 text-white/45">Оценка основана на текущей аудитории бренда: {companyAnalytics.followers.toLocaleString("ru-RU")} подписчиков и {companyAnalytics.repeatVisitsPercent}% повторных визитов.</p></div>
          <div className="flex flex-wrap gap-3 rounded-[28px] bg-white p-4 shadow-sm"><Link href={routes.brand.analytics} className={buttonClasses({ variant: "dark" })}><BarChart3 className="h-4 w-4" />К аналитике</Link><Link href={routes.brand.challenges} className={buttonClasses({ variant: "ghost" })}>К списку челленджей</Link></div>
        </section>
      </div>
    </main>
  );
}
