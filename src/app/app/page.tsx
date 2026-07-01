"use client";

import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { routes } from "@/lib/routes";
import { challenges } from "@/data/challenges";
import { useCurrentUser } from "@/lib/auth-client";
import { useUserChallengeStates } from "@/lib/user-challenge-storage";
import { CoinBalanceCard } from "@/components/user/coin-balance-card";
import { HomeHeader } from "@/components/user/home-header";
import { ActiveChallengeCarousel } from "@/components/user/active-challenge-carousel";
import { NearbyChallengeCarousel } from "@/components/user/nearby-challenge-carousel";
import { glassPanelClasses, glassPillClasses } from "@/components/ui/glass";
import styles from "@/components/user/user-home.module.css";

export default function UserHomePage() {
  const { user } = useCurrentUser();
  const { states } = useUserChallengeStates(user?.id);
  const activeIds = new Set(states.filter((state) => state.isActive).map((state) => state.challengeId));
  const activeChallenges = states.flatMap((state) => {
    if (!state.isActive) return [];
    const challenge = challenges.find((item) => item.id === state.challengeId);
    return challenge
      ? [{ ...challenge, progress: { current: state.progressCurrent, total: state.progressTotal, label: `${state.progressCurrent} из ${state.progressTotal}` } }]
      : [];
  });
  const nearbyCandidates = challenges
    .filter((challenge) => challenge.distanceKm)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  const nearbyChallenges = nearbyCandidates
    .filter(
      (challenge, index) =>
        nearbyCandidates.findIndex((item) => item.brandId === challenge.brandId) === index,
    )
    .slice(0, 4);
  const recommendations = challenges.filter((challenge) => !activeIds.has(challenge.id)).slice(0, 5);

  return (
    <main className={styles.homePage}>
      <HomeHeader name={user?.name} />

      <CoinBalanceCard href={routes.user.coins} coins={user?.coinsBalance ?? 0} />

      <section>
        <div className={styles.sectionHeading}>
          <h2>Активные челленджи</h2>
          <Link href={routes.user.myChallenges}>Смотреть все</Link>
        </div>
        {activeChallenges.length ? (
          <ActiveChallengeCarousel challenges={activeChallenges} />
        ) : (
          <Link href={routes.user.challenges} className={`${styles.dailyTask} ${glassPanelClasses}`}>
            <span><Sparkles size={19} /></span>
            <div><strong>Пока здесь тихо</strong><p>Выберите первый челлендж в каталоге</p></div>
          </Link>
        )}
      </section>

      <Link href={routes.user.map} className={`${styles.dailyTask} ${glassPanelClasses}`}>
        <span><Flame size={19} /></span>
        <div><strong>Задача дня</strong><p>Открой карту и выбери место рядом</p></div>
        <b className={glassPillClasses}>🪙 10</b>
      </Link>

      <section>
        <div className={styles.sectionHeading}><h2>Рядом с тобой</h2></div>
        <NearbyChallengeCarousel challenges={nearbyChallenges} />
      </section>

      <section>
        <div className={styles.sectionHeading}><h2>Рекомендации</h2></div>
        <div className={styles.recommendationList}>
          {recommendations.map((challenge) => (
            <Link key={challenge.id} href={routes.user.challengeDetail(challenge.id)} className={`${styles.recommendationCard} ${glassPanelClasses}`}>
              <div className={styles.recommendationVisual}><span>{challenge.emoji}</span></div>
              <div className={styles.recommendationCopy}>
                <small>{challenge.brandName}</small>
                <h3>{challenge.title}</h3>
                <p>{challenge.condition}</p>
                <strong className={glassPillClasses}>🪙 {challenge.coinsReward}</strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <div className={styles.recommendationHint}>
        <Sparkles size={18} />
        Чем больше челленджей закрываешь, тем точнее становятся рекомендации.
      </div>
    </main>
  );
}
