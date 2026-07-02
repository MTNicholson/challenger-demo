import Link from "next/link";
import { AlertCircle, Gift, Keyboard, QrCode, ScanLine, UserRound } from "lucide-react";
import { scannerErrorStates, scannerMockResult } from "@/data/scanner";
import { getCurrentBrand } from "@/lib/auth-server";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function StaffScannerPage() {
  const session = await getCurrentBrand();
  const brandName = session?.brand.name ?? "Бренд";

  return (
    <main className="space-y-6">
      <header><div className="text-sm font-bold text-emerald-700">{brandName} · режим сотрудника</div><h1 className="mt-1 text-3xl font-black tracking-tight">Сканер наград</h1><p className="mt-2 text-slate-500">Отсканируйте QR-код гостя или введите код вручную</p></header>
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section className="brand-glass-dark rounded-[32px] p-6 text-white">
          <div className="grid min-h-[360px] place-items-center rounded-[30px] border border-white/15 bg-white/[0.07] shadow-inner">
            <div className="text-center"><div className="relative mx-auto grid h-60 w-60 place-items-center rounded-[34px] border-2 border-dashed border-white/30"><span className="absolute left-4 top-4 h-8 w-8 border-l-4 border-t-4 border-emerald-300" /><span className="absolute bottom-4 right-4 h-8 w-8 border-b-4 border-r-4 border-emerald-300" /><QrCode className="h-28 w-28 text-white/75" /><div className="absolute left-7 right-7 top-1/2 h-0.5 bg-emerald-300 shadow-lg shadow-emerald-300" /></div><p className="mt-5 text-sm text-white/50">Наведите рамку на QR-код · камера в демо не используется</p></div>
          </div>
          <div className="mt-5 rounded-2xl bg-white/10 p-4"><label htmlFor="reward-code" className="flex items-center gap-2 text-sm font-bold text-white/70"><Keyboard className="h-4 w-4" />Код награды</label><input id="reward-code" defaultValue={scannerMockResult.rewardCode} placeholder="Например, CP-4829" className="mt-3 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-black tracking-[0.16em] text-slate-950 outline-none focus:ring-2 focus:ring-emerald-400" /></div>
          <div className="mt-6 grid gap-3 sm:grid-cols-2"><Link href={routes.brand.scanResult} className={buttonClasses({ variant: "primary", size: "lg" })}><ScanLine className="h-5 w-5" />Проверить QR</Link><Link href={routes.brand.rewards} className={buttonClasses({ variant: "secondary", size: "lg" })}><Gift className="h-5 w-5" />К наградам</Link></div>
        </section>
        <aside className="brand-glass self-start rounded-[32px] p-6 lg:sticky lg:top-28">
          <div className="flex items-center justify-between gap-3"><h2 className="text-xl font-black">Выбранная награда</h2><Badge variant="success">Готова</Badge></div>
          <div className="mt-6 flex items-center gap-4"><div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50"><Gift className="h-6 w-6 text-emerald-700" /></div><div><h3 className="font-black">{scannerMockResult.rewardTitle}</h3><p className="text-sm text-slate-500">{scannerMockResult.rewardBrand}</p></div></div>
          <dl className="mt-6 space-y-3 text-sm"><div className="flex justify-between gap-4 rounded-2xl bg-slate-50 p-3"><dt className="flex items-center gap-2 text-slate-500"><UserRound className="h-4 w-4" />Гость</dt><dd className="font-black">{scannerMockResult.userName}</dd></div><div className="flex justify-between gap-4 rounded-2xl bg-slate-50 p-3"><dt className="text-slate-500">Код</dt><dd className="font-black tracking-wider">{scannerMockResult.rewardCode}</dd></div><div className="flex justify-between gap-4 rounded-2xl bg-amber-50 p-3"><dt className="text-amber-800">Действует</dt><dd className="font-black text-amber-900">до {scannerMockResult.expiresAt.split(", ")[1]}</dd></div></dl>
          <div className="mt-6 border-t border-slate-100 pt-5"><div className="flex items-center gap-2 text-sm font-black"><AlertCircle className="h-4 w-4 text-slate-400" />Возможные ответы</div><div className="mt-3 space-y-2">{scannerErrorStates.map((state) => <div key={state.title} title={state.description} className="rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500"><span className="font-bold text-slate-700">{state.title}</span> · покажем подсказку сотруднику</div>)}</div></div>
        </aside>
      </div>
    </main>
  );
}
