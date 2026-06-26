import Link from "next/link";
import { ArrowRight, BarChart3, Eye, Gift, PlusCircle, QrCode, Repeat2, Target, TrendingUp, Users } from "lucide-react";
import { companyAnalytics } from "@/data/analytics";
import { companyBrand } from "@/data/brands";
import { getBrandChallenges } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionTitle } from "@/components/ui/section-title";
import { BrandMetricCard } from "@/components/brand/brand-metric-card";
import { BrandPageHeader } from "@/components/brand/brand-page-header";
import { buttonClasses } from "@/components/ui/button";

const brandChallenges = getBrandChallenges(companyBrand.id);

export default function BrandDashboardPage() {
  const metrics = [
    {
      label: "Подписчиков",
      value: companyAnalytics.followers.toLocaleString("ru-RU"),
      delta: "+14%",
      icon: Users,
    },
    {
      label: "Активных челленджей",
      value: String(companyAnalytics.activeChallenges),
      delta: "+2",
      icon: Target,
    },
    {
      label: "Активаций наград",
      value: companyAnalytics.rewardActivations.toLocaleString("ru-RU"),
      delta: "+31",
      icon: Gift,
    },
  ];

  return (
    <main className="space-y-6">
      <BrandPageHeader
        actionHref={routes.brand.preview}
        actionIcon={Eye}
        actionLabel="Превью гостя"
        brandName={companyBrand.name}
        description="Кабинет бренда показывает, как команда управляет челленджами, вовлечением гостей и наградами без лишней сложности."
        title="Обзор бренда"
        variant="dark"
      />

      <p className="w-fit rounded-full border border-slate-200/70 bg-white/60 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
        Демо-сценарий бренда
      </p>

      <section className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <BrandMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link href={routes.brand.newChallenge} className={buttonClasses({ variant: "primary", size: "lg" })}>
          <PlusCircle className="h-5 w-5" />
          Создать челлендж
        </Link>
        <Link href={routes.brand.challenges} className={buttonClasses({ variant: "secondary", size: "lg" })}>
          <Target className="h-5 w-5" />
          Все челленджи
        </Link>
        <Link href={routes.brand.analytics} className={buttonClasses({ variant: "secondary", size: "lg" })}>
          <BarChart3 className="h-5 w-5" />
          Смотреть аналитику
        </Link>
        <Link href={routes.brand.scanner} className={buttonClasses({ variant: "secondary", size: "lg" })}>
          <QrCode className="h-5 w-5" />
          Открыть сканер
        </Link>
      </section>

      <Link href={routes.brand.analytics} className="brand-glass brand-interactive group block rounded-[28px] p-5">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div><div className="flex items-center gap-2 text-sm font-bold text-emerald-700"><BarChart3 className="h-4 w-4" />Аналитика за неделю</div><h2 className="mt-2 text-2xl font-black text-emerald-950">Челленджи увеличили визиты на {companyAnalytics.visitsGrowthPercent}%</h2></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/80 bg-white/65 px-4 py-3 shadow-sm"><Repeat2 className="h-4 w-4 text-emerald-600"/><div className="mt-2 text-xl font-extrabold">{companyAnalytics.repeatVisitsPercent}%</div><div className="text-xs text-slate-500">повторных визитов</div></div>
            <div className="rounded-2xl border border-white/80 bg-white/65 px-4 py-3 shadow-sm"><Gift className="h-4 w-4 text-emerald-600"/><div className="mt-2 text-xl font-extrabold">{companyAnalytics.issuedRewards}</div><div className="text-xs text-slate-500">наград выдано</div></div>
            <div className="hidden rounded-2xl border border-white/80 bg-white/65 px-4 py-3 shadow-sm sm:block"><TrendingUp className="h-4 w-4 text-emerald-600"/><div className="mt-2 text-xl font-extrabold">{companyAnalytics.rewardConversionPercent}%</div><div className="text-xs text-slate-500">конверсия</div></div>
          </div>
          <div className="inline-flex items-center gap-2 font-black text-emerald-900">Подробнее <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></div>
        </div>
      </Link>

      <Card className="p-5">
        <SectionTitle
          actionHref={routes.brand.challenges}
          actionLabel="Все челленджи"
          title="Запущенные механики"
          titleClassName="text-2xl"
        />
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {brandChallenges.filter((challenge) => challenge.isActive).map((challenge) => (
            <div key={challenge.id} className="brand-interactive rounded-[24px] border border-white/80 bg-white/55 p-4 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black">{challenge.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {challenge.condition}
                  </p>
                </div>
                <Badge className="bg-white text-slate-600">
                  {challenge.daysLeft} дн.
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
