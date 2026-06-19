import Link from "next/link";
import { Filter, Search } from "lucide-react";
import { routes } from "@/lib/routes";

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
          <input
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
            placeholder="Найти челлендж"
          />
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
            className={
              index === 0
                ? "shrink-0 rounded-full bg-slate-950 px-4 py-2 text-sm font-black text-white"
                : "shrink-0 rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm"
            }
          >
            {category}
          </button>
        ))}
      </div>

      <section className="grid grid-cols-2 gap-3">
        {tiles.map((tile, index) => (
          <Link
            key={`${tile.title}-${index}`}
            href={routes.user.challengeDetail(tile.id)}
            className={`relative overflow-hidden rounded-[30px] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg ${tile.className}`}
          >
            <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full bg-white/25" />
            <div className="relative flex h-full flex-col">
              <div className="text-4xl">{tile.emoji}</div>
              <div className="mt-auto pt-8">
                <p className="text-xs font-bold opacity-60">{tile.brand}</p>
                <h2 className="mt-1 text-lg font-black leading-5">
                  {tile.title}
                </h2>
                <div className="mt-4 inline-flex rounded-full bg-white/70 px-3 py-1 text-sm font-black text-slate-950">
                  +{tile.reward}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
