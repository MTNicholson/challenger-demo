import Link from "next/link";
import { BarChart3, CheckCircle2, Gift, QrCode, RotateCcw, UserRound } from "lucide-react";
import { scannerMockResult } from "@/data/scanner";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { buttonClasses } from "@/components/ui/button";

export default function ScanResultPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6">
      <section className="rounded-[34px] bg-white p-6 text-center shadow-sm">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100"><CheckCircle2 className="h-10 w-10 text-emerald-700" /></div>
        <Badge variant="success" className="mt-5">QR действителен · награда выдана</Badge>
        <h1 className="mt-3 text-3xl font-black">Успешная активация</h1>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">Награда подтверждена для гостя {scannerMockResult.userName}. Операция добавлена в моковую аналитику Coffee Place.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[28px] bg-white p-5 shadow-sm"><UserRound className="h-6 w-6 text-slate-500" /><div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Гость</div><div className="mt-1 text-xl font-black">{scannerMockResult.userName}</div><div className="text-sm text-slate-500">{scannerMockResult.userLabel}</div></div>
        <div className="rounded-[28px] bg-white p-5 shadow-sm"><Gift className="h-6 w-6 text-emerald-600" /><div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Награда</div><div className="mt-1 text-xl font-black">{scannerMockResult.rewardTitle}</div><div className="text-sm text-slate-500">{scannerMockResult.rewardBrand}</div></div>
        <div className="rounded-[28px] bg-white p-5 shadow-sm"><QrCode className="h-6 w-6 text-slate-500" /><div className="mt-4 text-xs font-bold uppercase tracking-wider text-slate-400">Код</div><div className="mt-1 text-xl font-black tracking-[0.14em]">{scannerMockResult.rewardCode}</div><div className="text-sm text-slate-500">{scannerMockResult.scannedAt}</div></div>
        <div className="rounded-[28px] bg-slate-950 p-5 text-white shadow-sm"><CheckCircle2 className="h-6 w-6 text-emerald-300" /><div className="mt-4 text-xs font-bold uppercase tracking-wider text-white/40">Статус</div><div className="mt-1 text-xl font-black">Успешно</div><div className="text-sm text-white/50">Можно обслужить следующего гостя</div></div>
      </section>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href={routes.brand.scanner} className={buttonClasses({ variant: "dark" })}><RotateCcw className="h-4 w-4" />Сканировать ещё</Link>
        <Link href={routes.brand.rewards} className={buttonClasses({ variant: "secondary" })}><Gift className="h-4 w-4" />К наградам</Link>
        <Link href={routes.brand.analytics} className={buttonClasses({ variant: "ghost" })}><BarChart3 className="h-4 w-4" />К аналитике</Link>
      </div>
    </main>
  );
}
