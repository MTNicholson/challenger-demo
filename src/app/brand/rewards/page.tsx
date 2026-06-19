import Link from "next/link";
import { BarChart3, Boxes, Gift, QrCode, ScanLine, TrendingUp } from "lucide-react";
import { companyBrand } from "@/data/brands";
import { rewards } from "@/data/rewards";
import { rewardAnalytics } from "@/data/analytics";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BrandPageHeader } from "@/components/brand/brand-page-header";
import { buttonClasses } from "@/components/ui/button";

const brandRewards = rewards.filter((reward) => reward.brandId === companyBrand.id);
const rewardStats: Record<string, { activations: number; stock: string }> = {
  "coffee-raf": { activations: 342, stock: "158 из 500" },
};

export default function BrandRewardsPage() {
  return (
    <main className="space-y-6">
      <BrandPageHeader eyebrow="Награды Coffee Place" title="Выдача и остатки" description="Награды связаны с текущими кампаниями: отслеживайте активации и переходите к проверке QR." />
      <Link href={routes.brand.analytics} className="group block rounded-[30px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr_auto] sm:items-center">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-400 text-slate-950"><Gift className="h-6 w-6"/></div>
          <div><div className="flex flex-wrap items-center gap-3"><h2 className="text-xl font-black">{rewardAnalytics.activations} активации наград</h2><span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300"><TrendingUp className="h-3.5 w-3.5"/>+{rewardAnalytics.activationGrowthPercent}%</span></div><p className="mt-1 text-sm text-white/55">Чаще всего используют: {rewardAnalytics.mostUsedReward}</p></div>
          <div className="inline-flex items-center gap-2 text-sm font-black">Открыть аналитику <BarChart3 className="h-4 w-4"/></div>
        </div>
      </Link>
      <section className="grid gap-4">
        {brandRewards.map((reward) => {
          const stats = rewardStats[reward.id] ?? { activations: 0, stock: "—" };
          return (
            <Card key={reward.id} className="p-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
                <div className="flex items-start gap-4"><div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-2xl">{reward.emoji}</div><div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-black">{reward.title}</h2><Badge variant="success">Доступна</Badge></div><p className="mt-2 text-sm text-slate-500">{reward.description}</p><div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm font-black tracking-wider"><QrCode className="h-4 w-4" />{reward.code}</div></div></div>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="min-w-32 rounded-2xl bg-slate-50 p-4"><div className="text-xl font-black">{stats.activations}</div><div className="mt-1 text-xs text-slate-400">активации</div></div>
                  <div className="min-w-32 rounded-2xl bg-slate-50 p-4"><Boxes className="mx-auto h-5 w-5 text-slate-400" /><div className="mt-2 font-black">{stats.stock}</div><div className="mt-1 text-xs text-slate-400">остаток</div></div>
                </div>
              </div>
            </Card>
          );
        })}
      </section>
      <div className="flex flex-wrap gap-3">
        <Link href={routes.brand.scanner} className={buttonClasses({ variant: "dark" })}><ScanLine className="h-4 w-4" />Открыть сканер</Link>
        <Link href={routes.brand.analytics} className={buttonClasses({ variant: "ghost" })}><BarChart3 className="h-4 w-4" />К аналитике</Link>
      </div>
    </main>
  );
}
