"use client";

import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { challenges, type Challenge } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { useCurrentDemoUser } from "@/lib/demo-auth";
import { useUserChallengeStates } from "@/lib/user-challenge-storage";
import styles from "./user-challenges.module.css";

const categories = ["Все", "Новые", "Еда", "Фитнес", "Beauty", "Книги"];

const catalogOrder = [
  "coffee-route",
  "ten-thousand-steps",
  "beauty-rewards",
  "sweet-june",
  "book-challenge",
  "dessert-after-six",
  "photo-walk",
  "morning-filter",
  "reading-weekend",
  "stretch-break",
];

function getVisualClass(challenge: Challenge) {
  if (challenge.category === "Кофе") return styles.visualCoffee;
  if (challenge.category === "Фитнес") return styles.visualFitness;
  if (challenge.category === "Beauty") return styles.visualBeauty;
  if (challenge.category === "Еда") return styles.visualFood;
  if (challenge.category === "Книги") return styles.visualBooks;
  if (challenge.category === "Питомцы") return styles.visualPets;
  return styles.visualDefault;
}

function getStatus(challenge: Challenge) {
  if (challenge.isActive) return "В процессе";
  if (challenge.isFeatured) return "Хит";
  return "Новый";
}

function LargeChallengeCard({ challenge }: { challenge: Challenge }) {
  const progressPercent = challenge.progress
    ? Math.min((challenge.progress.current / challenge.progress.total) * 100, 100)
    : 0;

  return (
    <Link
      href={routes.user.challengeDetail(challenge.id)}
      className={styles.largeCard}
    >
      <div className={`${styles.largeVisual} ${getVisualClass(challenge)}`}>
        <span aria-hidden>{challenge.emoji}</span>
        <small>{challenge.category}</small>
      </div>
      <div className={styles.largeCopy}>
        <div className={styles.cardTopline}>
          <span>{challenge.brandName}</span>
          <b>{getStatus(challenge)}</b>
        </div>
        <h2>{challenge.title}</h2>
        <p>{challenge.condition}</p>

        {challenge.progress ? (
          <div className={styles.progressBlock}>
            <div>
              <span>Прогресс</span>
              <strong>
                {challenge.progress.current}/{challenge.progress.total}
              </strong>
            </div>
            <i>
              <span style={{ width: `${progressPercent}%` }} />
            </i>
          </div>
        ) : (
          <p className={styles.description}>{challenge.description}</p>
        )}

        <strong className={styles.reward}>🪙 {challenge.coinsReward}</strong>
      </div>
    </Link>
  );
}

function SmallChallengeCard({
  challenge,
  size,
}: {
  challenge: Challenge;
  size: "tall" | "compact";
}) {
  return (
    <Link
      href={routes.user.challengeDetail(challenge.id)}
      className={`${styles.smallCard} ${size === "tall" ? styles.smallTall : styles.smallCompact}`}
    >
      <div className={`${styles.smallVisual} ${getVisualClass(challenge)}`}>
        <span aria-hidden>{challenge.emoji}</span>
        <b>{getStatus(challenge)}</b>
      </div>
      <div className={styles.smallCopy}>
        <small>{challenge.brandName}</small>
        <h3>{challenge.title}</h3>
        {size === "tall" ? <p>{challenge.condition}</p> : null}
        <strong className={styles.reward}>🪙 {challenge.coinsReward}</strong>
      </div>
    </Link>
  );
}

function StaggeredCards({ challenges }: { challenges: Challenge[] }) {
  const [first, second, third, fourth] = challenges;

  return (
    <div className={styles.staggeredGrid}>
      <div className={styles.staggeredColumn}>
        {first ? <SmallChallengeCard challenge={first} size="compact" /> : null}
        {third ? <SmallChallengeCard challenge={third} size="tall" /> : null}
      </div>
      <div className={styles.staggeredColumn}>
        {second ? <SmallChallengeCard challenge={second} size="tall" /> : null}
        {fourth ? <SmallChallengeCard challenge={fourth} size="compact" /> : null}
      </div>
    </div>
  );
}

export default function UserChallengesPage() {
  const { user } = useCurrentDemoUser();
  const { states } = useUserChallengeStates(user?.id);
  const orderedChallenges = catalogOrder
    .map((id) => challenges.find((challenge) => challenge.id === id))
    .filter((challenge): challenge is Challenge => Boolean(challenge))
    .map((challenge) => {
      const state = states.find((item) => item.challengeId === challenge.id);
      return {
        ...challenge,
        isActive: state?.isActive ?? false,
        progress: state?.isActive
          ? {
              current: state.progressCurrent,
              total: state.progressTotal,
              label: `${state.progressCurrent} из ${state.progressTotal}`,
            }
          : undefined,
      };
    });

  return (
    <main className={styles.catalogPage}>
      <div className={styles.controlRow}>
        <button type="button" className={styles.filterButton} aria-label="Открыть фильтры">
          <SlidersHorizontal aria-hidden size={19} />
        </button>
        <label className={styles.searchField}>
          <Search aria-hidden size={18} />
          <input type="search" placeholder="Найти челлендж" aria-label="Поиск челленджей" />
        </label>
      </div>

      <div className={styles.categories} aria-label="Категории челленджей">
        {categories.map((category, index) => (
          <button
            type="button"
            key={category}
            className={index === 0 ? styles.categoryActive : styles.category}
          >
            {category}
          </button>
        ))}
      </div>

      <section className={styles.catalog} aria-label="Каталог челленджей">
        {orderedChallenges[0] ? (
          <LargeChallengeCard challenge={orderedChallenges[0]} />
        ) : null}
        <StaggeredCards challenges={orderedChallenges.slice(1, 5)} />
        {orderedChallenges[5] ? (
          <LargeChallengeCard challenge={orderedChallenges[5]} />
        ) : null}
        <StaggeredCards challenges={orderedChallenges.slice(6, 10)} />
      </section>
    </main>
  );
}
