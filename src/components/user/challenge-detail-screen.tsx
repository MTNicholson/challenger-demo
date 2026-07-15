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
  isPreview?: boolean;
  backHref?: string;
  brandHref?: string;
};

export function ChallengeDetailScreen({ challenge, locations, isPreview = false, backHref = routes.user.challenges, brandHref }: Props) {
  const { user } = useCurrentUser();
  const { states } = useUserChallengeStates(user?.id);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const challengeState = states.find((state) => state.challengeId === challenge.id);
  const isCompleted = Boolean(challengeState?.completedAt);
  const isRewardUsed = Boolean(challengeState?.rewardUsed);
  const isActive = (challengeState?.isActive ?? false) && !isCompleted;
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
    if (isPreview) return;
    if (!user) return;
    toggleFavoriteChallenge(user.id, challenge.id);
  }

  return (
    <main className={`${styles.page} ${isPreview ? styles.previewPage : ""}`}>
      <svg className={styles.liquidGlassDefs} aria-hidden="true" focusable="false">
        <filter id="challenge-liquid-distortion" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <ChallengeDetailCard
        challenge={challenge}
        brandHref={brandHref}
        isActive={isActive}
        locations={locations}
        progress={{ current: progressCurrent, total: progressTotal }}
        heroControls={
          <>
            {isPreview ? (
              <button type="button" className={styles.iconButton} aria-label="Назад" aria-disabled="true"><ArrowLeft size={20} /></button>
            ) : (
              <Link href={backHref} className={styles.iconButton} aria-label="Назад"><ArrowLeft size={20} /></Link>
            )}
            <div className={styles.heroActions}>
              <button type="button" className={styles.iconButton} onClick={isPreview ? undefined : shareChallenge} aria-label="Поделиться" aria-disabled={isPreview}>
                <Share2 size={18} />
              </button>
              <button type="button" className={`${styles.iconButton} ${isFavorite ? styles.favorite : ""}`} onClick={isPreview ? undefined : toggleFavorite} aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"} aria-pressed={isFavorite} aria-disabled={isPreview}>
                <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          </>
        }
      />

      <section className={styles.ctaPanel}>
        {isCompleted ? isRewardUsed ? (
          <span className={styles.qrButton}><QrCode size={19} />Награда использована</span>
        ) : (
          isPreview ? <button type="button" className={styles.qrButton} aria-disabled="true"><QrCode size={19} />Получить награду</button> : <Link href={`/app/challenges/${challenge.id}/reward`} className={styles.qrButton}><QrCode size={19} />Получить награду</Link>
        ) : isActive ? (
          <>
            <button type="button" className={styles.cancelPrimary} onClick={isPreview ? undefined : () => setIsCancelOpen(true)} aria-disabled={isPreview}>Отменить челлендж</button>
            <span className={styles.qrButton}><QrCode size={19} />Челлендж выполняется</span>
          </>
        ) : (
          <button type="button" className={styles.liquidCta} onClick={isPreview ? undefined : activateChallenge} aria-disabled={isPreview}>
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

    </main>
  );
}
