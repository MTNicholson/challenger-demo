import { Filter, Search } from "lucide-react";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChallengeCard } from "@/components/user/challenge-card";

const categories = ["Все", "Кофе", "Еда", "Фитнес", "Beauty"];

const tiles = [
  {
    id: "coffee-week",
    title: "Кофейный маршрут",
    brand: "Coffee Place",
    reward: "200",
    emoji: "☕",
    className:
      "min-h-64 bg-[linear-gradient(145deg,#111827,#334155)] text-white",
  },
  {
    id: "ten-thousand-steps",
    title: "10 000 шагов",
    brand: "FitPro",
    reward: "120",
    emoji: "👟",
    className: "min-h-48 bg-sky-100 text-sky-950",
  },
  {
    id: "sweet-june",
    title: "Сладкий июнь",
    brand: "Sweetly",
    reward: "180",
    emoji: "🍓",
    className: "min-h-48 bg-rose-100 text-rose-950",
  },
  {
    id: "beauty-rewards",
    title: "Beauty Rewards",
    brand: "Beauty Store",
    reward: "80",
    emoji: "✨",
    className: "min-h-64 bg-violet-100 text-violet-950",
  },
  {
    id: "coffee-week",
    title: "Утренний фильтр",
    brand: "Coffee Place",
    reward: "60",
    emoji: "🌤️",
    className: "min-h-44 bg-amber-100 text-amber-950",
  },
  {
    id: "sweet-june",
    title: "Десерт после 18:00",
    brand: "Sweetly",
    reward: "90",
    emoji: "🧁",
    className: "min-h-44 bg-emerald-100 text-emerald-950",
  },
];

export default function UserChallengesPage() {
  return (
    <main className="space-y-5">
      <header>
        <p className="text-sm font-semibold text-slate-400">Каталог</p>
        <h1 className="mt-1 text-3xl font-black">Челленджи</h1>
      </header>

      <div className="flex gap-3">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white px-4 py-3 text-slate-400 shadow-sm">
          <Search className="h-5 w-5" />
          <Input placeholder="Найти челлендж" />
        </label>
        <button
          className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-slate-950 text-white shadow-lg shadow-slate-900/10"
          aria-label="Фильтр"
        >
          <Filter className="h-5 w-5" />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category, index) => (
          <button
            key={category}
            className={buttonClasses({
              variant: index === 0 ? "dark" : "secondary",
              size: "sm",
              className: index === 0 ? "shrink-0" : "shrink-0 font-bold text-slate-600",
            })}
          >
            {category}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-2 gap-3">
        {tiles.map((tile, index) => (
          <ChallengeCard
            key={`${tile.title}-${index}`}
            href={routes.user.challengeDetail(tile.id)}
            title={tile.title}
            brand={tile.brand}
            reward={`+${tile.reward}`}
            emoji={tile.emoji}
            className={tile.className}
          />
        ))}
      </section>
    </main>
  );
}
