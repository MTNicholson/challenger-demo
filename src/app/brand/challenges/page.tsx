import { PlusCircle, Target } from "lucide-react";
import { challenges } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { BrandPageHeader } from "@/components/brand/brand-page-header";

export default function BrandChallengesPage() {
  return (
    <main className="space-y-6">
      <BrandPageHeader
        actionHref={routes.brand.newChallenge}
        actionIcon={PlusCircle}
        actionLabel="Создать"
        description="Простая витрина текущих кампаний для демо-кабинета."
        eyebrow="Механики"
        title="Челленджи бренда"
      />

      <section className="grid gap-4 lg:grid-cols-2">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50">
                <Target className="h-5 w-5 text-slate-600" />
              </div>
              <Badge
                variant={challenge.isActive ? "success" : "neutral"}
                className={!challenge.isActive ? "text-slate-500" : undefined}
              >
                {challenge.isActive ? "Активен" : "Черновик"}
              </Badge>
            </div>
            <h2 className="mt-5 text-xl font-black">{challenge.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {challenge.description}
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="font-black">+{challenge.coinsReward}</div>
                <div className="text-xs text-slate-400">монет</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="font-black">{challenge.daysLeft}</div>
                <div className="text-xs text-slate-400">дней</div>
              </div>
              <div className="rounded-2xl bg-slate-50 p-3">
                <div className="font-black">{challenge.category}</div>
                <div className="text-xs text-slate-400">сегмент</div>
              </div>
            </div>
          </Card>
        ))}
      </section>
    </main>
  );
}
