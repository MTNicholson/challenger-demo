import Link from "next/link";
import { BarChart3, Boxes, QrCode, ScanLine, Target } from "lucide-react";
import { coffeePlaceRewards, type BrandReward } from "@/data/rewards";
import { routes } from "@/lib/routes";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BrandPageHeader } from "@/components/brand/brand-page-header";
import { buttonClasses } from "@/components/ui/button";

const statusMeta: Record<BrandReward["status"], { label: string; variant: BadgeVariant }> = {
  active: { label: "Активна", variant: "success" },
  draft: { label: "Черновик", variant: "neutral" },
  paused: { label: "На паузе", variant: "warning" },
};
const typeLabels: Record<BrandReward["rewardType"], string> = {
  drink: "Напиток",
  discount: "Скидка",
  bonus: "Бонусные монеты",
};

export default function BrandRewardsPage() {
  return (
    <main className="space-y-6">
      <BrandPageHeader eyebrow="Coffee Place · награды" title="Управление наградами" description="Следите за статусами, активациями и остатками наград в активных челленджах." />

      <div className="flex flex-wrap gap-3">
        <Link href={routes.brand.scanner} className={buttonClasses({ variant: "dark" })}><ScanLine className="h-4 w-4" />Открыть сканер</Link>
        <Link href={routes.brand.analytics} className={buttonClasses({ variant: "secondary" })}><BarChart3 className="h-4 w-4" />Аналитика</Link>
      </div>

      <section className="grid gap-4" aria-label="Награды Coffee Place">
        {coffeePlaceRewards.map((reward) => {
          const status = statusMeta[reward.status];
          return (
            <Card key={reward.id} className={reward.qrEnabled ? "brand-interactive overflow-hidden border-emerald-200 p-0 ring-2 ring-emerald-100/70" : "brand-interactive p-0"}>
              {reward.qrEnabled && <div className="bg-emerald-500 px-5 py-2 text-xs font-black uppercase tracking-wider text-white">Основная награда QR-потока</div>}
              <div className="grid gap-6 p-5 xl:grid-cols-[1.25fr_1fr_auto] xl:items-center">
                <div className="flex items-start gap-4">
                  <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-2xl font-black text-emerald-700">{reward.emoji}</div>
                  <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-xl font-black">{reward.title}</h2><Badge variant={status.variant}>{status.label}</Badge><Badge>{typeLabels[reward.rewardType]}</Badge></div><p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">{reward.description}</p><div className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-slate-600"><Target className="h-4 w-4 text-emerald-600" />{reward.challengeTitle}</div></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-4"><div className="text-2xl font-black">{reward.activations}</div><div className="mt-1 text-xs text-slate-400">активаций</div></div>
                  <div className="rounded-2xl bg-slate-50 p-4"><div className="flex items-center gap-2 font-black"><Boxes className="h-4 w-4 text-slate-400" />{reward.stockLabel}</div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-200"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${reward.stockPercent}%` }} /></div><div className="mt-1 text-xs text-slate-400">остаток / бюджет</div></div>
                </div>
                {reward.qrEnabled ? <Link href={routes.brand.scanner} className={buttonClasses({ variant: "primary" })}><QrCode className="h-4 w-4" />Сканировать</Link> : <Badge variant={status.variant}>Настройка недоступна в демо</Badge>}
              </div>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
