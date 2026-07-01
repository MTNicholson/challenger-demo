"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, Heart, Sparkles } from "lucide-react";
import { challenges } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { useCurrentUser } from "@/lib/auth-client";
import { useUserChallengeStates } from "@/lib/user-challenge-storage";
import styles from "@/components/user/collection-screen.module.css";

export default function FavoritesPage() {
  const { user } = useCurrentUser();
  const { ready, states } = useUserChallengeStates(user?.id);
  const favoriteChallenges = states.flatMap((state) => {
    if (!state.isFavorite) return [];
    const challenge = challenges.find((item) => item.id === state.challengeId);
    return challenge ? [{ challenge, state }] : [];
  });

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={routes.user.profile} aria-label="Назад"><ArrowLeft size={18} /></Link>
        <div><small>Сохранённое</small><h1>Избранное</h1></div>
      </header>

      <div className={styles.chips} aria-label="Тип избранного">
        <button type="button" className={styles.chipActive}>Все</button>
        <button type="button">Челленджи</button>
        <button type="button" disabled>Бренды</button>
      </div>

      <section className={styles.list}>
        {favoriteChallenges.map(({ challenge, state }) => (
          <Link href={routes.user.challengeDetail(challenge.id)} className={styles.favoriteCard} key={challenge.id}>
            <span className={styles.challengeVisual}>{challenge.emoji}</span>
            <div>
              <small>{challenge.brandName}</small>
              <h2>{challenge.title}</h2>
              <p>{challenge.condition}</p>
              {state.isActive ? <b>В процессе</b> : null}
            </div>
            <span className={styles.favoriteHeart}><Heart size={15} fill="currentColor" /></span>
            <ChevronRight className={styles.chevron} size={17} />
          </Link>
        ))}
      </section>

      {ready && favoriteChallenges.length === 0 ? (
        <section className={styles.empty}>
          <span><Sparkles size={25} /></span>
          <h2>Пока ничего нет в избранном</h2>
          <p>Добавляйте челленджи и бренды, чтобы быстро возвращаться к ним</p>
          <Link href={routes.user.challenges}>Перейти в каталог</Link>
        </section>
      ) : null}
    </main>
  );
}
