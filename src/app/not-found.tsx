import Link from "next/link";
import { ArrowRight, Building2, Home, Smartphone } from "lucide-react";
import { buttonClasses } from "@/components/ui/button";
import { routes } from "@/lib/routes";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center overflow-hidden bg-[#f7f2ea] px-5 py-10 text-slate-950">
      <section className="relative w-full max-w-2xl overflow-hidden rounded-[36px] border border-white/80 bg-white/90 p-6 text-center shadow-2xl shadow-slate-900/10 sm:p-10">
        <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-emerald-100" />
        <div className="absolute -bottom-20 -left-16 h-44 w-44 rounded-full bg-amber-100" />

        <div className="relative">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
            Ошибка 404
          </p>
          <h1 className="mt-4 text-4xl font-black sm:text-5xl">
            Такой страницы нет в прототипе
          </h1>
          <p className="mx-auto mt-4 max-w-lg leading-7 text-slate-500">
            Возможно, адрес устарел или экран ещё не входит в демо. Вернитесь на
            главную или продолжите с пользовательского приложения либо кабинета бренда.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={routes.marketing.home}
              className={buttonClasses({ variant: "dark", size: "lg" })}
            >
              <Home className="h-5 w-5" />
              На главную
            </Link>
            <Link
              href={routes.user.home}
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              <Smartphone className="h-5 w-5" />
              Приложение
            </Link>
            <Link
              href={routes.brand.dashboard}
              className={buttonClasses({ variant: "secondary", size: "lg" })}
            >
              <Building2 className="h-5 w-5" />
              Кабинет бренда
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
