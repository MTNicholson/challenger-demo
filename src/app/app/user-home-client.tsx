"use client";

import Image from "next/image";
import Link from "next/link";
import { Coins, Flame, Sparkles } from "lucide-react";
import type { Challenge } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { useCurrentUser } from "@/lib/auth-client";
import { useUserChallengeStates } from "@/lib/user-challenge-storage";
import { CoinBalanceCard } from "@/components/user/coin-balance-card";
import { HomeHeader } from "@/components/user/home-header";
import { ActiveChallengeCarousel } from "@/components/user/active-challenge-carousel";
import { NearbyChallengeCarousel } from "@/components/user/nearby-challenge-carousel";
import { glassPanelClasses, glassPillClasses } from "@/components/ui/glass";
import styles from "@/components/user/user-home.module.css";

export function UserHomeClient({ challenges }: { challenges: Challenge[] }) {
  const { user } = useCurrentUser();
  const { states } = useUserChallengeStates(user?.id);
  const activeIds = new Set(states.filter((state) => state.isActive).map((state) => state.challengeId));
  const activeChallenges = states.flatMap((state) => {
    if (!state.isActive) return [];
    const challenge = challenges.find((item) => item.id === state.challengeId);
    return challenge ? [{ ...challenge, progress: { current: state.progressCurrent, total: state.progressTotal, label: `${state.progressCurrent} из ${state.progressTotal}` } }] : [];
  });
  const nearbyChallenges = challenges.slice(0, 4);
  const recommendations = challenges.filter((challenge) => !activeIds.has(challenge.id)).slice(0, 5);

  return (
    <main className={styles.homePage}>
      <HomeHeader name={user?.name} />
      <CoinBalanceCard href={routes.user.coins} coins={user?.coinsBalance ?? 0} />
      <Link href={routes.user.map} className={`${styles.dailyTask} ${styles.dailyTaskHighlight} ${glassPanelClasses}`}><span><Flame size={19} /></span><div><strong>Задача дня</strong><p>Открой карту и выбери место рядом</p></div><b className={glassPillClasses}>🪙 10</b></Link>
      <section>
        <div className={styles.sectionHeading}><h2>Активные челленджи</h2><Link href={`${routes.user.myChallenges}?from=home`}>Смотреть все</Link></div>
        {activeChallenges.length ? <ActiveChallengeCarousel challenges={activeChallenges} /> : <Link href={routes.user.challenges} className={`${styles.dailyTask} ${glassPanelClasses}`}><span><Sparkles size={19} /></span><div><strong>Пока здесь тихо</strong><p>Выберите первый челлендж в каталоге</p></div></Link>}
      </section>
      <section><div className={styles.sectionHeading}><h2>Рядом с тобой</h2></div>{nearbyChallenges.length ? <NearbyChallengeCarousel challenges={nearbyChallenges} /> : <EmptyChallenges />}</section>
      <section>
        <div className={styles.sectionHeading}><h2>Рекомендации</h2></div>
        <div className={styles.recommendationList}>{recommendations.map((challenge) => <Link key={challenge.id} href={routes.user.challengeDetail(challenge.id)} className={styles.recommendationCard}>{challenge.image ? <Image src={challenge.image} alt="" fill sizes="(max-width: 639px) 100vw, 440px" unoptimized={challenge.image.startsWith("blob:")} className={styles.recommendationImage} /> : <div className={styles.recommendationFallback} aria-hidden />}<div className={styles.recommendationGlass}><small>{challenge.brandName}</small><h3>{challenge.title}</h3><p>{challenge.shortDescription ?? challenge.description}</p><span>{challenge.daysLeft} дн. · {challenge.category}</span></div><strong className={styles.recommendationPoints}><Coins aria-hidden size={12} />{challenge.coinsReward}</strong></Link>)}</div>
        {!recommendations.length ? <EmptyChallenges /> : null}
      </section>
      <div className={styles.recommendationHint}><Sparkles size={18} />Чем больше челленджей закрываешь, тем точнее становятся рекомендации.</div>
    </main>
  );
}

function EmptyChallenges() {
  return <Link href={routes.user.challenges} className={`${styles.dailyTask} ${glassPanelClasses}`}><span><Sparkles size={19} /></span><div><strong>Новые челленджи скоро появятся</strong><p>Бренды готовят для вас новые активности.</p></div></Link>;
}
