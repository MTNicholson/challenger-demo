"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Gift,
  LayoutDashboard,
  PlusCircle,
  QrCode,
  Sparkles,
  Target,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

const items = [
  {
    label: "Обзор",
    href: routes.brand.dashboard,
    icon: LayoutDashboard,
  },
  {
    label: "Челленджи",
    href: routes.brand.challenges,
    icon: Target,
  },
  {
    label: "Создать",
    href: routes.brand.newChallenge,
    icon: PlusCircle,
  },
  {
    label: "Аналитика",
    href: routes.brand.analytics,
    icon: BarChart3,
  },
  {
    label: "Награды",
    href: routes.brand.rewards,
    icon: Gift,
  },
  {
    label: "Сканер",
    href: routes.brand.scanner,
    icon: QrCode,
  },
  {
    label: "Превью гостя",
    href: routes.brand.preview,
    icon: Sparkles,
  },
];

function isItemActive(pathname: string, href: string) {
  if (href === routes.brand.dashboard) return pathname === href;
  if (href === routes.brand.challenges) return pathname === href;
  if (href === routes.brand.scanner) {
    return pathname === href || pathname === routes.brand.scanResult;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function BrandSidebar({ brandName }: { brandName: string }) {
  const pathname = usePathname();

  return (
    <>
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 p-4 lg:block">
      <div className="brand-glass flex h-full flex-col rounded-[30px] p-3">
      <div className="brand-glass-dark mb-5 rounded-[24px] p-4 text-white">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-white/10 text-xl">⚡</span><div><div className="text-sm font-bold text-white/60">Челленджер</div><div className="text-lg font-extrabold">{brandName}</div></div></div>
        <div className="mt-4 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-[11px] font-bold text-white/60">Кабинет бренда · демо</div>
      </div>

      <nav className="flex-1 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition duration-200",
                isActive
                  ? "bg-[#172f29] text-white shadow-lg shadow-emerald-950/15"
                  : "text-slate-600 hover:translate-x-0.5 hover:bg-white/70 hover:text-slate-950",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={cn("grid h-8 w-8 place-items-center rounded-xl transition", isActive ? "bg-white/10 text-emerald-200" : "bg-white/50 text-slate-500 group-hover:text-emerald-700")}><Icon className="h-[18px] w-[18px]" /></span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 rounded-2xl border border-emerald-100/80 bg-emerald-50/70 p-3 text-xs text-emerald-950">
        <div className="font-extrabold">Демо-режим</div>
        <p className="mt-1 leading-5 text-emerald-800/75">
          Данные моковые, но сценарии связаны в единый кабинет бренда.
        </p>
      </div>
      </div>
    </aside>
    <nav aria-label="Навигация кабинета" className="brand-glass fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 rounded-[22px] p-1.5 lg:hidden">
      {items.slice(0, 5).map((item) => {
        const Icon = item.icon;
        const isActive = isItemActive(pathname, item.href);
        return (
          <Link key={item.href} href={item.href} aria-current={isActive ? "page" : undefined} className={cn("flex min-w-0 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-extrabold transition", isActive ? "bg-[#172f29] text-white shadow-md" : "text-slate-500 hover:bg-white/70")}>
            <Icon className={cn("h-[18px] w-[18px]", isActive && "text-emerald-200")} />
            <span className="max-w-full truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
    </>
  );
}
