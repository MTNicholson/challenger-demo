import { ReactNode } from "react";
import Link from "next/link";
import { Bell, Building2, ChevronDown, Sparkles } from "lucide-react";
import { BrandSidebar } from "./brand-sidebar";
import { routes } from "@/lib/routes";

type BrandShellProps = {
  children: ReactNode;
};

export function BrandShell({ children }: BrandShellProps) {
  return (
    <div className="brand-shell min-h-screen text-slate-950">
      <div className="flex min-h-screen">
        <BrandSidebar />

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-white/70 bg-white/55 px-5 py-3.5 shadow-[0_8px_30px_rgba(30,55,47,0.04)] backdrop-blur-2xl lg:px-8">
            <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-2xl border border-white/80 bg-white/70 text-emerald-700 shadow-sm backdrop-blur-xl lg:hidden">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                <div className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                  Демо-кабинет бренда
                </div>
                <div className="mt-0.5 flex items-center gap-2 text-lg font-extrabold">
                  <Building2 className="h-5 w-5 text-emerald-700" />
                  Coffee Place
                </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden rounded-full border border-emerald-200/70 bg-emerald-50/80 px-3 py-2 text-xs font-extrabold text-emerald-700 sm:inline-flex">● Система работает</span>
                <Link href={routes.brand.analytics} aria-label="Открыть аналитику" className="rounded-2xl border border-white/80 bg-white/70 p-3 text-slate-600 shadow-sm backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white hover:text-emerald-700">
                  <Bell className="h-5 w-5" />
                </Link>
                <button aria-label="Меню бренда" className="hidden items-center gap-2 rounded-2xl border border-white/80 bg-white/70 px-3 py-2.5 text-sm font-extrabold text-slate-700 shadow-sm sm:flex"><span className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-100 text-xs">☕</span>CP<ChevronDown className="h-4 w-4 text-slate-400" /></button>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1440px] px-4 pb-28 pt-6 sm:px-5 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
