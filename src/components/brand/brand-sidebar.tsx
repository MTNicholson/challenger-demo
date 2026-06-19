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
    label: "Превью",
    href: routes.brand.preview,
    icon: Sparkles,
  },
];

export function BrandSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <div className="mb-8 rounded-3xl bg-slate-950 p-4 text-white">
        <div className="text-sm font-semibold text-white/60">Челленджер</div>
        <div className="mt-1 text-xl font-bold">Coffee Place</div>
        <div className="mt-3 text-xs text-white/55">Демо-кабинет бренда</div>
      </div>

      <nav className="space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === routes.brand.dashboard
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

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

      <div className="mt-8 rounded-3xl bg-emerald-50 p-4 text-sm text-emerald-950">
        <div className="font-semibold">Демо-режим</div>
        <p className="mt-1 text-emerald-800/80">
          Данные моковые, но сценарии выглядят как реальный кабинет.
        </p>
      </div>
    </aside>
  );
}
