import Link from "next/link";
import { BarChart3, Eye, Gift, PlusCircle, QrCode, Target, Users } from "lucide-react";
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
        description="Демо-кабинет показывает, как бренд управляет челленджами, вовлечением гостей и наградами без лишней сложности."
        title="Обзор бренда"
        variant="dark"
      />

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

      <Card className="p-5">
        <SectionTitle
          actionHref={routes.brand.challenges}
          actionLabel="Все челленджи"
          title="Запущенные механики"
          titleClassName="text-2xl"
        />
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {brandChallenges.filter((challenge) => challenge.isActive).map((challenge) => (
            <div key={challenge.id} className="rounded-[24px] bg-slate-50 p-4">
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
