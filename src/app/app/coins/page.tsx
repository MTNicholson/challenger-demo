import { ArrowDownLeft, ArrowUpRight, WalletCards } from "lucide-react";
import { demoUser } from "@/data/user";

const history = [
  { label: "Кофейная неделя", value: "+120", type: "in" },
  { label: "Вход в Сладкий июнь", value: "-150", type: "out" },
  { label: "10 000 шагов", value: "+200", type: "in" },
];

export default function UserCoinsPage() {
  return (
    <main className="space-y-5">
      <section className="rounded-[34px] bg-amber-100 p-6 text-amber-950 shadow-sm">
        <WalletCards className="h-7 w-7" />
        <div className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-amber-700">
          Баланс
        </div>
        <h1 className="mt-1 text-5xl font-black">{demoUser.coins}</h1>
        <p className="mt-2 text-sm leading-6 text-amber-800/80">
          Монетки можно тратить на закрытые челленджи и специальные награды.
        </p>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <h2 className="text-xl font-black">История</h2>
        <div className="mt-4 space-y-3">
          {history.map((item) => {
            const Icon = item.type === "in" ? ArrowDownLeft : ArrowUpRight;
            return (
              <div key={item.label} className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-50">
                  <Icon className="h-5 w-5 text-slate-500" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-bold">{item.label}</div>
                  <div className="text-xs text-slate-400">Демо-операция</div>
                </div>
                <div
                  className={
                    item.type === "in"
                      ? "font-black text-emerald-600"
                      : "font-black text-rose-500"
                  }
                >
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
