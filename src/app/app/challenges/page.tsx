import { Filter, Search, Sparkles } from "lucide-react";
import { routes } from "@/lib/routes";
import { challenges } from "@/data/challenges";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ChallengeCard } from "@/components/user/challenge-card";

const categories = ["Все", "Кофе", "Еда", "Фитнес", "Beauty", "Книги"];

export default function UserChallengesPage() {
  const featuredChallenge = challenges.find((challenge) => challenge.isFeatured);

  return (
    <main className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-slate-400">Каталог</p>
        <h1 className="mt-1 text-3xl font-black">Челленджи</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Выберите маршрут, посмотрите условия и продолжите прогресс до награды.
        </p>
      </header>

      {featuredChallenge ? (
        <section className="rounded-[30px] bg-white p-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] bg-slate-950 text-3xl text-white">
              {featuredChallenge.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="warning">
                  <Sparkles className="mr-1 h-3 w-3" />
                  Выбранный маршрут
                </Badge>
                <span className="text-xs font-bold text-slate-400">
                  {featuredChallenge.brandName}
                </span>
              </div>
              <h2 className="mt-2 text-xl font-black">
                {featuredChallenge.title}
              </h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">
                {featuredChallenge.progress?.label ?? featuredChallenge.condition} · награда:{" "}
                {featuredChallenge.reward}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <div className="flex gap-3">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-4 py-3 text-slate-400 shadow-sm">
          <Search className="h-5 w-5" />
          <Input placeholder="Найти челлендж" />
        </label>
        <span
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-900/10"
          aria-label="Фильтр"
        >
          <Filter className="h-5 w-5" />
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category, index) => (
          <span
            key={category}
            className={buttonClasses({
              variant: index === 0 ? "dark" : "secondary",
              size: "sm",
              className: index === 0 ? "shrink-0" : "shrink-0 font-bold text-slate-600",
            })}
          >
            {category}
          </span>
        ))}
      </div>

      <section className="grid grid-cols-2 gap-3">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            href={routes.user.challengeDetail(challenge.id)}
            title={challenge.title}
            brand={challenge.brandName}
            reward={challenge.coinsReward}
            emoji={challenge.emoji}
            category={challenge.category}
            featured={challenge.id === "coffee-route"}
            progress={challenge.progress}
            rewardText={challenge.reward}
            status={
              challenge.isActive
                ? "В процессе"
                : challenge.isFeatured
                  ? "Рекомендуем"
                  : "Новый"
            }
            className={challenge.cardClassName}
          />
        ))}
      </section>
    </main>
  );
}
