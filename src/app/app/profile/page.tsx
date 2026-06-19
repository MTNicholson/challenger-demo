import Link from "next/link";
import { Award, Gift, Trophy, WalletCards } from "lucide-react";
import { demoUser } from "@/data/user";
import { routes } from "@/lib/routes";

const stats = [
  { label: "Активных", value: demoUser.activeChallengesCount, icon: Trophy },
  { label: "Завершено", value: demoUser.completedChallengesCount, icon: Award },
  { label: "Награды", value: demoUser.availableRewardsCount, icon: Gift },
];

export default function UserProfilePage() {
  return (
    <main className="space-y-5">
      <section className="rounded-[34px] bg-white p-5 text-center shadow-sm">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-slate-950 text-3xl font-black text-white">
          А
        </div>
        <h1 className="mt-4 text-3xl font-black">{demoUser.name}</h1>
        <p className="text-sm text-slate-500">
          {demoUser.city}, {demoUser.district}
        </p>
        <Link
          href={routes.user.coins}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-black text-amber-800"
        >
          <WalletCards className="h-4 w-4" />
          {demoUser.coins} монеток
        </Link>
      </section>

      <section className="grid grid-cols-3 gap-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-[24px] bg-white p-4 shadow-sm">
              <Icon className="h-5 w-5 text-slate-400" />
              <div className="mt-3 text-2xl font-black">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-400">
                {stat.label}
              </div>
            </div>
          );
        })}
      </section>

      <section className="rounded-[30px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
        <h2 className="text-xl font-black">Демо-статус</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Пользователь уже видит прогресс, монетки и доступные награды. Позже
          сюда лягут настройки и история активности.
        </p>
      </section>
    </main>
  );
}
