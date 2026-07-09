"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BarChart3, Eye, PlusCircle, Settings2 } from "lucide-react";
import type { Challenge } from "@/data/challenges";
import { companyAnalytics } from "@/data/analytics";
import { routes } from "@/lib/routes";
import {
  readBrandChallengeDrafts,
  type BrandChallengeDraft,
} from "@/lib/brand-challenge-drafts";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BrandPageHeader } from "@/components/brand/brand-page-header";
import { buttonClasses } from "@/components/ui/button";

export function BrandChallengesClient({
  brandName,
  challenges,
}: {
  brandName: string;
  challenges: Challenge[];
}) {
  const [drafts, setDrafts] = useState<BrandChallengeDraft[]>([]);

  useEffect(() => {
    function syncDrafts() {
      setDrafts(readBrandChallengeDrafts());
    }

    syncDrafts();
    window.addEventListener("storage", syncDrafts);
    window.addEventListener("challenger_brand_challenges_changed", syncDrafts);

    return () => {
      window.removeEventListener("storage", syncDrafts);
      window.removeEventListener("challenger_brand_challenges_changed", syncDrafts);
    };
  }, []);

  return (
    <main className="space-y-6">
      <BrandPageHeader
        actionHref={routes.brand.newChallenge}
        actionIcon={PlusCircle}
        actionLabel="Создать челлендж"
        description={`Управляйте кампаниями ${brandName}: настраивайте механику, проверяйте вид для гостя и следите за результатами.`}
        eyebrow="Механики"
        title="Челленджи бренда"
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {drafts.map((draft) => (
          <Card key={draft.id} className="brand-interactive p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-2xl shadow-sm">
                ✦
              </div>
              <Badge variant="neutral" className="text-slate-500">
                Черновик
              </Badge>
            </div>
            <h2 className="mt-5 text-xl font-black">{draft.title || "Новый челлендж"}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{draft.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-2xl border border-white/80 bg-white/55 p-3">
                <div className="font-black">0</div>
                <div className="text-xs text-slate-400">участников</div>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/55 p-3">
                <div className="font-black">{draft.selectedLocationIds.length}</div>
                <div className="text-xs text-slate-400">точек</div>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/55 p-3">
                <div className="font-black">{draft.reward.points}</div>
                <div className="text-xs text-slate-400">баллов</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <Link href={`${routes.brand.newChallenge}?draftId=${encodeURIComponent(draft.id)}`} className={buttonClasses({ variant: "ghost", size: "sm" })}>
                <Settings2 className="h-4 w-4" /> Настроить
              </Link>
              <Link href={routes.brand.preview} className={buttonClasses({ variant: "secondary", size: "sm" })}>
                <Eye className="h-4 w-4" /> Превью гостя
              </Link>
            </div>
          </Card>
        ))}

        {challenges.map((challenge) => (
          <Card key={challenge.id} className="brand-interactive p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-2xl shadow-sm">
                {challenge.emoji}
              </div>
              <Badge
                variant={challenge.isActive ? "success" : "neutral"}
                className={!challenge.isActive ? "text-slate-500" : undefined}
              >
                {challenge.isActive ? "Активен" : "Черновик"}
              </Badge>
            </div>
            <h2 className="mt-5 text-xl font-black">{challenge.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{challenge.description}</p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-2xl border border-white/80 bg-white/55 p-3">
                <div className="font-black">{challenge.participants}</div>
                <div className="text-xs text-slate-400">участников</div>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/55 p-3">
                <div className="font-black">{challenge.isActive ? Math.round(challenge.participants * 0.27) : 0}</div>
                <div className="text-xs text-slate-400">активаций</div>
              </div>
              <div className="rounded-2xl border border-white/80 bg-white/55 p-3">
                <div className="font-black">{challenge.daysLeft}</div>
                <div className="text-xs text-slate-400">дней</div>
              </div>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
              <Link href={routes.brand.newChallenge} className={buttonClasses({ variant: "ghost", size: "sm" })}>
                <Settings2 className="h-4 w-4" /> Настроить
              </Link>
              <Link href={routes.brand.preview} className={buttonClasses({ variant: "secondary", size: "sm" })}>
                <Eye className="h-4 w-4" /> Превью гостя
              </Link>
              <Link href={routes.brand.analytics} className={buttonClasses({ variant: "dark", size: "sm" })}>
                <BarChart3 className="h-4 w-4" /> Аналитика
              </Link>
            </div>
          </Card>
        ))}
      </section>

      <p className="text-xs text-slate-400">
        Всего активаций наград {brandName}: {companyAnalytics.rewardActivations.toLocaleString("ru-RU")}
      </p>
    </main>
  );
}
