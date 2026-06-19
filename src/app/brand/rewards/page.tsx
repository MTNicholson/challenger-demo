import { Gift, QrCode, ShieldCheck } from "lucide-react";
import { rewards } from "@/data/rewards";

export default function BrandRewardsPage() {
  return (
    <main className="space-y-6">
      <section>
        <div className="text-sm font-semibold text-slate-400">Награды</div>
        <h1 className="mt-1 text-3xl font-black">Выдача и правила</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Пример того, как команда видит доступные награды и условия выдачи.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {rewards.map((reward) => (
          <div key={reward.id} className="rounded-[30px] bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50">
                <Gift className="h-5 w-5 text-emerald-700" />
              </div>
              <span className="rounded-full bg-slate-50 px-3 py-1 text-xs font-black text-slate-500">
                {reward.expiresAt}
              </span>
            </div>
            <h2 className="mt-5 text-xl font-black">{reward.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {reward.description}
            </p>
            <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
              <span className="font-black tracking-[0.14em]">{reward.code}</span>
              <QrCode className="h-5 w-5 text-slate-500" />
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-[30px] bg-emerald-50 p-5 text-emerald-950 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6" />
          <h2 className="text-xl font-black">Контроль демо</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-emerald-800/80">
          В реальном продукте здесь будут лимиты, остатки и роли сотрудников.
        </p>
      </section>
    </main>
  );
}
