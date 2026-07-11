"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, MapPin, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  mapChallengePoints,
  type MapChallengeCategory,
  type MapChallengePoint,
} from "@/data/map-challenges";
import { formatBrandLocation } from "@/lib/brand-format";
import { routes } from "@/lib/routes";
import { useCurrentUser } from "@/lib/auth-client";
import { useUserChallengeStates } from "@/lib/user-challenge-storage";
import { UserBottomNav } from "@/components/user/user-bottom-nav";
import styles from "./user-map.module.css";

const LeafletChallengeMap = dynamic(
  () => import("./leaflet-map").then((module) => module.LeafletChallengeMap),
  {
    ssr: false,
    loading: () => (
      <div className={styles.mapLoading} role="status">
        <span />
        Загружаем карту...
      </div>
    ),
  },
);

export type MapBrandLocation = {
  id: string;
  name: string | null;
  city: string;
  address: string;
  fullAddress: string | null;
  lat: number | null;
  lng: number | null;
  description: string | null;
  isMain: boolean;
  brand: {
    id: string;
    name: string;
    category: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
  };
};

type Filter = "Все" | MapChallengeCategory | string;

type ChallengeMapScreenProps = {
  initialSelectedLocation?: MapBrandLocation | null;
  locations: MapBrandLocation[];
  requestedLocationId?: string | null;
};

const allFilter = "Все";
const defaultPoint = mapChallengePoints.find((point) => point.isActive) ?? mapChallengePoints[0];

function getInitial(value: string) {
  return value.trim()[0]?.toLocaleUpperCase("ru-RU") ?? "Б";
}

export function ChallengeMapScreen({ initialSelectedLocation = null, locations, requestedLocationId = null }: ChallengeMapScreenProps) {
  const router = useRouter();
  const { user } = useCurrentUser();
  const { states } = useUserChallengeStates(user?.id);
  const [activeFilter, setActiveFilter] = useState<Filter>(allFilter);
  const [selectedPoint, setSelectedPoint] = useState<MapChallengePoint | null>(null);
  const [activeLocation, setActiveLocation] = useState<MapBrandLocation | null>(initialSelectedLocation);
  const [isCardVisible, setIsCardVisible] = useState(Boolean(initialSelectedLocation));

  useEffect(() => {
    if (!initialSelectedLocation) return;
    const frame = window.requestAnimationFrame(() => {
      setActiveLocation(initialSelectedLocation);
      setSelectedPoint(null);
      setIsCardVisible(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [initialSelectedLocation]);

  const filters = useMemo<Filter[]>(() => {
    const realCategories = locations.map((location) => location.brand.category).filter(Boolean) as string[];
    const mockCategories = mapChallengePoints.map((point) => point.category);
    return [allFilter, ...Array.from(new Set([...realCategories, ...mockCategories]))];
  }, [locations]);

  const visibleLocations =
    activeFilter === allFilter
      ? locations
      : locations.filter((location) => location.brand.category === activeFilter);
  const visibleMockPoints =
    locations.length > 0
      ? []
      : activeFilter === allFilter
        ? mapChallengePoints
        : mapChallengePoints.filter((point) => point.category === activeFilter);

  function clearLocationQuery() {
    router.replace(routes.user.map, { scroll: false });
  }

  function selectPoint(point: MapChallengePoint) {
    setSelectedPoint(point);
    setActiveLocation(null);
    setIsCardVisible(true);
    clearLocationQuery();
  }

  function selectLocation(location: MapBrandLocation) {
    setActiveLocation(location);
    setSelectedPoint(null);
    setIsCardVisible(true);
    router.replace(`${routes.user.map}?locationId=${encodeURIComponent(location.id)}`, { scroll: false });
  }

  function closeCard() {
    setIsCardVisible(false);
    setActiveLocation(null);
    setSelectedPoint(null);
    clearLocationQuery();
  }

  const fallbackPoint = selectedPoint ?? defaultPoint;
  const cardHref = routes.user.challengeDetail(fallbackPoint.challengeId);
  const isSelectedChallengeActive = states.some(
    (state) => state.challengeId === fallbackPoint.challengeId && state.isActive,
  );
  const hasActiveLocationCoordinates = Boolean(activeLocation && activeLocation.lat !== null && activeLocation.lng !== null);
  const isEmpty = visibleLocations.length === 0 && visibleMockPoints.length === 0;
  const locationNotFound = Boolean(requestedLocationId && !initialSelectedLocation && !activeLocation);

  return (
    <main className={styles.mapPage}>
      <LeafletChallengeMap
        points={visibleMockPoints}
        locations={visibleLocations}
        selectedPointId={selectedPoint?.id ?? ""}
        selectedLocationId={activeLocation?.id ?? null}
        selectedLocation={hasActiveLocationCoordinates ? activeLocation : null}
        onSelectPoint={selectPoint}
        onSelectLocation={selectLocation}
      />

      <div className={styles.mapTint} aria-hidden="true" />

      <nav className={styles.filters} aria-label="Фильтры точек на карте">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            aria-pressed={activeFilter === filter}
            className={activeFilter === filter ? styles.filterActive : styles.filter}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </nav>

      <a
        className={styles.attribution}
        href="https://www.openstreetmap.org/copyright"
        target="_blank"
        rel="noreferrer"
      >
        © OpenStreetMap contributors © CARTO
      </a>

      {isEmpty && !locationNotFound ? (
        <div className={styles.mapEmpty}>
          <MapPin size={20} />
          <strong>На карте пока нет точек</strong>
          <span>Когда бренды добавят адреса с координатами, они появятся здесь.</span>
        </div>
      ) : null}

      {locationNotFound ? (
        <div className={styles.mapEmpty}>
          <MapPin size={20} />
          <strong>Точка не найдена</strong>
          <span>Возможно, адрес удалили или ссылка устарела.</span>
        </div>
      ) : null}

      <div className={styles.mapBottomStack}>
        {isCardVisible && activeLocation && !hasActiveLocationCoordinates ? (
          <article className={styles.floatingCard} aria-live="polite">
            <button type="button" className={styles.closeButton} aria-label="Закрыть карточку точки" onClick={closeCard}>
              <X aria-hidden size={15} />
            </button>
            <div className={styles.pointVisual} aria-hidden>
              {getInitial(activeLocation.brand.name)}
            </div>
            <div className={styles.pointCopy}>
              <span>{activeLocation.brand.name}</span>
              <h1>{activeLocation.name ?? "Точка бренда"}</h1>
              <p>У этой точки пока нет координат</p>
            </div>
            <Link href={routes.user.brandDetail(activeLocation.brand.id)} className={styles.openButton}>
              Открыть бренд
              <ArrowRight aria-hidden size={14} />
            </Link>
          </article>
        ) : null}

        {isCardVisible && hasActiveLocationCoordinates && activeLocation ? (
          <article className={styles.floatingCard} aria-live="polite">
            <button type="button" className={styles.closeButton} aria-label="Закрыть карточку точки" onClick={closeCard}>
              <X aria-hidden size={15} />
            </button>

            <div
              className={styles.pointVisual}
              aria-hidden
              style={activeLocation.brand.logoUrl ? { backgroundImage: `url(${activeLocation.brand.logoUrl})` } : undefined}
            >
              {activeLocation.brand.logoUrl ? null : getInitial(activeLocation.brand.name)}
            </div>

            <div className={styles.pointCopy}>
              <span>{activeLocation.brand.category ?? "Бренд"}</span>
              <h1>{activeLocation.brand.name}</h1>
              <p>{activeLocation.fullAddress || formatBrandLocation(activeLocation.city, activeLocation.address)}</p>
              <div className={styles.pointMeta}>
                <span>
                  <MapPin aria-hidden size={11} />
                  {activeLocation.name ?? activeLocation.city}
                </span>
                {activeLocation.isMain ? <strong>Основная</strong> : null}
              </div>
            </div>

            <Link href={routes.user.brandDetail(activeLocation.brand.id)} className={styles.openButton}>
              Открыть бренд
              <ArrowRight aria-hidden size={14} />
            </Link>
          </article>
        ) : null}

        {isCardVisible && !activeLocation && selectedPoint ? (
          <article className={styles.floatingCard} aria-live="polite">
            <button type="button" className={styles.closeButton} aria-label="Закрыть карточку челленджа" onClick={closeCard}>
              <X aria-hidden size={15} />
            </button>

            <div className={styles.pointVisual} aria-hidden>
              {fallbackPoint.emoji}
            </div>

            <div className={styles.pointCopy}>
              <span>{fallbackPoint.brand}</span>
              <h1>{fallbackPoint.challenge}</h1>
              <p>{fallbackPoint.description}</p>
              <div className={styles.pointMeta}>
                <span>
                  <MapPin aria-hidden size={11} />
                  {fallbackPoint.distance}
                </span>
                <strong>{fallbackPoint.reward} монет</strong>
              </div>
            </div>

            <Link href={cardHref} className={styles.openButton}>
              {isSelectedChallengeActive ? "Продолжить" : "Открыть"}
              <ArrowRight aria-hidden size={14} />
            </Link>
          </article>
        ) : null}

        <UserBottomNav className={styles.mapBottomNav} />
      </div>
    </main>
  );
}
