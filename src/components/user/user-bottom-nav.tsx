"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Map, Trophy, User } from "lucide-react";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import styles from "./user-phone-shell.module.css";

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
      routes.user.myChallenges,
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
    <nav className={styles.bottomNav} aria-label="Основная навигация">
      <span className={styles.bottomNavGlass} aria-hidden="true" />
      <span className={styles.bottomNavShine} aria-hidden="true" />

      <div className={styles.bottomNavGrid}>
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
              scroll={false}
              className={cn(
                styles.bottomNavItem,
                isActive && styles.bottomNavItemActive,
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={styles.bottomNavIconWrap}>
                <Icon
                  className={styles.bottomNavIcon}
                  strokeWidth={isActive ? 2.6 : 2.15}
                />
              </span>

              <span className={styles.bottomNavLabel}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}