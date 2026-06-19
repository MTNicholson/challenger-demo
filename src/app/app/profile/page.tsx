import Link from "next/link";
import {
  Activity,
  Award,
  ChevronRight,
  Coins,
  Flame,
  Heart,
  MapPin,
  MapPinned,
  Star,
  Trophy,
  WalletCards,
} from "lucide-react";
import { demoUser } from "@/data/user";
import { routes } from "@/lib/routes";

const achievements = [
  {
    label: "Достижения",
    value: String(demoUser.achievementsCount),
    icon: Trophy,
    href: routes.user.challenges,
  },
  {
    label: "Награды",
    value: String(demoUser.availableRewardsCount),
    icon: Award,
    href: routes.user.reward,
  },
  {
    label: "Любимые",
    value: String(demoUser.favoritePlacesCount),
    icon: Heart,
    href: routes.user.map,
  },
];

const menu = [
  { label: "Мои челленджи", icon: Trophy, href: routes.user.challenges },
  { label: "Активный челлендж", icon: Flame, href: routes.user.activeChallenge },
  { label: "Баланс монеток", icon: Coins, href: routes.user.coins },
  { label: "Мои награды", icon: Award, href: routes.user.reward },
  { label: "Любимые места", icon: Heart, href: routes.user.map },
];

const stats = [
  {
    label: "челленджей завершено",
    value: demoUser.completedChallengesCount,
    icon: Trophy,
  },
  {
    label: "активных челленджа",
    value: demoUser.activeChallengesCount,
    icon: Activity,
  },
  {
    label: "награды доступны",
    value: demoUser.availableRewardsCount,
    icon: Award,
  },
  {
    label: "любимых мест",
    value: demoUser.favoritePlacesCount,
    icon: MapPinned,
  },
];

export default function UserProfilePage() {
  return (
    <main className="space-y-5">
      <section className="overflow-hidden rounded-[34px] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-[34px] bg-[linear-gradient(145deg,#111827,#475569)] text-4xl font-black text-white">
            {demoUser.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
              <Star className="h-3.5 w-3.5" />
              Уровень: исследователь
            </div>
            <h1 className="mt-3 text-3xl font-black">{demoUser.name}</h1>
            <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-slate-500">
              <MapPin className="h-4 w-4" />
              {demoUser.city}, {demoUser.district}
            </p>
          </div>
        </div>
      </section>

      <Link
        href={routes.user.coins}
        className="flex items-center justify-between rounded-[28px] bg-amber-100 p-4 text-amber-950 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <WalletCards className="h-7 w-7" />
          <div>
            <p className="text-sm font-bold text-amber-700">Монетки</p>
            <p className="text-2xl font-black">
              {demoUser.coins.toLocaleString("ru-RU")}
            </p>
            <p className="text-xs font-semibold text-amber-800/70">
              Можно обменять на награды
            </p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5" />
      </Link>

      <section className="grid grid-cols-3 gap-3">
        {achievements.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href ?? routes.user.map}
              className="rounded-[24px] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <Icon className="h-5 w-5 text-slate-400" />
              <p className="mt-3 text-2xl font-black">{item.value}</p>
              <p className="text-xs font-bold text-slate-400">{item.label}</p>
            </Link>
          );
        })}
      </section>

      <section className="rounded-[30px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
        <h2 className="text-xl font-black">Личный прогресс</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="rounded-2xl bg-white/10 p-3">
                <Icon className="h-5 w-5 text-white/45" />
                <p className="mt-3 text-2xl font-black">{item.value}</p>
                <p className="text-xs font-semibold leading-4 text-white/55">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] bg-white shadow-sm">
        {menu.map((item) => {
          const Icon = item.icon;
          const rowContent = (
            <>
              <Icon className="h-5 w-5 text-slate-400" />
              <span className="flex-1 text-sm font-bold text-slate-800">
                {item.label}
              </span>
              {item.href ? (
                <ChevronRight className="h-5 w-5 text-slate-300" />
              ) : null}
            </>
          );

          return item.href ? (
            <Link
              key={item.label}
              href={item.href}
              className="flex w-full items-center gap-3 border-b border-slate-100 px-5 py-4 text-left last:border-b-0"
            >
              {rowContent}
            </Link>
          ) : null;
        })}
      </section>
    </main>
  );
}
