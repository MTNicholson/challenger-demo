import Link from "next/link";
import { ArrowRight, BadgeCheck, MapPin, QrCode, Sparkles } from "lucide-react";
import { routes } from "@/lib/routes";

const steps = [
  "Бренд запускает челлендж за визиты, шаги или покупки.",
  "Гость выполняет задание и копит монетки.",
  "Команда видит результат в кабинете и выдает награды.",
];

const metrics = [
  { value: "18%", label: "рост повторных визитов" },
  { value: "7 мин", label: "до запуска первого челленджа" },
  { value: "3x", label: "больше поводов вернуться" },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f4ee] text-slate-950">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-6 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between rounded-full border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur">
          <div className="flex items-center gap-2 text-lg font-black">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-950 text-white">
              Ч
            </span>
            Челленджер
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 sm:flex">
            <a href="#product" className="transition hover:text-slate-950">
              Продукт
            </a>
            <a href="#demo" className="transition hover:text-slate-950">
              Демо
            </a>
          </nav>
          <Link
            href={routes.brand.dashboard}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
          >
            Кабинет
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1fr_0.92fr]">
          <div className="max-w-2xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-900">
              <Sparkles className="h-4 w-4" />
              Day 1 investor demo
            </div>
            <h1 className="text-5xl font-black leading-[1.02] tracking-normal text-slate-950 sm:text-6xl">
              Челленджер
            </h1>
            <p className="mt-5 max-w-xl text-xl leading-8 text-slate-600">
              Платформа, где локальные бренды превращают визиты, покупки и
              активность гостей в понятные челленджи с наградами.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href={routes.user.home}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-4 text-base font-bold text-white shadow-xl shadow-slate-900/15 transition hover:bg-slate-800"
              >
                Открыть приложение
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href={routes.brand.dashboard}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-4 text-base font-bold text-slate-900 shadow-sm transition hover:bg-slate-50"
              >
                Посмотреть кабинет
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/80 bg-white/75 p-4 shadow-sm"
                >
                  <div className="text-2xl font-black">{metric.value}</div>
                  <div className="mt-1 text-sm leading-5 text-slate-500">
                    {metric.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div id="product" className="relative">
            <div className="absolute -left-6 top-10 hidden rounded-3xl bg-white p-4 shadow-2xl shadow-slate-900/10 md:block">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-900">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold">Награда готова</div>
                  <div className="text-xs text-slate-500">Авторский раф</div>
                </div>
              </div>
            </div>
            <div className="mx-auto max-w-[420px] rounded-[38px] border border-white/80 bg-white p-4 shadow-2xl shadow-slate-900/15">
              <div className="rounded-[30px] bg-[#f6f2ea] p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                      Сегодня
                    </div>
                    <div className="mt-1 text-2xl font-black">Алекс, вперед</div>
                  </div>
                  <div className="rounded-2xl bg-white px-3 py-2 text-sm font-bold shadow-sm">
                    1 250 🪙
                  </div>
                </div>

                <div className="mt-5 rounded-3xl bg-slate-950 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-white/60">Активный челлендж</div>
                    <QrCode className="h-5 w-5 text-white/60" />
                  </div>
                  <div className="mt-4 text-2xl font-black">Кофейная неделя</div>
                  <div className="mt-2 text-sm leading-6 text-white/70">
                    3 из 5 визитов выполнено. Еще два визита до подарка.
                  </div>
                  <div className="mt-5 h-3 rounded-full bg-white/15">
                    <div className="h-3 w-3/5 rounded-full bg-emerald-300" />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <MapPin className="h-5 w-5 text-rose-500" />
                    <div className="mt-3 text-sm font-bold">0,8 км</div>
                    <div className="text-xs text-slate-500">до Coffee Place</div>
                  </div>
                  <div className="rounded-3xl bg-white p-4 shadow-sm">
                    <Sparkles className="h-5 w-5 text-amber-500" />
                    <div className="mt-3 text-sm font-bold">+120</div>
                    <div className="text-xs text-slate-500">монеток</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section id="demo" className="grid gap-3 pb-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={step} className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <div className="mb-4 grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-sm font-black text-white">
                {index + 1}
              </div>
              <p className="text-sm leading-6 text-slate-600">{step}</p>
            </div>
          ))}
        </section>
      </section>
    </main>
  );
}
