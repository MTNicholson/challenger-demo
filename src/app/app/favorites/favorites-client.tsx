"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { challenges } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { useCurrentUser } from "@/lib/auth-client";
import { useFavoriteItems } from "@/lib/favorite-storage";
import { useUserChallengeStates } from "@/lib/user-challenge-storage";
import type { PublicBrandSummary } from "@/lib/public-brands";
import { FavoriteToggleButton } from "@/components/user/favorite-toggle-button";
import styles from "@/components/user/collection-screen.module.css";

type Filter = "all" | "challenge" | "brand";

type FavoritesClientProps = {
  brands: PublicBrandSummary[];
};

function getInitial(name: string) {
  return name.trim()[0]?.toLocaleUpperCase() ?? "Б";
}

function getEmptyTitle(filter: Filter) {
  if (filter === "challenge") return "Вы ещё не добавили челленджи";
  if (filter === "brand") return "Вы ещё не добавили бренды";
  return "Пока нет избранного";
}

export function FavoritesClient({ brands }: FavoritesClientProps) {
  const { user } = useCurrentUser();
  const { ready: challengesReady, states } = useUserChallengeStates(user?.id);
  const { ready: favoritesReady, items } = useFavoriteItems(user?.id);
  const [filter, setFilter] = useState<Filter>("all");

  const challengeFavorites = states.flatMap((state) => {
    if (!state.isFavorite) return [];
    const challenge = challenges.find((item) => item.id === state.challengeId);
    const favoriteItem = items.find((item) => item.type === "challenge" && item.id === state.challengeId);
    return challenge
      ? [{
          type: "challenge" as const,
          id: challenge.id,
          addedAt: state.favoriteAddedAt ?? favoriteItem?.addedAt ?? state.activatedAt ?? "1970-01-01T00:00:00.000Z",
          challenge,
          state,
        }]
      : [];
  });

  const brandFavorites = items.flatMap((item) => {
    if (item.type !== "brand") return [];
    const brand = brands.find((candidate) => candidate.id === item.id);
    return brand ? [{ type: "brand" as const, id: brand.id, addedAt: item.addedAt, brand }] : [];
  });

  const visibleItems = [...challengeFavorites, ...brandFavorites]
    .filter((item) => filter === "all" || item.type === filter)
    .sort((a, b) => Date.parse(b.addedAt) - Date.parse(a.addedAt));
  const isReady = challengesReady && favoritesReady;

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={routes.user.profile} aria-label="Назад"><ArrowLeft size={18} /></Link>
        <div><small>Сохранённое</small><h1>Избранное</h1></div>
      </header>

      <div className={styles.chips} aria-label="Тип избранного">
        <button type="button" className={filter === "all" ? styles.chipActive : undefined} onClick={() => setFilter("all")}>Все</button>
        <button type="button" className={filter === "challenge" ? styles.chipActive : undefined} onClick={() => setFilter("challenge")}>Челленджи</button>
        <button type="button" className={filter === "brand" ? styles.chipActive : undefined} onClick={() => setFilter("brand")}>Бренды</button>
      </div>

      <section className={styles.list}>
        {visibleItems.map((item) => {
          if (item.type === "brand") {
            const category = item.brand.category ?? "Бренд";
            const city = item.brand.city ?? "Город не указан";

            return (
              <Link href={`${routes.user.brandDetail(item.brand.id)}?from=favorites`} className={styles.brandFavoriteCard} key={`brand-${item.id}`}>
                <span
                  className={styles.brandVisual}
                  style={item.brand.logoUrl ? { backgroundImage: `url(${item.brand.logoUrl})` } : undefined}
                >
                  {item.brand.logoUrl ? null : getInitial(item.brand.name)}
                </span>
                <div>
                  <small>{category} · {city}</small>
                  <h2>{item.brand.name}</h2>
                  <p>{item.brand.description ?? item.brand.address ?? "Следите за заданиями и наградами бренда"}</p>
                  <b>{item.brand.challengesCount} челленджей</b>
                </div>
                <FavoriteToggleButton
                  id={item.brand.id}
                  type="brand"
                  className={styles.favoriteHeartButton}
                  activeClassName={styles.favoriteHeartButtonActive}
                />
                <ChevronRight className={styles.chevron} size={17} />
              </Link>
            );
          }

          return (
            <Link href={`${routes.user.challengeDetail(item.challenge.id)}?from=favorites`} className={styles.favoriteCard} key={`challenge-${item.id}`}>
              <span className={styles.challengeVisual}>{item.challenge.emoji}</span>
              <div>
                <small>{item.challenge.brandName}</small>
                <h2>{item.challenge.title}</h2>
                <p>{item.challenge.condition}</p>
                {item.state.isActive ? <b>В процессе</b> : null}
              </div>
              <span className={styles.favoriteHeart}><Heart size={15} fill="currentColor" /></span>
              <ChevronRight className={styles.chevron} size={17} />
            </Link>
          );
        })}
      </section>

      {isReady && visibleItems.length === 0 ? (
        <section className={styles.empty}>
          <span><Sparkles size={25} /></span>
          <h2>{getEmptyTitle(filter)}</h2>
          <p>Добавляйте челленджи и бренды, чтобы быстро возвращаться к ним</p>
          <Link href={filter === "brand" ? routes.user.brands : routes.user.challenges}>Перейти в каталог</Link>
        </section>
      ) : null}
    </main>
  );
}
