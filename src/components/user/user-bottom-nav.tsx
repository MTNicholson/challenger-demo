"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Building2, Home, Map, Trophy, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import styles from "./user-phone-shell.module.css";

const items = [
  {
    label: "Челленджи",
    href: routes.user.challenges,
    icon: Trophy,
    activePaths: [routes.user.challenges],
  },
  {
    label: "Бренды",
    href: routes.user.brands,
    icon: Building2,
    activePaths: [routes.user.brands],
  },
  {
    label: "Главная",
    href: routes.user.home,
    icon: Home,
    activePaths: [routes.user.home],
    primary: true,
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
    activePaths: [
      routes.user.profile,
      routes.user.coins,
      routes.user.favorites,
      routes.user.rewards,
    ],
  },
];

type UserBottomNavProps = {
  className?: string;
  isPreview?: boolean;
};

export function UserBottomNav({ className, isPreview = false }: UserBottomNavProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const myChallengesSource = searchParams.get("from") === "profile" ? routes.user.profile : routes.user.home;

  return (
    <nav className={cn(styles.bottomNav, className)} aria-label="Основная навигация">
      <span className={styles.bottomNavGlass} aria-hidden="true" />
      <span className={styles.bottomNavShine} aria-hidden="true" />

      <div className={styles.bottomNavGrid}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === routes.user.myChallenges
            ? item.href === myChallengesSource
            : item.activePaths.some((activePath) =>
            activePath === routes.user.home
              ? pathname === activePath
              : pathname === activePath || pathname.startsWith(`${activePath}/`),
          );

          return (
            <Link
              key={item.href}
              href={item.href}
              scroll={false}
              className={cn(
                item.primary ? styles.bottomNavPrimary : styles.bottomNavItem,
                isActive && styles.bottomNavItemActive,
                item.primary && isActive && styles.bottomNavPrimaryActive,
              )}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.primary ? item.label : undefined}
              aria-disabled={isPreview || undefined}
              onClick={isPreview ? (event) => {
                event.preventDefault();
                event.stopPropagation();
              } : undefined}
            >
              <span className={styles.bottomNavIconWrap}>
                <Icon
                  className={styles.bottomNavIcon}
                  strokeWidth={isActive ? 2.6 : 2.15}
                />
              </span>

              {item.primary ? null : <span className={styles.bottomNavLabel}>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
