"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { useEffect, useRef, useState, type UIEvent } from "react";
import type { Challenge } from "@/data/challenges";
import { routes } from "@/lib/routes";
import styles from "./user-home.module.css";

function formatDistance(distanceKm?: number) {
  if (!distanceKm) return "Рядом";
  return distanceKm < 1 ? `${Math.round(distanceKm * 1000)} м` : `${distanceKm} км`;
}

export function NearbyChallengeCarousel({ challenges }: { challenges: Challenge[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const pauseUntilRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = Math.max(0, challenges.length - 2);

  useEffect(() => {
    if (lastIndex === 0 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      if (Date.now() < pauseUntilRef.current) return;
      const carousel = carouselRef.current;
      if (!carousel) return;
      const nextIndex = activeIndex >= lastIndex ? 0 : activeIndex + 1;
      const card = carousel.querySelector<HTMLElement>("a");
      const step = (card?.offsetWidth ?? carousel.clientWidth / 2) + 10;
      carousel.scrollTo({ left: nextIndex === lastIndex ? carousel.scrollWidth : nextIndex * step, behavior: "smooth" });
      setActiveIndex(nextIndex);
    }, 3800);

    return () => window.clearInterval(timer);
  }, [activeIndex, lastIndex]);

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const carousel = event.currentTarget;
    const card = carousel.querySelector<HTMLElement>("a");
    const step = (card?.offsetWidth ?? carousel.clientWidth / 2) + 10;
    const nextIndex = Math.min(lastIndex, Math.max(0, Math.round(carousel.scrollLeft / step)));
    if (nextIndex !== activeIndex) setActiveIndex(nextIndex);
  }

  return (
    <div>
      <div ref={carouselRef} className={styles.nearbyCarousel} onPointerDown={() => { pauseUntilRef.current = Date.now() + 7000; }} onScroll={handleScroll}>
        {challenges.map((challenge) => (
          <Link key={challenge.id} href={routes.user.challengeDetail(challenge.id)} className={styles.nearbyCard}>
            <div className={styles.nearbyVisual}>{challenge.image ? <Image src={challenge.image} alt="" fill sizes="(max-width: 639px) 50vw, 220px" unoptimized={challenge.image.startsWith("blob:")} className={styles.nearbyImage} /> : <div className={styles.nearbyFallback} aria-hidden />}</div>
            <div className={styles.nearbyCopy}>
              <small>{challenge.brandName}</small>
              <h3>{challenge.title}</h3>
              <p><MapPin size={11} />{formatDistance(challenge.distanceKm)}</p>
            </div>
          </Link>
        ))}
      </div>
      {lastIndex > 0 ? (
        <div className={styles.nearbyDots} aria-label={`Слайд ${activeIndex + 1} из ${lastIndex + 1}`}>
          {Array.from({ length: lastIndex + 1 }).map((_, index) => <span key={index} className={index === activeIndex ? styles.nearbyDotActive : ""} />)}
        </div>
      ) : null}
    </div>
  );
}
