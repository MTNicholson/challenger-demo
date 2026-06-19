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
  },
  {
    label: "Челленджи",
    href: routes.user.challenges,
    icon: Trophy,
  },
  {
    label: "Карта",
    href: routes.user.map,
    icon: Map,
  },
  {
    label: "Профиль",
    href: routes.user.profile,
    icon: User,
  },
];

export function UserBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-32px)] max-w-[430px] -translate-x-1/2 rounded-[28px] border border-white/70 bg-white/85 px-3 py-2 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === routes.user.home
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition",
                isActive
                  ? "bg-slate-950 text-white shadow-lg shadow-slate-900/15"
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
