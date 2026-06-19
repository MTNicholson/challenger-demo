import { BarChart3, TrendingUp, Users } from "lucide-react";
import { companyAnalytics } from "@/data/analytics";
import { Card } from "@/components/ui/card";
import { BrandMetricCard } from "@/components/brand/brand-metric-card";
import { BrandPageHeader } from "@/components/brand/brand-page-header";

export default function BrandAnalyticsPage() {
  const metrics = [
    {
      label: "Новые участники",
      value: String(companyAnalytics.newParticipants),
      icon: Users,
    },
    {
      label: "Повторные визиты",
      value: `${companyAnalytics.repeatVisitsPercent}%`,
      icon: TrendingUp,
    },
    {
      label: "Сканы QR",
      value: String(companyAnalytics.qrScans),
      icon: BarChart3,
    },
  ];

  return (
    <main className="space-y-6">
      <BrandPageHeader
        description="Легкий демо-срез по участникам, визитам и выдаче наград."
        eyebrow="Аналитика"
        title="Динамика кампаний"
      />

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <BrandMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <Card className="p-6">
        <h2 className="text-2xl font-black">Активность за неделю</h2>
        <div className="mt-8 flex h-64 items-end gap-3">
          {companyAnalytics.weeklyActivity.map((height, index) => (
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
      </Card>
    </main>
  );
}
