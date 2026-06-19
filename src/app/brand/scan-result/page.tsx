import Link from "next/link";
import { BarChart3, CheckCircle2, Clock3, Gift, PackageCheck, QrCode, RotateCcw, Target, UserRound } from "lucide-react";
import { scannerMockResult } from "@/data/scanner";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";

export default function ScanResultPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-[34px] bg-slate-950 p-7 text-center text-white shadow-xl shadow-slate-900/10"><div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-400"><CheckCircle2 className="h-10 w-10 text-slate-950" /></div><Badge variant="success" className="mt-5">Активация прошла успешно</Badge><h1 className="mt-3 text-3xl font-black">Награда подтверждена</h1><p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-white/60">Выдайте гостю награду и нажмите готово</p></section>

      <section className="grid gap-4 md:grid-cols-[1.35fr_1fr]">
        <div className="rounded-[28px] bg-white p-6 shadow-sm"><h2 className="text-xl font-black">Детали активации</h2><dl className="mt-5 grid gap-3 sm:grid-cols-2"><Detail icon={UserRound} label="Гость" value={scannerMockResult.userName} /><Detail icon={Gift} label="Награда" value={scannerMockResult.rewardTitle} /><Detail icon={Target} label="Источник" value={scannerMockResult.challengeTitle} /><Detail icon={QrCode} label="Код" value={scannerMockResult.rewardCode} /><Detail icon={Gift} label="Бренд" value={scannerMockResult.rewardBrand} /><Detail icon={Clock3} label="Время" value={scannerMockResult.scannedAt} /></dl></div>
        <div className="rounded-[28px] bg-emerald-50 p-6"><div className="flex items-center gap-3"><PackageCheck className="h-6 w-6 text-emerald-700" /><h2 className="text-xl font-black text-emerald-950">Итог операции</h2></div><div className="mt-5 text-4xl font-black text-emerald-950">+1</div><div className="text-sm font-bold text-emerald-800">активация награды</div><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between border-t border-emerald-200 pt-3"><span className="text-emerald-800">Остаток</span><strong>{scannerMockResult.stockBefore} → {scannerMockResult.stockAfter}</strong></div><div className="flex justify-between border-t border-emerald-200 pt-3"><span className="text-emerald-800">Аналитика</span><strong>обновлена</strong></div></div></div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center"><Link href={routes.brand.scanner} className={buttonClasses({ variant: "dark" })}><RotateCcw className="h-4 w-4" />Сканировать ещё</Link><Link href={routes.brand.rewards} className={buttonClasses({ variant: "secondary" })}><Gift className="h-4 w-4" />К наградам</Link><Link href={routes.brand.analytics} className={buttonClasses({ variant: "ghost" })}><BarChart3 className="h-4 w-4" />К аналитике</Link></div>
    </main>
  );
}

function Detail({ icon: Icon, label, value }: { icon: typeof Gift; label: string; value: string }) {
  return <div className="rounded-2xl bg-slate-50 p-4"><Icon className="h-5 w-5 text-emerald-600" /><dt className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">{label}</dt><dd className="mt-1 font-black text-slate-900">{value}</dd></div>;
}
