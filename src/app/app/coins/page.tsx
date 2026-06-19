import {
  ArrowDownLeft,
  ArrowUpRight,
  Coffee,
  Gift,
  Info,
  ReceiptText,
  WalletCards,
} from "lucide-react";

const earnWays = [
  { title: "Выполнять челленджи", caption: "До 200 монет", icon: Gift },
  { title: "Заходить каждый день", caption: "+10 монет", icon: Coffee },
  { title: "Посещать новые места", caption: "+30 монет", icon: WalletCards },
];

const transactions = [
  { title: "Кофейный маршрут", date: "Сегодня", amount: "+200", type: "in" },
  { title: "Задача дня", date: "Сегодня", amount: "+10", type: "in" },
  { title: "Сладкий июнь", date: "Вчера", amount: "-150", type: "out" },
  { title: "10 000 шагов", date: "15 июня", amount: "+120", type: "in" },
];

export default function UserCoinsPage() {
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
        <h1 className="mt-1 text-6xl font-black leading-none">1 250</h1>
        <p className="mt-3 text-sm font-semibold text-amber-900/70">
          Тратьте на награды, закрытые челленджи и бонусы у партнеров.
        </p>
      </section>

      <button className="flex w-full items-center gap-3 rounded-[28px] bg-white p-4 text-left shadow-sm">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-slate-50">
          <ReceiptText className="h-6 w-6 text-slate-600" />
        </div>
        <div className="flex-1">
          <p className="font-black">История начислений</p>
          <p className="text-sm text-slate-500">Все операции за месяц</p>
        </div>
      </button>

      <section>
        <h2 className="mb-3 text-xl font-black">Как заработать монетки</h2>
        <div className="space-y-3">
          {earnWays.map((way) => {
            const Icon = way.icon;
            return (
              <div key={way.title} className="flex items-center gap-3 rounded-[26px] bg-white p-4 shadow-sm">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50">
                  <Icon className="h-6 w-6 text-emerald-700" />
                </div>
                <div>
                  <p className="font-black">{way.title}</p>
                  <p className="text-sm text-slate-500">{way.caption}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">Операции</h2>
        <div className="mt-4 space-y-3">
          {transactions.map((item) => {
            const Icon = item.type === "in" ? ArrowDownLeft : ArrowUpRight;
            return (
              <div key={`${item.title}-${item.date}`} className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50">
                  <Icon className="h-5 w-5 text-slate-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.date}</p>
                </div>
                <p
                  className={
                    item.type === "in"
                      ? "font-black text-emerald-600"
                      : "font-black text-rose-500"
                  }
                >
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
