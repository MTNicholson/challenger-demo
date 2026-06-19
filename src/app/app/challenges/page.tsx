import { Filter, Search } from "lucide-react";
import { routes } from "@/lib/routes";
import { challenges } from "@/data/challenges";
import { buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChallengeCard } from "@/components/user/challenge-card";

const categories = ["Все", "Кофе", "Еда", "Фитнес", "Beauty", "Книги"];

export default function UserChallengesPage() {
  return (
    <main className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-slate-400">Каталог</p>
        <h1 className="mt-1 text-3xl font-black">Челленджи</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Демо-каталог: каждая карточка открывает страницу челленджа.
        </p>
      </header>

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
            className={challenge.cardClassName}
          />
        ))}
      </section>
    </main>
  );
}
