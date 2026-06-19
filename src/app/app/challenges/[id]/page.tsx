import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Coins, Gift, MapPin } from "lucide-react";
import { challenges } from "@/data/challenges";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return challenges.map((challenge) => ({
    id: challenge.id,
  }));
}

export default async function ChallengeDetailPage({
  params,
}: PageProps<"/app/challenges/[id]">) {
  const { id } = await params;
  const challenge = challenges.find((item) => item.id === id);

  if (!challenge) {
    notFound();
  }

  return (
    <main className="space-y-5">
      <section className="rounded-[34px] bg-white p-5 shadow-sm">
        <div className="text-sm font-semibold text-slate-400">
          {challenge.brandName}
        </div>
        <h1 className="mt-2 text-3xl font-black">{challenge.title}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          {challenge.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-2 text-slate-600">
            <MapPin className="h-3.5 w-3.5" />
            {challenge.distanceKm ?? 0} км
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">
            <Coins className="h-3.5 w-3.5" />+{challenge.coinsReward}
          </span>
        </div>
      </section>

      <section className="rounded-[30px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
        <div className="flex items-center gap-3">
          <Gift className="h-6 w-6 text-emerald-300" />
          <h2 className="text-xl font-black">Награда</h2>
        </div>
        <p className="mt-3 text-sm leading-6 text-white/70">
          {challenge.reward}. Условие: {challenge.condition}.
        </p>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Как выполнить</h2>
        <div className="mt-4 space-y-3">
          {["Принять челлендж", "Выполнить условие", "Показать QR на кассе"].map(
            (step) => (
              <div key={step} className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                <span className="text-sm font-semibold text-slate-700">
                  {step}
                </span>
              </div>
            ),
          )}
        </div>
      </section>

      <Link
        href={routes.user.activeChallenge}
        className="block rounded-[24px] bg-slate-950 px-5 py-4 text-center text-base font-black text-white shadow-xl shadow-slate-900/15"
      >
        Принять челлендж
      </Link>
    </main>
  );
}
