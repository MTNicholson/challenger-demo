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

export function BrandSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <div className="mb-7 rounded-[28px] bg-slate-950 p-4 text-white">
        <div className="text-sm font-semibold text-white/60">Челленджер</div>
        <div className="mt-1 text-xl font-bold">Coffee Place</div>
        <div className="mt-3 text-xs text-white/55">Кабинет бренда · демо</div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-900/10"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-950",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-7 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-3 text-xs text-emerald-950">
        <div className="font-semibold">Демо-режим</div>
        <p className="mt-1 leading-5 text-emerald-800/75">
          Данные моковые, но сценарии связаны в единый кабинет бренда.
        </p>
      </div>
    </aside>
  );
}
