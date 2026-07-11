"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeft,
  BarChart3,
  ChevronsLeft,
  ChevronsRight,
  Gift,
  LayoutDashboard,
  MapPin,
  PlusCircle,
  QrCode,
  Settings,
  Sparkles,
  Smartphone,
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
    label: "Точки",
    href: routes.brand.locations,
    icon: MapPin,
  },
  { label: "Сканер", href: routes.brand.scanner, icon: QrCode },
  {
    label: "Превью гостя",
    href: routes.brand.preview,
    icon: Sparkles,
  },
  {
    label: "Настройки",
    href: routes.brand.settings,
    icon: Settings,
  },
];

const navigationOrder: Record<string, number> = {
  [routes.brand.dashboard]: 0,
  [routes.brand.analytics]: 1,
  [routes.brand.challenges]: 2,
  [routes.brand.newChallenge]: 3,
  [routes.brand.rewards]: 4,
  [routes.brand.locations]: 5,
  [routes.brand.scanner]: 6,
  [routes.brand.settings]: 7,
};

function isItemActive(pathname: string, href: string) {
  if (href === routes.brand.dashboard) return pathname === href;
  if (href === routes.brand.challenges) return pathname === href;
  if (href === routes.brand.scanner) {
    return pathname === href || pathname === routes.brand.scanResult;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

type BrandSidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export function BrandSidebar({ collapsed, onToggle }: BrandSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-screen shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200",
        collapsed ? "w-20" : "w-20 lg:w-72",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
        <span
          className={cn(
            "min-w-0 truncate text-sm font-black uppercase tracking-[0.16em] text-blue-700",
            collapsed ? "sr-only" : "hidden lg:inline",
          )}
        >
          ЧЕЛЛЕНДЖЕР
        </span>
        <button
          aria-label={collapsed ? "Развернуть меню" : "Свернуть меню"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          type="button"
          onClick={onToggle}
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4" aria-label="Навигация кабинета бренда">
        {items
          .filter((item) => item.href !== routes.brand.preview)
          .sort((first, second) => (navigationOrder[first.href] ?? 99) - (navigationOrder[second.href] ?? 99))
          .map((item) => {
          const Icon = item.icon;
          const isActive = isItemActive(pathname, item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-extrabold transition duration-200",
                collapsed ? "justify-center px-2" : "justify-center px-2 lg:justify-start lg:px-3",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-blue-50/70 hover:text-blue-700",
              )}
              aria-current={isActive ? "page" : undefined}
              title={collapsed ? item.label : undefined}
            >
              <span
                className={cn(
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg transition",
                  isActive ? "bg-blue-100 text-blue-700" : "bg-slate-50 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-700",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className={cn("truncate", collapsed ? "sr-only" : "sr-only lg:not-sr-only")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="space-y-2 border-t border-slate-200 px-3 py-4">
        <Link
          href={routes.marketing.home}
          className={cn(
            "flex min-h-10 items-center gap-3 rounded-xl px-3 text-sm font-extrabold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900",
            collapsed ? "justify-center px-2" : "justify-center px-2 lg:justify-start lg:px-3",
          )}
          title={collapsed ? "Вернуться на главную" : undefined}
        >
          <ArrowLeft className="h-[18px] w-[18px] shrink-0" />
          <span className={cn(collapsed ? "sr-only" : "sr-only lg:not-sr-only")}>Вернуться на главную</span>
        </Link>
        <Link
          href={routes.user.home}
          className={cn(
            "flex min-h-10 items-center gap-3 rounded-xl bg-blue-50 px-3 text-sm font-extrabold text-blue-700 transition hover:bg-blue-100",
            collapsed ? "justify-center px-2" : "justify-center px-2 lg:justify-start lg:px-3",
          )}
          title={collapsed ? "Перейти в приложение" : undefined}
        >
          <Smartphone className="h-[18px] w-[18px] shrink-0" />
          <span className={cn(collapsed ? "sr-only" : "sr-only lg:not-sr-only")}>Перейти в приложение</span>
        </Link>
      </div>
    </aside>
  );
}
