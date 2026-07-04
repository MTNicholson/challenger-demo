"use client";

import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import type { PublicBrandSummary } from "@/lib/public-brands";
import { routes } from "@/lib/routes";
import { FavoriteToggleButton } from "@/components/user/favorite-toggle-button";
import styles from "./brand-card.module.css";

type BrandCardProps = {
  brand: PublicBrandSummary;
};

function getInitial(name: string) {
  return name.trim()[0]?.toLocaleUpperCase() ?? "Б";
}

function formatChallengesCount(count: number) {
  if (count === 1) return "1 челлендж";
  if (count > 1 && count < 5) return `${count} челленджа`;
  return `${count} челленджей`;
}

export function BrandCard({ brand }: BrandCardProps) {
  const category = brand.category ?? "Бренд";
  const city = brand.city ?? "Город не указан";
  const address = brand.address ?? "Адрес появится позже";
  const description = brand.description ?? "Скоро здесь появятся задания, маршруты и награды от бренда.";

  return (
    <Link className={styles.card} href={routes.user.brandDetail(brand.slug)}>
      <div className={styles.top}>
        <div
          className={styles.logo}
          style={brand.logoUrl ? { backgroundImage: `url(${brand.logoUrl})` } : undefined}
        >
          {brand.logoUrl ? null : getInitial(brand.name)}
        </div>
        <div className={styles.titleBlock}>
          <span className={styles.category}>{category}</span>
          <h3 className={styles.title}>{brand.name}</h3>
        </div>
        <FavoriteToggleButton
          id={brand.id}
          type="brand"
          className={styles.favoriteButton}
          activeClassName={styles.favoriteButtonActive}
        />
      </div>
      <div className={styles.meta}>
        <span>
          <MapPin size={13} />
          <b>{city}</b>
        </span>
        <span>
          <MapPin size={13} />
          <b>{address}</b>
        </span>
      </div>
      <p className={styles.description}>{description}</p>
      <div className={styles.bottom}>
        <span className={styles.count}>{formatChallengesCount(brand.challengesCount)}</span>
        <span className={styles.cta}>
          Открыть бренд
          <ArrowRight size={13} />
        </span>
      </div>
    </Link>
  );
}
