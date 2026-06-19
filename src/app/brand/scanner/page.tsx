import Link from "next/link";
import { Camera, Gift, Keyboard, QrCode, ScanLine } from "lucide-react";
import { companyBrand } from "@/data/brands";
import { scannerMockResult } from "@/data/scanner";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function StaffScannerPage() {
  return (
    <main className="grid gap-6 lg:grid-cols-[1fr_380px]">
      <section className="rounded-[32px] bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/10">
        <div className="flex items-center justify-between gap-4"><div><div className="text-sm text-white/60">{companyBrand.name} · режим сотрудника</div><h1 className="mt-1 text-3xl font-black">Проверка QR-награды</h1></div><Camera className="h-7 w-7 text-white/60" /></div>
        <div className="mt-8 grid min-h-[390px] place-items-center rounded-[32px] border border-white/10 bg-white/5">
          <div className="text-center"><div className="relative mx-auto grid h-60 w-60 place-items-center rounded-[34px] border-2 border-dashed border-white/30"><QrCode className="h-28 w-28 text-white/75" /><div className="absolute left-6 right-6 top-1/2 h-0.5 bg-emerald-300 shadow-lg shadow-emerald-300" /></div><p className="mt-5 text-sm text-white/50">Демо-зона сканирования · камера не используется</p></div>
        </div>
        <div className="mt-5 rounded-2xl bg-white/10 p-4">
          <label htmlFor="reward-code" className="flex items-center gap-2 text-sm font-bold text-white/70"><Keyboard className="h-4 w-4" />Или введите код вручную</label>
          <input id="reward-code" defaultValue={scannerMockResult.rewardCode} className="mt-3 w-full rounded-2xl border border-white/10 bg-white px-4 py-3 font-black tracking-[0.16em] text-slate-950 outline-none" />
        </div>
        <Link href={routes.brand.scanResult} className={buttonClasses({ variant: "secondary", size: "lg", className: "mt-6 w-full" })}><ScanLine className="h-5 w-5" />Проверить QR</Link>
      </section>

      <aside className="self-start rounded-[32px] bg-white p-6 shadow-sm lg:sticky lg:top-28">
        <div className="flex items-center justify-between"><h2 className="text-2xl font-black">Выбранная награда</h2><Badge variant="success">Готова к проверке</Badge></div>
        <div className="mt-6 grid h-16 w-16 place-items-center rounded-3xl bg-emerald-50"><Gift className="h-7 w-7 text-emerald-700" /></div>
        <h3 className="mt-4 text-xl font-black">{scannerMockResult.rewardTitle}</h3>
        <p className="mt-1 text-sm text-slate-500">{scannerMockResult.rewardBrand} · {scannerMockResult.challengeTitle}</p>
        <dl className="mt-6 space-y-3 text-sm"><div className="flex justify-between gap-4 rounded-2xl bg-slate-50 p-3"><dt className="text-slate-500">Код</dt><dd className="font-black">{scannerMockResult.rewardCode}</dd></div><div className="flex justify-between gap-4 rounded-2xl bg-slate-50 p-3"><dt className="text-slate-500">Точка</dt><dd className="text-right font-bold">{scannerMockResult.location}</dd></div></dl>
      </aside>
    </main>
  );
}
