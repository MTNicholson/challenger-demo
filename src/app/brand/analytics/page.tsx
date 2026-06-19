import Link from "next/link";
import { BarChart3, Gift, Repeat2, Target, Users } from "lucide-react";
import { companyAnalytics } from "@/data/analytics";
import { companyBrand } from "@/data/brands";
import { getBrandChallenges } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { Card } from "@/components/ui/card";
import { BrandMetricCard } from "@/components/brand/brand-metric-card";
import { BrandPageHeader } from "@/components/brand/brand-page-header";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const campaign = getBrandChallenges(companyBrand.id)[0];
const days = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export default function BrandAnalyticsPage() {
  const metrics = [
    { label: "Участники", value: companyAnalytics.participants.toLocaleString("ru-RU"), delta: "+248 за неделю", icon: Users },
    { label: "Активации наград", value: companyAnalytics.issuedRewards.toLocaleString("ru-RU"), delta: "27% участников", icon: Gift },
    { label: "Повторные визиты", value: `${companyAnalytics.repeatVisitsPercent}%`, delta: "+6 п. п.", icon: Repeat2 },
    { label: "Активные челленджи", value: String(companyAnalytics.activeChallenges), delta: "Coffee Place", icon: Target },
  ];

  return (
    <main className="space-y-6">
      <BrandPageHeader eyebrow="Аналитика Coffee Place" title={campaign.title} description="Результаты текущей активной кампании: участие, выдача наград и повторные визиты гостей." />
      <Card className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div><Badge variant="success">Кампания активна</Badge><div className="mt-3 text-lg font-black">{campaign.condition} · {campaign.reward}</div></div>
        <div className="text-sm font-bold text-slate-500">Осталось {campaign.daysLeft} дня</div>
      </Card>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">{metrics.map((metric) => <BrandMetricCard key={metric.label} {...metric} />)}</section>
      <Card className="p-6">
        <div className="flex items-center gap-3"><BarChart3 className="h-6 w-6 text-emerald-600" /><h2 className="text-2xl font-black">Активность за неделю</h2></div>
        <div className="mt-8 flex h-64 items-end gap-3">
          {companyAnalytics.weeklyActivity.map((height, index) => (
            <div key={days[index]} className="flex flex-1 flex-col items-center gap-3"><div className="w-full rounded-t-2xl bg-emerald-400" style={{ height: `${height}%` }} /><span className="text-xs font-bold text-slate-400">{days[index]}</span></div>
          ))}
        </div>
      </Card>
      <div className="flex flex-wrap gap-3">
        <Link href={routes.brand.challenges} className={buttonClasses({ variant: "ghost" })}>К челленджам</Link>
        <Link href={routes.brand.rewards} className={buttonClasses({ variant: "dark" })}><Gift className="h-4 w-4" />К наградам</Link>
      </div>
    </main>
  );
}
