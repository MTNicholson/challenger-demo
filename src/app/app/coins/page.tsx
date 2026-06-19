import Link from "next/link";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Coffee,
  Gift,
  Info,
  ReceiptText,
  WalletCards,
} from "lucide-react";
import { activityEvents } from "@/data/activity";
import { demoUser } from "@/data/user";
import { routes } from "@/lib/routes";

const earnWays = [
  {
    title: "Выполнять челленджи",
    caption: "До 200 монет",
    icon: Gift,
    href: routes.user.challenges,
  },
  {
    title: "Заходить каждый день",
    caption: "+10 монет",
    icon: Coffee,
    href: routes.user.home,
  },
  {
    title: "Посещать новые места",
    caption: "+30 монет",
    icon: WalletCards,
    href: routes.user.map,
  },
];

export default function UserCoinsPage() {
  const transactions = activityEvents.filter((event) => event.amount);

  return (
    <main className="space-y-5">
      <section className="overflow-hidden rounded-[36px] bg-[linear-gradient(145deg,#facc15,#f59e0b)] p-6 text-amber-950 shadow-2xl shadow-amber-500/15">
        <div className="flex items-center justify-between">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/55">
            <WalletCards className="h-7 w-7" />
          </div>
          <span className="rounded-full bg-white/50 px-3 py-1 text-sm font-black">
            Баланс
          </span>
        </div>
        <p className="mt-10 text-sm font-bold uppercase tracking-[0.16em] text-amber-800/70">
          Ваши монетки
        </p>
        <h1 className="mt-1 text-6xl font-black leading-none">
          {demoUser.coins.toLocaleString("ru-RU")}
        </h1>
        <p className="mt-3 text-sm font-semibold text-amber-900/70">
          Тратьте на награды, закрытые челленджи и бонусы у партнеров.
        </p>
      </section>

      <Link
        href="#operations"
        className="flex w-full items-center gap-3 rounded-[28px] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
      >
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50">
          <ReceiptText className="h-6 w-6 text-slate-600" />
        </div>
        <div className="flex-1">
          <p className="font-black">История начислений</p>
          <p className="text-sm text-slate-500">Все операции за месяц</p>
        </div>
      </Link>

      <section>
        <h2 className="mb-3 text-xl font-black">Как заработать монетки</h2>
        <div className="space-y-3">
          {earnWays.map((way) => {
            const Icon = way.icon;
            return (
              <Link
                key={way.title}
                href={way.href}
                className="flex items-center gap-3 rounded-[26px] bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50">
                  <Icon className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="font-black">{way.title}</p>
                  <p className="text-sm text-slate-500">{way.caption}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section id="operations" className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Операции</h2>
        <div className="mt-4 space-y-3">
          {transactions.map((item) => {
            const isIncome = (item.amount ?? 0) > 0;
            const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50">
                  <Icon className="h-5 w-5 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.date}</p>
                </div>
                <p
                  className={
                    isIncome
                      ? "font-black text-emerald-600"
                      : "font-black text-rose-500"
                  }
                >
                  {isIncome ? "+" : ""}
                  {item.amount}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="flex gap-3 rounded-[26px] bg-slate-950 p-4 text-white shadow-xl shadow-slate-900/10">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-white/60" />
        <p className="text-sm leading-6 text-white/70">
          Монетки нельзя вывести как деньги. Они работают только внутри
          Челленджера для наград и участия в механиках.
        </p>
      </section>
    </main>
  );
}
