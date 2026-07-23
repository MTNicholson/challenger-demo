"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Coins, Footprints, MapPin, Search, ShoppingBag, SlidersHorizontal, Target, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Challenge } from "@/data/challenges";
import { useCurrentUser } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import { useUserChallengeStates } from "@/lib/user-challenge-storage";
import sortStyles from "../brands/user-brands.module.css";
import styles from "./user-challenges.module.css";

const categories = ["Все", "Новые", "Еда", "Фитнес", "Beauty", "Книги"];
const sortOptions = [
  { value: "newest", label: "По новизне" },
  { value: "alphabet", label: "По алфавиту" },
  { value: "reward", label: "По награде" },
  { value: "popular", label: "Популярные" },
  { value: "ending", label: "Скоро завершатся" },
] as const;
type SortValue = (typeof sortOptions)[number]["value"];

function getChallengeImage(challenge: Challenge) {
  const imageFields = challenge as Challenge & {
    heroImageUrl?: string;
    coverImageUrl?: string;
  };

  return imageFields.heroImageUrl ?? challenge.image ?? imageFields.coverImageUrl ?? null;
}

function ChallengeCardImage({ challenge }: { challenge: Challenge }) {
  const challengeImage = getChallengeImage(challenge);

  if (challengeImage) {
    return (
      <Image
        src={challengeImage}
        alt={`Изображение челленджа «${challenge.title}»`}
        fill
        sizes="(max-width: 639px) 100vw, 440px"
        unoptimized={challengeImage.startsWith("blob:")}
        className={styles.cardImage}
      />
    );
  }

  return <div className={styles.cardFallback} aria-hidden />;
}

function GoalIcon({ type }: { type: Challenge["type"] }) {
  if (type === "steps") return <Footprints aria-hidden size={13} />;
  if (type === "coins") return <ShoppingBag aria-hidden size={13} />;
  if (type === "qr_visit" || type === "visit_series") return <MapPin aria-hidden size={13} />;
  return <Target aria-hidden size={13} />;
}

function formatDaysLeft(daysLeft: number) {
  const remainder = daysLeft % 100;
  const lastDigit = daysLeft % 10;
  const suffix = remainder >= 11 && remainder <= 14 ? "дней" : lastDigit === 1 ? "день" : lastDigit >= 2 && lastDigit <= 4 ? "дня" : "дней";
  return `${daysLeft} ${suffix}`;
}

function ChallengeCard({ challenge }: { challenge: Challenge }) {
  const goalLine = challenge.progress?.label ?? challenge.condition;
  const description = challenge.shortDescription ?? challenge.description;

  return (
    <Link href={routes.user.challengeDetail(challenge.id)} className={styles.challengeCard}>
      <ChallengeCardImage challenge={challenge} />
      <div className={styles.cardShade} />
      <div className={styles.cardOverlay}>
        <span className={styles.cardBrand}>{challenge.brandName}</span>
        <h2>{challenge.title}</h2>
        <div className={styles.cardDetails}>
          <p className={styles.cardDescription}>{description}</p>
          <div className={styles.cardMetaRow}>
            <div className={styles.cardMeta}>
              <span><GoalIcon type={challenge.type} />{goalLine}</span>
              <span><CalendarDays aria-hidden size={13} />{formatDaysLeft(challenge.daysLeft)}</span>
            </div>
            <span className={styles.reward}>
              <Coins aria-hidden size={12} />
              {challenge.coinsReward}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function ChallengeGrid({ challenges }: { challenges: Challenge[] }) {
  return (
    <section className={styles.catalog} aria-label="Список челленджей">
      {challenges.map((challenge) => <ChallengeCard key={challenge.id} challenge={challenge} />)}
    </section>
  );
}

export function UserChallengesClient({ challenges }: { challenges: Challenge[] }) {
  const { user } = useCurrentUser();
  const { states } = useUserChallengeStates(user?.id);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все");
  const [sortOpen, setSortOpen] = useState(false);
  const [sort, setSort] = useState<SortValue | null>(null);
  const orderedChallenges = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filtered = challenges
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
      })
      .filter((challenge) => {
        const matchesCategory = category === "Все" || (category === "Новые" ? !challenge.isActive : challenge.category === category);
        const searchable = `${challenge.title} ${challenge.brandName} ${challenge.category}`.toLocaleLowerCase();
        return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
      });

    if (!sort) return filtered;

    return [...filtered].sort((left, right) => {
      if (sort === "alphabet") return left.title.localeCompare(right.title, "ru");
      if (sort === "reward") return right.coinsReward - left.coinsReward;
      if (sort === "popular") return right.participants - left.participants;
      if (sort === "ending") return left.daysLeft - right.daysLeft;
      return new Date(right.startDate ?? 0).getTime() - new Date(left.startDate ?? 0).getTime();
    });
  }, [category, challenges, query, sort, states]);
  const sortLabel = sortOptions.find((option) => option.value === sort)?.label;

  return (
    <main className={styles.catalogPage}>
      <header className={styles.pageHeader}>
        <h1>Челленджи</h1>
      </header>
      <div className={styles.controlRow}>
        <div className={sortStyles.sortWrap}>
          <button
            type="button"
            className={styles.filterButton}
            aria-expanded={sortOpen}
            aria-haspopup="dialog"
            aria-label="Открыть сортировку"
            onClick={() => setSortOpen((value) => !value)}
          >
            <SlidersHorizontal aria-hidden size={19} />
          </button>
          {sortOpen ? (
            <div className={sortStyles.sortPopover}>
              <div className={sortStyles.sortTitle}>Сортировка</div>
              <div className={sortStyles.sortOptions}>
                {sortOptions.map((option) => (
                  <label key={option.value} className={sortStyles.sortOption}>
                    <input type="radio" name="challenge-sort" checked={sort === option.value} onChange={() => { setSort(option.value); setSortOpen(false); }} />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
              <div className={sortStyles.sortActions}>
                <button type="button" className={sortStyles.sortReset} onClick={() => { setSort(null); setSortOpen(false); }}>Сбросить</button>
              </div>
            </div>
          ) : null}
        </div>
        <label className={styles.searchField}>
          <Search aria-hidden size={18} />
          <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти челлендж" aria-label="Поиск челленджей" />
        </label>
      </div>
      <div className={styles.categories} aria-label="Категории челленджей">
        {sort && sortLabel ? <button type="button" className={sortStyles.sortChip} onClick={() => setSort(null)}>Сортировка: {sortLabel}<X size={13} /></button> : null}
        {categories.map((item) => <button type="button" key={item} className={item === category ? styles.categoryActive : styles.category} onClick={() => setCategory(item)}>{item}</button>)}
      </div>
      <ChallengeGrid challenges={orderedChallenges} />
    </main>
  );
}
