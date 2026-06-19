import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Coins,
  Clock,
  Gift,
  Map,
  ShieldCheck,
} from "lucide-react";
import { getChallengeById } from "@/data/challenges";
import { getAvailableRewards } from "@/data/rewards";
import { demoUser } from "@/data/user";
import { routes } from "@/lib/routes";
import { buttonClasses } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const qrCells = [
  0, 1, 2, 4, 5, 7, 8, 10, 12, 13, 16, 18, 20, 21, 22, 24, 25, 27, 28, 31, 32,
  34, 36, 38, 39, 40, 42, 45, 46, 48, 49, 50, 52, 54, 56, 57, 59, 60, 62, 63,
  65, 66, 68, 71, 73, 74, 76, 77, 79, 81, 83, 84, 86, 87, 88, 90, 93, 94, 96,
  97, 99, 101, 102, 104, 106, 107, 109, 110, 112, 114, 116, 117, 119, 120, 122,
  123, 125, 126, 127, 130, 131, 133, 135, 136, 138, 140, 141, 143,
];

export default function UserRewardPage() {
  const availableRewards = getAvailableRewards();
  const reward = availableRewards[0];
  const otherRewards = availableRewards.slice(1, 3);
  const challenge = getChallengeById("coffee-route")!;
  const rules = [
    "Покажите QR-код сотруднику на кассе.",
    "Награда действует только один раз.",
    "Код нельзя передать другому пользователю.",
  ];

  return (
    <main className="space-y-5">
      <header>
        <Badge variant="success">
          <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
          Челлендж выполнен
        </Badge>
        <h1 className="mt-3 text-3xl font-black">Ваша награда</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          Награда закреплена за профилем {demoUser.name}. {reward.brandName} подготовил
          QR-код для получения на кассе.
        </p>
      </header>

      <section className="rounded-[34px] bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-[24px] bg-amber-100 text-3xl">
            {reward.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-400">
              {reward.brandName} · {challenge.title}
            </p>
            <h2 className="mt-1 text-2xl font-black">{reward.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {reward.description}
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-[36px] bg-slate-950 p-5 text-white shadow-2xl shadow-slate-900/15">
        <div className="rounded-[30px] bg-white p-4">
          <div className="mx-auto grid aspect-square w-full max-w-[280px] grid-cols-12 gap-1 rounded-[22px] bg-white p-3">
            {Array.from({ length: 144 }).map((_, index) => (
              <div
                key={index}
                className={
                  qrCells.includes(index)
                    ? "rounded-[3px] bg-slate-950"
                    : "rounded-[3px] bg-slate-100"
                }
              />
            ))}
          </div>
        </div>

        <p className="mt-5 text-center text-base font-black">
          Покажите QR-код сотруднику на кассе
        </p>

        <div className="mt-5 rounded-[24px] bg-white/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-white/55">Ручной код</p>
              <p className="mt-1 text-2xl font-black tracking-[0.16em]">
                {reward.code}
              </p>
            </div>
            <span className="rounded-full bg-white px-4 py-2 text-sm font-black text-slate-950">
              {reward.type}
            </span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-[28px] bg-emerald-50 p-4 text-emerald-950 shadow-sm">
          <Clock className="h-6 w-6" />
          <p className="mt-4 text-sm font-bold text-emerald-700">Истекает</p>
          <p className="text-2xl font-black">{reward.expiresAt}</p>
        </div>
        <div className="rounded-[28px] bg-white p-4 shadow-sm">
          <Gift className="h-6 w-6 text-slate-500" />
          <p className="mt-4 text-sm font-bold text-slate-400">Тип</p>
          <p className="text-2xl font-black">{reward.type}</p>
        </div>
      </section>

      <section className="rounded-[30px] bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          <h2 className="text-xl font-black">Правила</h2>
        </div>
        <ul className="mt-4 space-y-3">
          {rules.map((rule) => (
            <li key={rule} className="flex gap-3 text-sm leading-6 text-slate-600">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-emerald-400" />
              {rule}
            </li>
          ))}
        </ul>
      </section>

      {otherRewards.length > 0 ? (
        <section className="rounded-[30px] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-black">Другие доступные награды</h2>
          <div className="mt-4 space-y-3">
            {otherRewards.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-amber-50 text-2xl">
                  {item.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold">{item.title}</p>
                  <p className="text-sm text-slate-500">
                    {item.brandName} · до {item.expiresAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="space-y-3">
        <Link
          href={routes.user.activeChallenge}
          className={buttonClasses({
            variant: "dark",
            size: "lg",
            className: "w-full",
          })}
        >
          <ArrowLeft className="h-5 w-5" />
          Вернуться к прогрессу
        </Link>
        <Link
          href={routes.user.coins}
          className={buttonClasses({
            variant: "secondary",
            size: "lg",
            className: "w-full",
          })}
        >
          <Coins className="h-5 w-5" />
          Баланс монеток
        </Link>
        <Link
          href={routes.user.map}
          className={buttonClasses({
            variant: "secondary",
            size: "lg",
            className: "w-full",
          })}
        >
          <Map className="h-5 w-5" />
          Открыть карту
        </Link>
      </section>
    </main>
  );
}
