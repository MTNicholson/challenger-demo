import { CheckCircle2, Gift, UserRound } from "lucide-react";
import { scannerMockResult } from "@/data/scanner";

export default function ScanResultPage() {
  return (
    <main className="mx-auto max-w-2xl space-y-6">
      <section className="rounded-[34px] bg-white p-6 text-center shadow-sm">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-10 w-10 text-emerald-700" />
        </div>
        <h1 className="mt-5 text-3xl font-black">Награда подтверждена</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          QR-код валиден. Можно выдать гостю обещанный бонус по коду{" "}
          {scannerMockResult.rewardCode}.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <UserRound className="h-6 w-6 text-slate-500" />
          <div className="mt-4 text-xl font-black">
            {scannerMockResult.userName}
          </div>
          <div className="text-sm text-slate-500">
            {scannerMockResult.userLabel}
          </div>
        </div>
        <div className="rounded-[28px] bg-white p-5 shadow-sm">
          <Gift className="h-6 w-6 text-emerald-600" />
          <div className="mt-4 text-xl font-black">
            {scannerMockResult.rewardTitle}
          </div>
          <div className="text-sm text-slate-500">
            Награда {scannerMockResult.rewardBrand}
          </div>
        </div>
      </section>

      <button className="w-full rounded-full bg-slate-950 px-5 py-4 text-sm font-black text-white shadow-xl shadow-slate-900/15">
        Завершить выдачу
      </button>
    </main>
  );
}
