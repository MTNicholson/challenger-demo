"use client";

import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Check, Gift, MapPin, Trophy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import type { Challenge } from "@/data/challenges";
import type { Location } from "@/data/locations";
import styles from "./challenge-detail-screen.module.css";

type ChallengeDetailCardProps = {
  challenge: Challenge;
  locations: Location[];
  isActive?: boolean;
  progress?: { current: number; total: number };
  heroControls?: ReactNode;
  brandHref?: string;
};

export function ChallengeDetailCard({
  challenge,
  locations,
  isActive = false,
  progress,
  heroControls,
  brandHref,
}: ChallengeDetailCardProps) {
  const detailRef = useRef<HTMLElement>(null);
  const [scrollAmount, setScrollAmount] = useState(0);
  const progressTotal = progress?.total ?? challenge.progress?.total ?? 1;
  const progressCurrent = isActive ? progress?.current ?? 0 : 0;
  const progressPercent = Math.min(100, (progressCurrent / progressTotal) * 100);
  const remaining = Math.max(0, progressTotal - progressCurrent);
  const periodText = challenge.startDate && challenge.endDate ? `${challenge.startDate} — ${challenge.endDate}` : "24 июня — 31 июля";

  useEffect(() => {
    const viewport = detailRef.current?.closest<HTMLElement>("[data-user-scroll-viewport]");
    if (!viewport) return;

    const updateScrollAmount = () => {
      setScrollAmount(Math.min(1, Math.max(0, viewport.scrollTop / 220)));
    };

    updateScrollAmount();
    viewport.addEventListener("scroll", updateScrollAmount, { passive: true });
    return () => viewport.removeEventListener("scroll", updateScrollAmount);
  }, []);

  return (
    <section
      ref={detailRef}
      className={styles.detail}
      style={{ "--challenge-hero-scroll": scrollAmount } as CSSProperties}
    >
      <section className={styles.hero}>
        <Image
          src={challenge.image ?? "/landing/challenges/coffee.webp"}
          alt={challenge.title}
          fill
          priority
          sizes="(max-width: 639px) 100vw, 390px"
          className={styles.heroImage}
        />
        <div className={styles.heroShade} />
        {heroControls}
      </section>

      <div className={styles.contentFlow}>
        <div className={styles.brandIsland} aria-label={challenge.brandName}>
          {challenge.brandLogo ? (
            <Image
              src={challenge.brandLogo}
              alt={`Логотип ${challenge.brandName}`}
              fill
              sizes="64px"
              unoptimized={challenge.brandLogo.startsWith("blob:")}
              className={styles.brandLogo}
            />
          ) : <span>{challenge.emoji}</span>}
        </div>
        <section className={styles.intro}>
          {brandHref ? <Link href={brandHref} className={styles.brand}>{challenge.brandName}</Link> : <p className={styles.brand}>{challenge.brandName}</p>}
          <h1>{challenge.title}</h1>
          <p className={styles.shortDescription}>{challenge.shortDescription ?? challenge.condition}</p>
          <p className={styles.description}>{challenge.fullDescription ?? challenge.description}</p>
        </section>

        <section className={styles.surface}>
          <div className={styles.sectionHeading}>
            <h2>Награда</h2>
            <strong>{challenge.coinsReward} баллов</strong>
          </div>
          <div className={styles.rewardContent}>
            <span><Gift size={20} /></span>
            <div><small>Подарок от бренда</small><p>{challenge.reward}</p></div>
          </div>
        </section>

        {isActive ? (
          <section className={styles.surface}>
            <div className={styles.sectionHeading}>
              <h2>Прогресс</h2>
              <strong>{progressCurrent}/{progressTotal}</strong>
            </div>
            <div className={styles.progressTrack}><i style={{ width: `${progressPercent}%` }} /></div>
            <div className={styles.progressMeta}>
              <span>{remaining ? `${remaining} ${remaining === 1 ? "визит остался" : "визита осталось"}` : "Все условия выполнены"}</span>
              <span>Осталось {challenge.daysLeft} дн.</span>
            </div>
          </section>
        ) : null}

        <section className={styles.surface}>
          <div className={styles.sectionHeading}><h2>Период выполнения</h2></div>
          <div className={styles.periodContent}>
            <span><CalendarDays size={20} /></span>
            <div><p>{periodText}</p><small>Осталось {challenge.daysLeft} дн.</small></div>
          </div>
        </section>

        <section className={styles.surface}>
          <div className={styles.sectionHeading}><h2>{locations.length ? "Адреса для визитов" : "Условия выполнения"}</h2></div>
          <div className={styles.checklist}>
            {locations.length ? locations.map((location, index) => {
              const completed = isActive && index < progressCurrent;
              return (
                <div className={styles.checkItem} key={location.id}>
                  <span className={completed ? styles.checkDone : styles.checkPending}>{completed ? <Check size={16} /> : index + 1}</span>
                  <div><p>{location.title}</p><small>{completed ? location.visitTime : location.address}</small></div>
                  {!completed ? <MapPin size={16} /> : null}
                </div>
              );
            }) : (
              <div className={styles.checkItem}><span className={styles.checkPending}><Trophy size={16} /></span><div><p>{challenge.condition}</p><small>Выполните условие до окончания челленджа</small></div></div>
            )}
          </div>
        </section>
      </div>
    </section>
  );
}
