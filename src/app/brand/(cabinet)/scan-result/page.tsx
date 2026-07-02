import Link from "next/link";
import { BarChart3, CheckCircle2, Clock3, Gift, PackageCheck, QrCode, RotateCcw, Target, UserRound } from "lucide-react";
import { scannerMockResult } from "@/data/scanner";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";

export default function ScanResultPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <section className="brand-glass-dark relative overflow-hidden rounded-[34px] p-7 text-center text-white">
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_center,rgba(52,211,153,.2),transparent_70%)]" />
        <div className="relative mx-auto grid h-20 w-20 place-items-center rounded-full border border-white/20 bg-emerald-400 shadow-[0_0_0_12px_rgba(52,211,153,.1)]"><CheckCircle2 className="h-10 w-10 text-slate-950" /></div>
        <Badge variant="success" className="relative mt-6">Активация прошла успешно</Badge>
        <h1 className="relative mt-3 text-3xl font-extrabold">Награда подтверждена</h1>
        <p className="relative mx-auto mt-2 max-w-xl text-sm leading-6 text-white/60">Выдайте гостю награду — активация уже отмечена в демо</p>
      </section>

      <section className="grid gap-4 md:grid-cols-[1.35fr_1fr]">
        <div className="brand-glass rounded-[28px] p-6">
          <h2 className="text-xl font-extrabold">Детали активации</h2>
          <dl className="mt-5 grid gap-3 sm:grid-cols-2">
            <Detail icon={UserRound} label="Гость" value={scannerMockResult.userName} />
            <Detail icon={Gift} label="Награда" value={scannerMockResult.rewardTitle} />
            <Detail icon={Target} label="Источник" value={scannerMockResult.challengeTitle} />
            <Detail icon={QrCode} label="Код" value={scannerMockResult.rewardCode} />
            <Detail icon={Gift} label="Бренд" value={scannerMockResult.rewardBrand} />
            <Detail icon={Clock3} label="Время" value={scannerMockResult.scannedAt} />
          </dl>
        </div>
        <div className="brand-selected rounded-[28px] border p-6">
          <div className="flex items-center gap-3"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"><PackageCheck className="h-6 w-6" /></span><h2 className="text-xl font-extrabold text-emerald-950">Итог операции</h2></div>
          <div className="mt-6 text-5xl font-extrabold tracking-tight text-emerald-950">+1</div><div className="text-sm font-bold text-emerald-800">активация награды</div>
          <div className="mt-6 space-y-3 text-sm"><div className="flex justify-between border-t border-emerald-200 pt-3"><span className="text-emerald-800">Остаток</span><strong>{scannerMockResult.stockBefore} → {scannerMockResult.stockAfter}</strong></div><div className="flex justify-between border-t border-emerald-200 pt-3"><span className="text-emerald-800">Аналитика</span><strong>обновлена</strong></div></div>
        </div>
      </section>

      <div className="brand-glass flex flex-col gap-3 rounded-[26px] p-4 sm:flex-row sm:justify-center"><Link href={routes.brand.scanner} className={buttonClasses({ variant: "dark" })}><RotateCcw className="h-4 w-4" />Сканировать ещё</Link><Link href={routes.brand.rewards} className={buttonClasses({ variant: "secondary" })}><Gift className="h-4 w-4" />К наградам</Link><Link href={routes.brand.analytics} className={buttonClasses({ variant: "ghost" })}><BarChart3 className="h-4 w-4" />К аналитике</Link></div>
    </main>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Gift; label: string; value: string }) {
  return <div className="rounded-2xl border border-white/80 bg-white/55 p-4 shadow-sm"><Icon className="h-5 w-5 text-emerald-600" /><dt className="mt-3 text-xs font-extrabold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 font-extrabold text-slate-900">{value}</dd></div>;
}
