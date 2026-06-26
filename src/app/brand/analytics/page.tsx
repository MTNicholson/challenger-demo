import Link from "next/link";
import { ArrowRight, BarChart3, Gift, MapPin, Repeat2, Target, TrendingUp, Users } from "lucide-react";
import { campaignAnalytics, companyAnalytics, engagementFunnel, locationPerformance } from "@/data/analytics";
import { routes } from "@/lib/routes";
import { Card } from "@/components/ui/card";
import { BrandMetricCard } from "@/components/brand/brand-metric-card";
import { BrandPageHeader } from "@/components/brand/brand-page-header";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ChallengePerformanceChart, LocationsChart, RewardActivationsChart, WeeklyActivityChart } from "@/components/brand/analytics-charts";

const formatNumber = (value: number) => value.toLocaleString("ru-RU");

export default function BrandAnalyticsPage() {
  const metrics = [
    { label: "Участников", value: formatNumber(companyAnalytics.participants), delta: "+248 за неделю", icon: Users },
    { label: "Активных челленджей", value: companyAnalytics.activeChallenges, delta: "2 ключевые кампании", icon: Target },
    { label: "Выдано наград", value: formatNumber(companyAnalytics.issuedRewards), delta: "+19% за месяц", icon: Gift },
    { label: "Повторных визитов", value: `${companyAnalytics.repeatVisitsPercent}%`, delta: "+6 п. п.", icon: Repeat2 },
    { label: "Конверсия в награду", value: `${companyAnalytics.rewardConversionPercent}%`, delta: "из начавших", icon: BarChart3 },
    { label: "Рост визитов", value: `+${companyAnalytics.visitsGrowthPercent}%`, delta: "к прошлой неделе", icon: TrendingUp },
  ];

  return (
    <main className="space-y-6">
      <BrandPageHeader eyebrow="Аналитика Coffee Place · 13–19 июня" title="Эффективность бренда" description="Челленджи приводят гостей в кофейни, возвращают их повторно и превращают вовлечение в измеримые активации наград." />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((metric) => <BrandMetricCard key={metric.label} {...metric} />)}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_1fr]">
        <ChartCard title="Активность за неделю" caption={`${formatNumber(companyAnalytics.totalVisits)} визитов · +${companyAnalytics.visitsGrowthPercent}% к прошлой неделе`}><WeeklyActivityChart /></ChartCard>
        <ChartCard title="Активации наград" caption="Устойчивый рост за последние 4 недели"><RewardActivationsChart /></ChartCard>
      </section>

      <Card className="brand-glass-dark overflow-hidden border-white/10 bg-transparent p-6 text-white">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_1fr] xl:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3"><Badge variant="success">Кампания активна</Badge><span className="text-sm text-white/50">Осталось 4 дня</span></div>
            <h2 className="mt-4 text-3xl font-black">{campaignAnalytics.title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/60">Главная кампания недели уже вернула 329 гостей. Лучше всего маршрут работает на Петроградской.</p>
            <div className="mt-6 flex items-center gap-4"><ProgressBar value={campaignAnalytics.progressPercent} max={100} className="bg-white/10" indicatorClassName="bg-emerald-400"/><span className="shrink-0 text-sm font-black">{campaignAnalytics.progressPercent}% цели</span></div>
            <div className="mt-6 flex flex-wrap gap-3"><Link href={routes.brand.challenges} className={buttonClasses({ variant: "secondary" })}>Открыть челленджи <ArrowRight className="h-4 w-4"/></Link><Link href={routes.brand.rewards} className={buttonClasses({ variant: "ghost", className: "text-white hover:bg-white/10" })}>Управлять наградами</Link></div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <CampaignStat label="Участников" value={formatNumber(campaignAnalytics.participants)} />
            <CampaignStat label="Завершили" value={formatNumber(campaignAnalytics.completedUsers)} />
            <CampaignStat label="Наград выдано" value={formatNumber(campaignAnalytics.rewardsIssued)} />
            <CampaignStat label="Повторных визитов" value={formatNumber(campaignAnalytics.repeatVisits)} />
            <div className="col-span-2 rounded-2xl bg-white/8 p-4"><div className="flex items-center gap-2 text-xs text-white/45"><MapPin className="h-4 w-4"/>Лучшая точка</div><div className="mt-2 font-black">{campaignAnalytics.bestLocation}</div></div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 xl:grid-cols-2">
        <ChartCard title="Визиты по точкам" caption="Петроградская лидирует по трафику"><LocationsChart /></ChartCard>
        <ChartCard title="Сравнение челленджей" caption="Участники и завершившие"><ChallengePerformanceChart /></ChartCard>
      </section>

      <Card className="p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-sm font-semibold text-slate-400">Путь участника</div><h2 className="mt-1 text-2xl font-black">Воронка вовлечения</h2></div><div className="text-sm font-bold text-emerald-600">8% от просмотра до награды</div></div>
        <div className="mt-6 grid gap-2 lg:grid-cols-5">
          {engagementFunnel.map((step, index) => { const width = Math.max(45, (step.value / engagementFunnel[0].value) * 100); return <div key={step.label} className="relative overflow-hidden rounded-2xl bg-slate-50 p-4"><div className="absolute inset-y-0 left-0 bg-emerald-100/60" style={{ width: `${width}%` }}/><div className="relative"><div className="text-xs font-bold text-slate-400">0{index + 1}</div><div className="mt-4 text-2xl font-black">{formatNumber(step.value)}</div><div className="mt-1 text-xs font-semibold text-slate-600">{step.label}</div></div></div>; })}
        </div>
      </Card>

      <Card className="brand-table-card overflow-hidden p-0">
        <div className="border-b border-slate-100 p-6"><div className="text-sm font-semibold text-slate-400">Сеть Coffee Place</div><h2 className="mt-1 text-2xl font-black">Эффективность точек</h2></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-400"><tr>{["Точка", "Визиты", "Сканирования", "Награды", "Повторные визиты", "Динамика"].map((label) => <th key={label} className="px-6 py-4 font-bold">{label}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{locationPerformance.map((location) => <tr key={location.id} className="transition hover:bg-slate-50/70"><td className="px-6 py-5 font-black">{location.name}</td><td className="px-6 py-5">{formatNumber(location.visits)}</td><td className="px-6 py-5">{formatNumber(location.scans)}</td><td className="px-6 py-5">{formatNumber(location.rewards)}</td><td className="px-6 py-5">{formatNumber(location.repeatVisits)}</td><td className="px-6 py-5"><Badge variant="success">+{location.trend}%</Badge></td></tr>)}</tbody></table></div>
      </Card>
    </main>
  );
}

function ChartCard({ title, caption, children }: { title: string; caption: string; children: React.ReactNode }) { return <Card className="brand-interactive p-6"><div className="flex items-start justify-between gap-4"><div><div className="text-xs font-extrabold uppercase tracking-[0.14em] text-emerald-700">Динамика</div><h2 className="mt-1 text-xl font-extrabold">{title}</h2></div><span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,.12)]" /></div><p className="mt-1 text-sm font-semibold text-slate-400">{caption}</p><div className="mt-5 h-64 rounded-[22px] bg-white/35 p-2">{children}</div></Card>; }
function CampaignStat({ label, value }: { label: string; value: string }) { return <div className="rounded-2xl bg-white/8 p-4"><div className="text-2xl font-black">{value}</div><div className="mt-1 text-xs text-white/45">{label}</div></div>; }
