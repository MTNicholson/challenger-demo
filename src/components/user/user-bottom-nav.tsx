"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Trophy, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";

const items = [
  {
    label: "Главная",
    href: routes.user.home,
    icon: Home,
    activePaths: [routes.user.home],
  },
  {
    label: "Челленджи",
    href: routes.user.challenges,
    icon: Trophy,
    activePaths: [
      routes.user.challenges,
      routes.user.activeChallenge,
      routes.user.reward,
    ],
  },
  {
    label: "Карта",
    href: routes.user.map,
    icon: Map,
    activePaths: [routes.user.map],
  },
  {
    label: "Профиль",
    href: routes.user.profile,
    icon: User,
    activePaths: [routes.user.profile, routes.user.coins],
  },
];

export function UserBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-3 left-1/2 z-50 w-[calc(100%-24px)] max-w-[452px] -translate-x-1/2 rounded-[26px] border border-slate-200/70 bg-white/90 px-2 py-2 shadow-xl shadow-slate-900/10 backdrop-blur-xl sm:bottom-4">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.activePaths.some((activePath) =>
            activePath === routes.user.home
              ? pathname === activePath
              : pathname === activePath || pathname.startsWith(`${activePath}/`),
          );

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[18px] px-2 py-2 text-[11px] font-semibold transition",
                isActive
                  ? "bg-slate-950 text-white shadow-md shadow-slate-900/15"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-950",
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
