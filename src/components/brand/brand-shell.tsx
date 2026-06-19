import { ReactNode } from "react";
import Link from "next/link";
import { Bell, Building2 } from "lucide-react";
import { BrandSidebar } from "./brand-sidebar";
import { routes } from "@/lib/routes";

type BrandShellProps = {
  children: ReactNode;
};

export function BrandShell({ children }: BrandShellProps) {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-slate-950">
      <div className="flex min-h-screen">
        <BrandSidebar />

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 px-5 py-4 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Кабинет бренда
                </div>
                <div className="mt-1 flex items-center gap-2 text-lg font-bold">
                  <Building2 className="h-5 w-5" />
                  Coffee Place
                </div>
              </div>

              <Link
                href={routes.brand.analytics}
                aria-label="Открыть аналитику"
                className="rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 shadow-sm transition hover:bg-slate-50"
              >
                <Bell className="h-5 w-5" />
              </Link>
            </div>
          </header>

          <div className="px-5 py-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
