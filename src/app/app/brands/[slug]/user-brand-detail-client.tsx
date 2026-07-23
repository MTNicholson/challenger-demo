"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, Coins, ExternalLink, Footprints, Globe, MapPin, ShoppingBag, Sparkles, Target } from "lucide-react";
import { useRef, useState } from "react";
import { BrandLocationsList } from "@/components/user/brand-locations-list";
import { FavoriteToggleButton } from "@/components/user/favorite-toggle-button";
import { getBrandCategoryFallback } from "@/lib/brand-visuals";
import { routes } from "@/lib/routes";
import styles from "./user-brand-page.module.css";

type BrandChallenge = {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  category: string | null;
  heroImageUrl: string | null;
  condition: string;
  coinsReward: number;
  daysLeft: number;
  reward: string | null;
  createdAt: string;
};

type BrandLocation = {
  id: string;
  name: string | null;
  city: string;
  address: string;
  fullAddress: string | null;
  lat: number | null;
  lng: number | null;
  description: string | null;
  isMain: boolean;
};

type BrandDetail = {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  website: string | null;
  challenges: BrandChallenge[];
  locations: BrandLocation[];
};

type UserBrandDetailClientProps = {
  brand: BrandDetail;
  userCity?: string | null;
  backHref: string;
};

function getInitial(name: string) {
  return name.trim()[0]?.toLocaleUpperCase() ?? "Б";
}

function formatDaysLeft(daysLeft: number) {
  const remainder = daysLeft % 100;
  const lastDigit = daysLeft % 10;
  const suffix = remainder >= 11 && remainder <= 14 ? "дней" : lastDigit === 1 ? "день" : lastDigit >= 2 && lastDigit <= 4 ? "дня" : "дней";
  return `${daysLeft} ${suffix}`;
}

function getChallengeCategoryLabel(challenge: BrandChallenge) {
  const value = (challenge.category ?? challenge.type ?? "").toLocaleLowerCase();
  const labels: Record<string, string> = {
    activity: "Активность",
    purchase: "Покупки",
    visit: "Посещение",
    qr_visit: "Посещение",
    steps: "Активность",
  };

  return labels[value] ?? challenge.category ?? "Челлендж";
}

function ChallengeGoalIcon({ type, category }: { type: string | null; category: string | null }) {
  const value = `${type ?? ""} ${category ?? ""}`.toLocaleLowerCase();
  if (value.includes("step") || value.includes("activity")) return <Footprints aria-hidden size={13} />;
  if (value.includes("purchase")) return <ShoppingBag aria-hidden size={13} />;
  if (value.includes("visit") || value.includes("qr")) return <MapPin aria-hidden size={13} />;
  return <Target aria-hidden size={13} />;
}

export function UserBrandDetailClient({ brand, userCity, backHref }: UserBrandDetailClientProps) {
  const locationsRef = useRef<HTMLDivElement>(null);
  const [visibleChallengesCount, setVisibleChallengesCount] = useState(3);
  const fallback = getBrandCategoryFallback(brand.category);
  const visibleChallenges = brand.challenges.slice(0, visibleChallengesCount);
  const hasMoreChallenges = visibleChallengesCount < brand.challenges.length;
  const description = brand.description ?? "Скоро бренд добавит описание, задания и награды для гостей.";

  function scrollToLocations() {
    locationsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className={styles.page}>
      <section className={styles.brandCard}>
        <section className={styles.hero}>
          <div
            className={styles.cover}
            style={brand.coverImageUrl ? { backgroundImage: `url(${brand.coverImageUrl})` } : { background: fallback.coverGradient }}
          />
          <div className={styles.heroShade} aria-hidden />
          <Link href={backHref} className={styles.heroButton} aria-label="К брендам">
            <ArrowLeft size={20} />
          </Link>
          <div className={styles.heroActions}>
            <FavoriteToggleButton
              id={brand.id}
              type="brand"
              className={styles.favoriteButton}
              activeClassName={styles.favoriteButtonActive}
            />
          </div>
        </section>

        <div className={styles.contentFlow}>
          <div
            className={styles.logo}
            style={brand.logoUrl ? { backgroundImage: `url(${brand.logoUrl})` } : { background: fallback.logoGradient }}
            aria-label={`Логотип ${brand.name}`}
          >
            {brand.logoUrl ? null : getInitial(brand.name) || fallback.mark}
          </div>

          <section className={styles.intro}>
            <span className={styles.category}>{brand.category ?? "Бренд"}</span>
            <h1 className={styles.title}>{brand.name}</h1>
            <p className={styles.description}>{description}</p>
            <div className={styles.metaGrid}>
              {brand.website ? (
                <a className={styles.website} href={brand.website} target="_blank" rel="noreferrer">
                  <Globe size={16} />
                  <span>{brand.website}</span>
                  <ExternalLink size={13} />
                </a>
              ) : null}
              <button type="button" className={styles.locationsButton} onClick={scrollToLocations}>
                <MapPin size={16} />
                Точки
              </button>
            </div>
          </section>

          <section className={styles.challengeList} aria-labelledby="brand-challenges-title">
            <div className={styles.sectionHeading}>
              <h2 id="brand-challenges-title">Челленджи бренда</h2>
            </div>

            {brand.challenges.length ? (
              <>
                {visibleChallenges.map((challenge) => {
                  const challengeImage = challenge.heroImageUrl ?? brand.coverImageUrl;
                  return (
                    <Link key={challenge.id} href={routes.user.challengeDetail(challenge.id)} className={styles.challengeCard}>
                      <div className={styles.challengeImage} style={challengeImage ? { backgroundImage: `url(${challengeImage})` } : undefined} aria-hidden />
                      <div className={styles.challengeShade} aria-hidden />
                      <div className={styles.challengeOverlay}>
                        <span className={styles.challengeType}>{getChallengeCategoryLabel(challenge)}</span>
                        <h3>{challenge.title}</h3>
                        <div className={styles.challengeDetails}>
                          {challenge.description ? <p>{challenge.description}</p> : null}
                          <div className={styles.challengeMetaRow}>
                            <div className={styles.challengeMeta}>
                              <span><ChallengeGoalIcon type={challenge.type} category={challenge.category} />{challenge.condition}</span>
                              <span><CalendarDays aria-hidden size={13} />{formatDaysLeft(challenge.daysLeft)}</span>
                            </div>
                            <span className={styles.reward}><Coins aria-hidden size={12} />{challenge.coinsReward || challenge.reward || "Награда"}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
                {hasMoreChallenges ? (
                  <button className={styles.showMoreTextButton} type="button" onClick={() => setVisibleChallengesCount((count) => count + 3)}>
                    Показать ещё
                  </button>
                ) : null}
              </>
            ) : (
              <div className={styles.empty}>
                <div>
                  <span className={styles.emptyIcon}><Sparkles size={24} /></span>
                  <h3>У бренда пока нет активных челленджей</h3>
                  <p>Скоро здесь появятся задания и награды.</p>
                </div>
              </div>
            )}
          </section>

          <div ref={locationsRef} className={styles.locationsAnchor}>
            <BrandLocationsList locations={brand.locations} userCity={userCity} />
          </div>
        </div>
      </section>
    </main>
  );
}
