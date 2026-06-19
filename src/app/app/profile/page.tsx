import Link from "next/link";
import {
  Award,
  ChevronRight,
  Heart,
  History,
  LifeBuoy,
  MapPin,
  Settings,
  Trophy,
  WalletCards,
} from "lucide-react";
import { routes } from "@/lib/routes";

const achievements = [
  { label: "Маршруты", value: "4", icon: Trophy },
  { label: "Награды", value: "8", icon: Award },
  { label: "Любимые", value: "12", icon: Heart },
];

const stats = [
  ["12", "завершено"],
  ["3", "активно"],
  ["27", "визитов"],
];

const menu = [
  { label: "Мои челленджи", icon: Trophy },
  { label: "Любимые места", icon: Heart },
  { label: "История визитов", icon: History },
  { label: "Настройки", icon: Settings },
  { label: "Поддержка", icon: LifeBuoy },
];

export default function UserProfilePage() {
  return (
    <main className="space-y-5">
      <section className="rounded-[34px] bg-white p-5 text-center shadow-sm">
        <div className="mx-auto grid h-24 w-24 place-items-center rounded-[34px] bg-[linear-gradient(145deg,#111827,#475569)] text-4xl font-black text-white">
          А
        </div>
        <h1 className="mt-4 text-3xl font-black">Алекс</h1>
        <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-slate-500">
          <MapPin className="h-4 w-4" />
          Санкт-Петербург
        </p>
      </section>

      <Link
        href={routes.user.coins}
        className="flex items-center justify-between rounded-[28px] bg-amber-100 p-4 text-amber-950 shadow-sm"
      >
        <div className="flex items-center gap-3">
          <WalletCards className="h-7 w-7" />
          <div>
            <p className="text-sm font-bold text-amber-700">Монетки</p>
            <p className="text-2xl font-black">1 250</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5" />
      </Link>

      <section className="grid grid-cols-3 gap-3">
        {achievements.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="rounded-[24px] bg-white p-4 shadow-sm">
              <Icon className="h-5 w-5 text-slate-400" />
              <p className="mt-3 text-2xl font-black">{item.value}</p>
              <p className="text-xs font-bold text-slate-400">{item.label}</p>
            </div>
          );
        })}
      </section>

      <section className="rounded-[30px] bg-slate-950 p-5 text-white shadow-xl shadow-slate-900/10">
        <h2 className="text-xl font-black">Активность</h2>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-2xl bg-white/10 p-3">
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs font-semibold text-white/55">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="overflow-hidden rounded-[30px] bg-white shadow-sm">
        {menu.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              className="flex w-full items-center gap-3 border-b border-slate-100 px-5 py-4 text-left last:border-b-0"
            >
              <Icon className="h-5 w-5 text-slate-400" />
              <span className="flex-1 text-sm font-bold text-slate-800">
                {item.label}
              </span>
              <ChevronRight className="h-5 w-5 text-slate-300" />
            </button>
          );
        })}
      </section>
    </main>
  );
}
