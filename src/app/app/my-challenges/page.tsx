import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { getActiveChallenges } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { formatCoins } from "@/lib/format";
import { ProgressBar } from "@/components/ui/progress-bar";

export default function MyChallengesPage() {
  const activeChallenges = getActiveChallenges();
  return (
    <main className="space-y-5">
      <header className="flex items-center gap-3">
        <Link href={routes.user.home} className="grid h-10 w-10 place-items-center rounded-2xl border border-white/80 bg-white/65 text-slate-600 shadow-sm backdrop-blur-xl" aria-label="Назад"><ArrowLeft size={18} /></Link>
        <div><p className="text-[10px] font-extrabold uppercase tracking-[.12em] text-indigo-500">Ваш прогресс</p><h1 className="text-[28px] font-extrabold tracking-[-.04em]">Активные челленджи</h1></div>
      </header>
      <section className="space-y-3">
        {activeChallenges.map((challenge) => {
          const progress = challenge.progress ?? { current: 0, total: 1, label: "Можно начать" };
          const href = challenge.id === "coffee-route" ? routes.user.activeChallenge : routes.user.challengeDetail(challenge.id);
          return (
            <Link key={challenge.id} href={href} className="grid grid-cols-[58px_1fr_auto] items-center gap-3 rounded-[26px] border border-white/80 bg-white/65 p-3 shadow-[0_14px_34px_rgba(61,73,115,.09),inset_0_1px_0_white] backdrop-blur-xl">
              <span className="grid h-[58px] w-[58px] place-items-center rounded-[20px] bg-gradient-to-br from-amber-100 to-indigo-100 text-3xl">{challenge.emoji}</span>
              <div className="min-w-0"><p className="truncate text-[13px] font-extrabold">{challenge.title}</p><p className="mt-1 truncate text-[10px] font-semibold text-slate-400">{challenge.brandName} · {progress.label}</p><ProgressBar value={progress.current} max={progress.total} className="mt-2 h-1.5 bg-slate-200/70" indicatorClassName="bg-gradient-to-r from-emerald-400 to-indigo-500" /><p className="mt-2 text-[9px] font-extrabold text-amber-700">+{formatCoins(challenge.coinsReward)}</p></div>
              <ChevronRight size={17} className="text-slate-400" />
            </Link>
          );
        })}
      </section>
    </main>
  );
}
