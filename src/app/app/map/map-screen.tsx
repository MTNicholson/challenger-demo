"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, MapPin, X } from "lucide-react";
import { useState } from "react";
import {
  mapChallengePoints,
  type MapChallengeCategory,
  type MapChallengePoint,
} from "@/data/map-challenges";
import { routes } from "@/lib/routes";
import { useCurrentDemoUser } from "@/lib/demo-auth";
import { useUserChallengeStates } from "@/lib/user-challenge-storage";
import styles from "./user-map.module.css";

const LeafletChallengeMap = dynamic(
  () => import("./leaflet-map").then((module) => module.LeafletChallengeMap),
  {
    ssr: false,
    loading: () => (
      <div className={styles.mapLoading} role="status">
        <span />
        Загружаем карту Петербурга…
      </div>
    ),
  },
);

type Filter = "Все" | MapChallengeCategory;

const filters: Filter[] = ["Все", "Кофе", "Еда", "Спорт", "Beauty", "Книги"];
const defaultPoint = mapChallengePoints.find((point) => point.isActive) ?? mapChallengePoints[0];

export function ChallengeMapScreen() {
  const { user } = useCurrentDemoUser();
  const { states } = useUserChallengeStates(user?.id);
  const [activeFilter, setActiveFilter] = useState<Filter>("Все");
  const [selectedPoint, setSelectedPoint] = useState<MapChallengePoint>(defaultPoint);
  const [isCardVisible, setIsCardVisible] = useState(true);

  const visiblePoints =
    activeFilter === "Все"
      ? mapChallengePoints
      : mapChallengePoints.filter((point) => point.category === activeFilter);

  function selectFilter(filter: Filter) {
    setActiveFilter(filter);

    if (filter === "Все") return;

    const nextPoint = mapChallengePoints.find((point) => point.category === filter);
    if (nextPoint) {
      setSelectedPoint(nextPoint);
      setIsCardVisible(true);
    }
  }

  function selectPoint(point: MapChallengePoint) {
    setSelectedPoint(point);
    setIsCardVisible(true);
  }

  const cardHref = routes.user.challengeDetail(selectedPoint.challengeId);
  const isSelectedChallengeActive = states.some(
    (state) => state.challengeId === selectedPoint.challengeId && state.isActive,
  );

  return (
    <main className={styles.mapPage}>
      <LeafletChallengeMap
        points={visiblePoints}
        selectedPointId={selectedPoint.id}
        onSelectPoint={selectPoint}
      />

      <div className={styles.mapTint} aria-hidden="true" />

      <nav className={styles.filters} aria-label="Фильтры точек на карте">
        {filters.map((filter) => (
          <button
            type="button"
            key={filter}
            aria-pressed={activeFilter === filter}
            className={activeFilter === filter ? styles.filterActive : styles.filter}
            onClick={() => selectFilter(filter)}
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
        © OpenStreetMap
      </a>

      {isCardVisible ? (
        <article className={styles.floatingCard} aria-live="polite">
          <button
            type="button"
            className={styles.closeButton}
            aria-label="Закрыть карточку челленджа"
            onClick={() => setIsCardVisible(false)}
          >
            <X aria-hidden size={15} />
          </button>

          <div className={styles.pointVisual} aria-hidden>
            {selectedPoint.emoji}
          </div>

          <div className={styles.pointCopy}>
            <span>{selectedPoint.brand}</span>
            <h1>{selectedPoint.challenge}</h1>
            <p>{selectedPoint.description}</p>
            <div className={styles.pointMeta}>
              <span>
                <MapPin aria-hidden size={11} />
                {selectedPoint.distance}
              </span>
              <strong>🪙 {selectedPoint.reward}</strong>
            </div>
          </div>

          <Link href={cardHref} className={styles.openButton}>
            {isSelectedChallengeActive ? "Продолжить" : "Открыть"}
            <ArrowRight aria-hidden size={14} />
          </Link>
        </article>
      ) : null}
    </main>
  );
}
