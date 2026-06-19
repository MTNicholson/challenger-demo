import { QrCode, ShieldCheck } from "lucide-react";
import { rewards } from "@/data/rewards";

export default function UserRewardPage() {
  const reward = rewards[0];

  return (
    <main className="space-y-5">
      <section className="rounded-[34px] bg-white p-5 text-center shadow-sm">
        <div className="mx-auto grid h-56 w-56 place-items-center rounded-[34px] border-8 border-slate-100 bg-white shadow-inner">
          <QrCode className="h-32 w-32 text-slate-950" />
        </div>
        <h1 className="mt-6 text-3xl font-black">{reward.title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          {reward.description}
        </p>
        <div className="mt-5 rounded-2xl bg-slate-50 px-4 py-3 text-2xl font-black tracking-[0.18em]">
          {reward.code}
        </div>
      </section>

      <section className="rounded-[30px] bg-emerald-50 p-5 text-emerald-950 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6" />
          <h2 className="text-xl font-black">Для сотрудника</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-emerald-800/80">
          Отсканируйте код или проверьте короткий код вручную. Действует до:
          {" "}
          {reward.expiresAt}.
        </p>
      </section>
    </main>
  );
}
