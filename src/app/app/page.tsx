import Link from "next/link";
import { Flame, Sparkles } from "lucide-react";
import { routes } from "@/lib/routes";
import { challenges, getActiveChallenges } from "@/data/challenges";
import { demoUser } from "@/data/user";
import { CoinBalanceCard } from "@/components/user/coin-balance-card";
import { HomeHeader } from "@/components/user/home-header";
import { ActiveChallengeCarousel } from "@/components/user/active-challenge-carousel";
import { NearbyChallengeCarousel } from "@/components/user/nearby-challenge-carousel";
import { glassPanelClasses, glassPillClasses } from "@/components/ui/glass";
import styles from "@/components/user/user-home.module.css";

export default function UserHomePage() {
  const activeChallenges = getActiveChallenges();
  const nearbyCandidates = challenges
    .filter((challenge) => challenge.distanceKm)
    .sort((a, b) => (a.distanceKm ?? 0) - (b.distanceKm ?? 0));
  const nearbyChallenges = nearbyCandidates
    .filter(
      (challenge, index) =>
        nearbyCandidates.findIndex((item) => item.brandId === challenge.brandId) === index,
    )
    .slice(0, 4);
  const recommendations = challenges.filter((challenge) => !challenge.isActive).slice(0, 5);

  return (
    <main className={styles.homePage}>
      <HomeHeader name={demoUser.name} />

      <CoinBalanceCard href={routes.user.coins} coins={demoUser.coins} />

      <section>
        <div className={styles.sectionHeading}>
          <h2>Активные челленджи</h2>
          <Link href={routes.user.myChallenges}>Смотреть все</Link>
        </div>
        <ActiveChallengeCarousel challenges={activeChallenges} />
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
