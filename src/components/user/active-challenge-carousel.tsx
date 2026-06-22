"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, type UIEvent } from "react";
import type { Challenge } from "@/data/challenges";
import { routes } from "@/lib/routes";
import { glassPanelClasses, glassPillClasses } from "@/components/ui/glass";
import styles from "./user-home.module.css";

export function ActiveChallengeCarousel({ challenges }: { challenges: Challenge[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function moveTo(index: number) {
    const nextIndex = Math.max(0, Math.min(challenges.length - 1, index));
    const carousel = carouselRef.current;
    if (!carousel) return;
    carousel.scrollTo({ left: nextIndex * (carousel.clientWidth + 12), behavior: "smooth" });
    setActiveIndex(nextIndex);
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const carousel = event.currentTarget;
    const nextIndex = Math.round(carousel.scrollLeft / (carousel.clientWidth + 12));
    if (nextIndex !== activeIndex) setActiveIndex(nextIndex);
  }

  return (
    <div className={styles.carouselBlock}>
      <div ref={carouselRef} className={styles.activeCarousel} onScroll={handleScroll}>
        {challenges.map((challenge) => {
          const progress = challenge.progress ?? { current: 0, total: 1, label: "Можно начать" };
          const percent = Math.min(100, Math.round((progress.current / progress.total) * 100));
          const href = challenge.id === "coffee-route" ? routes.user.activeChallenge : routes.user.challengeDetail(challenge.id);
          const visualTone =
            challenge.category === "Кофе"
              ? styles.visualCoffee
              : challenge.category === "Фитнес"
                ? styles.visualFitness
                : styles.visualDefault;
          return (
            <Link key={challenge.id} href={href} className={`${styles.activeCard} ${glassPanelClasses}`}>
              <div className={`${styles.challengeVisual} ${visualTone} backdrop-blur-[14px] backdrop-saturate-[150%]`}>
                <span>{challenge.emoji}</span>
                <small>{challenge.category}</small>
              </div>
              <div className={styles.challengeInfo}>
                <small className={styles.challengeBrand}>{challenge.brandName}</small>
                <h3>{challenge.title}</h3>
                <p>{challenge.condition}</p>
                <div className={styles.progressMeta}><span>Прогресс</span><strong>{progress.current}/{progress.total}</strong></div>
                <div className={styles.compactProgress}><i style={{ width: `${percent}%` }} /></div>
                <div className={styles.cardFooter}><strong className={glassPillClasses}>🪙 {challenge.coinsReward}</strong></div>
              </div>
            </Link>
          );
        })}
      </div>
      {challenges.length > 1 ? (
        <div className={styles.carouselControls}>
          <button type="button" aria-label="Предыдущий челлендж" disabled={activeIndex === 0} onClick={() => moveTo(activeIndex - 1)}><ChevronLeft size={15} /></button>
          <div className={styles.carouselDots}>
            {challenges.map((challenge, index) => <button key={challenge.id} type="button" aria-label={`Открыть челлендж ${index + 1}`} className={index === activeIndex ? styles.activeDot : ""} onClick={() => moveTo(index)} />)}
          </div>
          <button type="button" aria-label="Следующий челлендж" disabled={activeIndex === challenges.length - 1} onClick={() => moveTo(activeIndex + 1)}><ChevronRight size={15} /></button>
        </div>
      ) : null}
    </div>
  );
}
