"use client";

import Link from "next/link";
import { ArrowLeft, Heart, QrCode, Share2, X } from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";
import type { Challenge } from "@/data/challenges";
import type { Location } from "@/data/locations";
import { useCurrentUser } from "@/lib/auth-client";
import { routes } from "@/lib/routes";
import {
  activateChallenge as activateStoredChallenge,
  cancelChallenge as cancelStoredChallenge,
  toggleFavoriteChallenge,
  useUserChallengeStates,
} from "@/lib/user-challenge-storage";
import { ChallengeDetailCard } from "./challenge-detail-card";
import styles from "./challenge-detail-screen.module.css";

type Props = {
  challenge: Challenge;
  locations: Location[];
};

const qrCells = Array.from({ length: 121 }, (_, index) =>
  [0, 1, 2, 9, 10, 11, 12, 14, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120].includes(index),
);

export function ChallengeDetailScreen({ challenge, locations }: Props) {
  const { user } = useCurrentUser();
  const { states } = useUserChallengeStates(user?.id);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const challengeState = states.find((state) => state.challengeId === challenge.id);
  const isActive = challengeState?.isActive ?? false;
  const isFavorite = challengeState?.isFavorite ?? false;
  const progressTotal = challengeState?.progressTotal ?? challenge.progress?.total ?? 1;
  const progressCurrent = isActive ? (challengeState?.progressCurrent ?? 0) : 0;
  const overlayRoot = typeof document === "undefined" ? null : document.getElementById("user-app-overlay-root");

  async function shareChallenge() {
    const shareData = { title: challenge.title, text: challenge.description, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(window.location.href);
        setNotice("Ссылка скопирована");
      }
    } catch {
      setNotice("Не удалось поделиться ссылкой");
    }
    window.setTimeout(() => setNotice(""), 2200);
  }

  function activateChallenge() {
    if (!user) return;
    activateStoredChallenge(user.id, challenge.id, challenge.progress?.total ?? 1);
    setNotice("Челлендж активирован");
    window.setTimeout(() => setNotice(""), 2200);
  }

  function cancelChallenge() {
    if (!user) return;
    cancelStoredChallenge(user.id, challenge.id);
    setIsCancelOpen(false);
    setNotice("Челлендж отменён");
    window.setTimeout(() => setNotice(""), 2200);
  }

  function toggleFavorite() {
    if (!user) return;
    toggleFavoriteChallenge(user.id, challenge.id);
  }

  return (
    <main className={styles.page}>
      <svg className={styles.liquidGlassDefs} aria-hidden="true" focusable="false">
        <filter id="challenge-liquid-distortion" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <ChallengeDetailCard
        challenge={challenge}
        isActive={isActive}
        locations={locations}
        progress={{ current: progressCurrent, total: progressTotal }}
        heroControls={
          <>
            <Link href={routes.user.challenges} className={styles.iconButton} aria-label="Назад">
              <ArrowLeft size={20} />
            </Link>
            <div className={styles.heroActions}>
              <button type="button" className={styles.iconButton} onClick={shareChallenge} aria-label="Поделиться">
                <Share2 size={18} />
              </button>
              <button type="button" className={`${styles.iconButton} ${isFavorite ? styles.favorite : ""}`} onClick={toggleFavorite} aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"} aria-pressed={isFavorite}>
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </>
        }
      />

      <section className={styles.ctaPanel}>
        {isActive ? (
          <>
            <button type="button" className={styles.cancelPrimary} onClick={() => setIsCancelOpen(true)}>Отменить челлендж</button>
            <button type="button" className={styles.qrButton} onClick={() => setIsQrOpen(true)}><QrCode size={19} />Показать QR код</button>
          </>
        ) : (
          <button type="button" className={styles.liquidCta} onClick={activateChallenge}>
            <span className={styles.liquidCtaLabel}>Принять челлендж</span>
          </button>
        )}
      </section>

      {notice ? <div className={styles.toast} role="status">{notice}</div> : null}

      {isCancelOpen && overlayRoot ? createPortal(
        <div className={styles.overlay} role="presentation" onMouseDown={() => setIsCancelOpen(false)}>
          <section className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="cancel-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.close} type="button" onClick={() => setIsCancelOpen(false)} aria-label="Закрыть"><X size={18} /></button>
            <span className={styles.sheetIcon}>?</span>
            <h2 id="cancel-title">Точно хотите отменить челлендж?</h2>
            <p>Текущий прогресс будет скрыт. Вы сможете принять челлендж снова.</p>
            <button type="button" className={styles.dangerButton} onClick={cancelChallenge}>Да, отменить</button>
            <button type="button" className={styles.ghostButton} onClick={() => setIsCancelOpen(false)}>Нет</button>
          </section>
        </div>,
        overlayRoot,
      ) : null}

      {isQrOpen && overlayRoot ? createPortal(
        <div className={styles.overlay} role="presentation" onMouseDown={() => setIsQrOpen(false)}>
          <section className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="qr-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.close} type="button" onClick={() => setIsQrOpen(false)} aria-label="Закрыть"><X size={18} /></button>
            <h2 id="qr-title">QR-код визита</h2>
            <p>Покажите QR-код партнёру для отметки визита</p>
            <div className={styles.qr} aria-label={`QR-код ${challenge.qrCodeValue ?? challenge.id}`}>{qrCells.map((filled, index) => <i key={index} className={filled ? styles.qrFilled : ""} />)}</div>
            <small className={styles.qrValue}>{challenge.qrCodeValue ?? `CHALLENGER:${challenge.id}:DEMO`}</small>
          </section>
        </div>,
        overlayRoot,
      ) : null}
    </main>
  );
}
