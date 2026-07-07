"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { formatBrandLocation } from "@/lib/brand-format";
import { routes } from "@/lib/routes";
import type { PublicBrandLocation } from "@/lib/public-brands";
import styles from "@/app/app/brands/[slug]/user-brand-page.module.css";

type BrandLocationsListProps = {
  locations: PublicBrandLocation[];
  userCity?: string | null;
};

function normalizeCity(value?: string | null) {
  return value?.trim().toLocaleLowerCase("ru-RU").normalize("NFC") ?? "";
}

export function BrandLocationsList({ locations, userCity }: BrandLocationsListProps) {
  const [visibleCount, setVisibleCount] = useState(5);
  const [showOtherCities, setShowOtherCities] = useState(false);
  const normalizedUserCity = normalizeCity(userCity);
  const cityLocations = useMemo(
    () => locations.filter((location) => normalizeCity(location.city) === normalizedUserCity),
    [locations, normalizedUserCity],
  );
  const shouldFilterByCity = Boolean(normalizedUserCity) && !showOtherCities;
  const visibleSource = shouldFilterByCity ? cityLocations : locations;
  const visibleLocations = visibleSource.slice(0, visibleCount);

  function showMore() {
    setVisibleCount((count) => count + 5);
  }

  if (!locations.length) {
    return (
      <section className={styles.challengeList} aria-labelledby="brand-locations-title">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="brand-locations-title">Точки бренда</h2>
          </div>
        </div>
        <div className={styles.empty}>
          <div>
            <span className={styles.emptyIcon}><MapPin size={24} /></span>
            <h2>У бренда пока нет добавленных точек</h2>
          </div>
        </div>
      </section>
    );
  }

  if (normalizedUserCity && !showOtherCities && !cityLocations.length) {
    return (
      <section className={styles.challengeList} aria-labelledby="brand-locations-title">
        <div className={styles.sectionHeading}>
          <div>
            <h2 id="brand-locations-title">Точки бренда</h2>
          </div>
        </div>
        <div className={styles.empty}>
          <div>
            <span className={styles.emptyIcon}><MapPin size={24} /></span>
            <h2>Нет точек в вашем городе</h2>
            <button className={styles.showMoreButton} type="button" onClick={() => { setShowOtherCities(true); setVisibleCount(5); }}>
              Показать точки в других городах
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.challengeList} aria-labelledby="brand-locations-title">
      <div className={styles.sectionHeading}>
        <div>
          <h2 id="brand-locations-title">Точки бренда</h2>
          {!normalizedUserCity ? <p>Выберите город в профиле, чтобы видеть ближайшие точки</p> : null}
        </div>
      </div>

      {visibleLocations.map((item) => {
        const title = formatBrandLocation(item.city, item.address);
        const content = (
          <>
            <div className={styles.challengeTopline}>
              <span className={styles.challengeType}>{item.name ?? "Точка бренда"}</span>
              <span className={styles.locationBadges}>
                {item.isMain ? <span className={styles.challengeStatus}>Основная</span> : null}
                {item.lat !== null && item.lng !== null ? (
                  <span className={styles.mapArrow} aria-hidden><ArrowRight size={14} /></span>
                ) : (
                  <span className={styles.challengeStatus}>Адрес без карты</span>
                )}
              </span>
            </div>
            <h3>{title}</h3>
            {item.description ? <p>{item.description}</p> : null}
          </>
        );

        return item.lat !== null && item.lng !== null ? (
          <Link
            key={item.id}
            className={`${styles.challengeCard} ${styles.locationCardLink}`}
            href={`${routes.user.map}?locationId=${encodeURIComponent(item.id)}`}
            aria-label={`Открыть точку на карте: ${title}`}
          >
            {content}
          </Link>
        ) : (
          <article key={item.id} className={`${styles.challengeCard} ${styles.locationCardMuted}`}>
            {content}
          </article>
        );
      })}

      {visibleCount < visibleSource.length ? (
        <button className={styles.showMoreButton} type="button" onClick={showMore}>
          Показать ещё
        </button>
      ) : null}
    </section>
  );
}
