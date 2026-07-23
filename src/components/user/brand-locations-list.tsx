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

  const heading = (
    <div className={styles.sectionHeading}>
      <h2 id="brand-locations-title">Точки бренда</h2>
    </div>
  );

  if (!locations.length) {
    return (
      <section className={styles.locationsSection} aria-labelledby="brand-locations-title">
        {heading}
        <div className={styles.empty}>
          <div>
            <span className={styles.emptyIcon}><MapPin size={24} /></span>
            <h3>У бренда пока нет добавленных точек</h3>
          </div>
        </div>
      </section>
    );
  }

  if (normalizedUserCity && !showOtherCities && !cityLocations.length) {
    return (
      <section className={styles.locationsSection} aria-labelledby="brand-locations-title">
        {heading}
        <div className={styles.empty}>
          <div>
            <span className={styles.emptyIcon}><MapPin size={24} /></span>
            <h3>Нет точек в вашем городе</h3>
            <button className={styles.showMoreButton} type="button" onClick={() => { setShowOtherCities(true); setVisibleCount(5); }}>
              Показать точки в других городах
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.locationsSection} aria-labelledby="brand-locations-title">
      {heading}
      {!normalizedUserCity ? <p className={styles.locationsHint}>Выберите город в профиле, чтобы увидеть ближайшие точки.</p> : null}

      {visibleLocations.map((location) => {
        const address = (location.fullAddress || formatBrandLocation(location.city, location.address)).trim() || "Адрес уточняется";
        const title = location.name ?? "Точка бренда";
        const hasCoordinates = location.lat !== null && location.lng !== null;
        const badge = location.isMain ? "Основная точка" : title;
        const content = (
          <>
            <div className={styles.locationContent}>
              <span className={styles.locationBadge}>{badge}</span>
              <p className={styles.locationAddress}>{address}</p>
            </div>
            {hasCoordinates ? <span className={styles.locationArrow} aria-hidden><ArrowRight size={14} /></span> : null}
          </>
        );

        return hasCoordinates ? (
          <Link
            key={location.id}
            className={styles.locationCard}
            href={`${routes.user.map}?locationId=${encodeURIComponent(location.id)}`}
            aria-label={`Открыть точку на карте: ${address}`}
          >
            {content}
          </Link>
        ) : (
          <article key={location.id} className={styles.locationCardMuted}>
            {content}
          </article>
        );
      })}

      {visibleCount < visibleSource.length ? (
        <button className={styles.showMoreButton} type="button" onClick={() => setVisibleCount((count) => count + 5)}>
          Показать ещё
        </button>
      ) : null}
    </section>
  );
}
