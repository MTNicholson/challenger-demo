import Link from "next/link";
import { CheckCircle2, QrCode } from "lucide-react";
import { challenges } from "@/data/challenges";
import { routes } from "@/lib/routes";

export default function ActiveChallengePage() {
  const challenge = challenges[0];

  return (
    <main className="space-y-5">
      <section className="rounded-[34px] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/15">
        <div className="text-sm text-white/60">Активный челлендж</div>
        <h1 className="mt-2 text-3xl font-black">{challenge.title}</h1>
        <p className="mt-3 text-sm leading-6 text-white/70">
          {challenge.description}
        </p>
        <div className="mt-5 h-3 rounded-full bg-white/15">
          <div className="h-3 w-3/5 rounded-full bg-emerald-300" />
        </div>
        <div className="mt-3 text-sm font-semibold text-white/70">
          {challenge.progress?.label}
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Что осталось</h2>
        <div className="mt-4 space-y-3">
          {["Купить напиток сегодня", "Отсканировать QR на кассе"].map(
            (step, index) => (
              <div key={step} className="flex items-center gap-3">
                <CheckCircle2
                  className={
                    index === 0
                      ? "h-5 w-5 text-emerald-500"
                      : "h-5 w-5 text-slate-300"
                  }
                />
                <span className="text-sm font-semibold text-slate-700">
                  {step}
                </span>
              </div>
            ),
          )}
        </div>
      </section>

      <Link
        href={routes.user.reward}
        className="flex items-center justify-center gap-2 rounded-[24px] bg-emerald-500 px-5 py-4 text-base font-black text-white shadow-xl shadow-emerald-500/20"
      >
        <QrCode className="h-5 w-5" />
        Показать QR для визита
      </Link>
    </main>
  );
}
