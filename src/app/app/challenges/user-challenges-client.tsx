"use client";

import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { Challenge } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { useCurrentUser } from "@/lib/auth-client";
import { useUserChallengeStates } from "@/lib/user-challenge-storage";
import styles from "./user-challenges.module.css";
import sortStyles from "../brands/user-brands.module.css";

const categories = ["Все", "Новые", "Еда", "Фитнес", "Beauty", "Книги"];
const sortOptions = [
  { value: "newest", label: "По новизне" },
  { value: "alphabet", label: "По алфавиту" },
  { value: "reward", label: "По награде" },
  { value: "popular", label: "Популярные" },
  { value: "ending", label: "Скоро завершатся" },
] as const;
type SortValue = (typeof sortOptions)[number]["value"];

function getVisualClass(challenge: Challenge) {
  if (challenge.category === "Кофе") return styles.visualCoffee;
  if (challenge.category === "Фитнес") return styles.visualFitness;
  if (challenge.category === "Beauty") return styles.visualBeauty;
  if (challenge.category === "Еда") return styles.visualFood;
  if (challenge.category === "Книги") return styles.visualBooks;
  if (challenge.category === "Питомцы") return styles.visualPets;
  return styles.visualDefault;
}

function getChallengeImage(challenge: Challenge) {
  const imageFields = challenge as Challenge & {
    heroImageUrl?: string;
    coverImageUrl?: string;
  };

  return imageFields.heroImageUrl ?? challenge.image ?? imageFields.coverImageUrl ?? null;
}

function ChallengeCardImage({ challenge, size }: { challenge: Challenge; size: "large" | "small" }) {
  const challengeImage = getChallengeImage(challenge);

  if (challengeImage) {
    return <Image src={challengeImage} alt={`Изображение челленджа «${challenge.title}»`} fill sizes={size === "large" ? "(max-width: 639px) 100vw, 440px" : "(max-width: 639px) 50vw, 220px"} unoptimized={challengeImage.startsWith("blob:")} className={styles.cardImage} />;
  }

  return <div className={`${styles.cardFallback} ${getVisualClass(challenge)}`} aria-hidden>
    <span>{challenge.emoji}</span>
  </div>;
}

function LargeChallengeCard({ challenge }: { challenge: Challenge }) {
  const progressPercent = challenge.progress ? Math.min((challenge.progress.current / challenge.progress.total) * 100, 100) : 0;
  return <Link href={routes.user.challengeDetail(challenge.id)} className={styles.largeCard}>
    <ChallengeCardImage challenge={challenge} size="large" />
    <div className={styles.cardShade} />
    <div className={`${styles.cardOverlay} ${styles.largeOverlay}`}><span className={styles.cardBrand}>{challenge.brandName}</span><h2>{challenge.title}</h2><p className={styles.cardSummary}>{challenge.condition}</p>{challenge.progress ? <div className={styles.progressBlock}><div><span>Прогресс</span><strong>{challenge.progress.current}/{challenge.progress.total}</strong></div><i><span style={{ width: `${progressPercent}%` }} /></i></div> : <p className={styles.description}>{challenge.description}</p>}<strong className={styles.reward}>🪙 {challenge.coinsReward}</strong></div>
  </Link>;
}

function SmallChallengeCard({ challenge, size }: { challenge: Challenge; size: "tall" | "compact" }) {
  return <Link href={routes.user.challengeDetail(challenge.id)} className={`${styles.smallCard} ${size === "tall" ? styles.smallTall : styles.smallCompact}`}>
    <ChallengeCardImage challenge={challenge} size="small" />
    <div className={styles.cardShade} />
    <div className={`${styles.cardOverlay} ${styles.smallOverlay}`}><small className={styles.cardBrand}>{challenge.brandName}</small><h3>{challenge.title}</h3>{size === "tall" ? <p className={styles.cardSummary}>{challenge.condition}</p> : null}<strong className={styles.reward}>🪙 {challenge.coinsReward}</strong></div>
  </Link>;
}

function StaggeredCards({ challenges }: { challenges: Challenge[] }) {
  const [first, second, third, fourth] = challenges;
  return <div className={styles.staggeredGrid}>
    <div className={styles.staggeredColumn}>{first ? <SmallChallengeCard challenge={first} size="compact" /> : null}{third ? <SmallChallengeCard challenge={third} size="tall" /> : null}</div>
    <div className={styles.staggeredColumn}>{second ? <SmallChallengeCard challenge={second} size="tall" /> : null}{fourth ? <SmallChallengeCard challenge={fourth} size="compact" /> : null}</div>
  </div>;
}

function ChallengeGrid({ challenges }: { challenges: Challenge[] }) {
  return <section className={styles.catalog} aria-label="Список челленджей">
    {challenges[0] ? <LargeChallengeCard challenge={challenges[0]} /> : null}
    <StaggeredCards challenges={challenges.slice(1, 5)} />
    {challenges[5] ? <LargeChallengeCard challenge={challenges[5]} /> : null}
    <StaggeredCards challenges={challenges.slice(6, 10)} />
  </section>;
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
    const filtered = challenges.map((challenge) => {
      const state = states.find((item) => item.challengeId === challenge.id);
      return { ...challenge, isActive: state?.isActive ?? false, progress: state?.isActive ? { current: state.progressCurrent, total: state.progressTotal, label: `${state.progressCurrent} из ${state.progressTotal}` } : undefined };
    }).filter((challenge) => {
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

  return <main className={styles.catalogPage}>
    <div className={styles.controlRow}>
      <div className={sortStyles.sortWrap}>
        <button type="button" className={styles.filterButton} aria-expanded={sortOpen} aria-haspopup="dialog" aria-label="Открыть сортировку" onClick={() => setSortOpen((value) => !value)}><SlidersHorizontal aria-hidden size={19} /></button>
        {sortOpen ? <div className={sortStyles.sortPopover}><div className={sortStyles.sortTitle}>Сортировка</div><div className={sortStyles.sortOptions}>{sortOptions.map((option) => <label key={option.value} className={sortStyles.sortOption}><input type="radio" name="challenge-sort" checked={sort === option.value} onChange={() => { setSort(option.value); setSortOpen(false); }} /><span>{option.label}</span></label>)}</div><div className={sortStyles.sortActions}><button type="button" className={sortStyles.sortReset} onClick={() => { setSort(null); setSortOpen(false); }}>Сбросить</button></div></div> : null}
      </div>
      <label className={styles.searchField}><Search aria-hidden size={18} /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Найти челлендж" aria-label="Поиск челленджей" /></label>
    </div>
    <div className={styles.categories} aria-label="Категории челленджей">
      {sort && sortLabel ? <button type="button" className={sortStyles.sortChip} onClick={() => setSort(null)}>Сортировка: {sortLabel}<X size={13} /></button> : null}
      {categories.map((item) => <button type="button" key={item} className={item === category ? styles.categoryActive : styles.category} onClick={() => setCategory(item)}>{item}</button>)}
    </div>
    <ChallengeGrid challenges={orderedChallenges} />
  </main>;
}
