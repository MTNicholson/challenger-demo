"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Heart, MapPin, QrCode, Share2, X } from "lucide-react";
import { useState } from "react";
import type { Challenge } from "@/data/challenges";
import type { Location } from "@/data/locations";
import { useCurrentDemoUser } from "@/lib/demo-auth";
import { routes } from "@/lib/routes";
import {
  activateChallenge as activateStoredChallenge,
  cancelChallenge as cancelStoredChallenge,
  toggleFavoriteChallenge,
  useUserChallengeStates,
} from "@/lib/user-challenge-storage";
import styles from "./challenge-detail-screen.module.css";

type Props = {
  challenge: Challenge;
  locations: Location[];
};

const qrCells = Array.from({ length: 121 }, (_, index) =>
  [0, 1, 2, 9, 10, 11, 12, 14, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70, 72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 102, 104, 106, 108, 110, 112, 114, 116, 118, 120].includes(index),
);

export function ChallengeDetailScreen({ challenge, locations }: Props) {
  const { user } = useCurrentDemoUser();
  const { states } = useUserChallengeStates(user?.id);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const challengeState = states.find((state) => state.challengeId === challenge.id);
  const isActive = challengeState?.isActive ?? false;
  const isFavorite = challengeState?.isFavorite ?? false;
  const progressTotal = challengeState?.progressTotal ?? challenge.progress?.total ?? 1;
  const progressCurrent = isActive ? (challengeState?.progressCurrent ?? 0) : 0;
  const progressPercent = Math.min(100, (progressCurrent / progressTotal) * 100);
  const remaining = Math.max(0, progressTotal - progressCurrent);

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
        <span className={styles.status}>{isActive ? "Активирован" : "Можно начать"}</span>
      </section>

      <section className={styles.intro}>
        <div className={styles.brandIsland} aria-label={challenge.brandName}>
          <span>{challenge.emoji}</span>
        </div>
        <p className={styles.brand}>{challenge.brandName}</p>
        <h1>{challenge.title}</h1>
        <p className={styles.shortDescription}>{challenge.shortDescription ?? challenge.condition}</p>
        <p className={styles.description}>{challenge.fullDescription ?? challenge.description}</p>
      </section>

      <section className={styles.surface}>
        <div className={styles.sectionHeading}>
          <h2>Награда</h2>
          <strong>{challenge.coinsReward} 🪙</strong>
        </div>
        <div className={styles.rewardContent}>
          <span>🎁</span>
          <div><small>Подарок от бренда</small><p>{challenge.reward}</p></div>
        </div>
      </section>

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
            <div className={styles.checkItem}><span className={styles.checkPending}>1</span><div><p>{challenge.condition}</p><small>Выполните условие до окончания челленджа</small></div></div>
          )}
        </div>
      </section>

      <section className={styles.ctaPanel}>
        {isActive ? (
          <>
            <button type="button" className={styles.cancelPrimary} onClick={() => setIsCancelOpen(true)}>Отменить челлендж</button>
            <button type="button" className={styles.qrButton} onClick={() => setIsQrOpen(true)}><QrCode size={19} />Показать QR код</button>
          </>
        ) : <button type="button" className={styles.primaryButton} onClick={activateChallenge}>Принять челлендж</button>}
      </section>

      {notice ? <div className={styles.toast} role="status">{notice}</div> : null}

      {isCancelOpen ? (
        <div className={styles.overlay} role="presentation" onMouseDown={() => setIsCancelOpen(false)}>
          <section className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="cancel-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.close} type="button" onClick={() => setIsCancelOpen(false)} aria-label="Закрыть"><X size={18} /></button>
            <span className={styles.sheetIcon}>?</span>
            <h2 id="cancel-title">Точно хотите отменить челлендж?</h2>
            <p>Текущий прогресс будет скрыт. Вы сможете принять челлендж снова.</p>
            <button type="button" className={styles.dangerButton} onClick={cancelChallenge}>Да, отменить</button>
            <button type="button" className={styles.ghostButton} onClick={() => setIsCancelOpen(false)}>Нет</button>
          </section>
        </div>
      ) : null}

      {isQrOpen ? (
        <div className={styles.overlay} role="presentation" onMouseDown={() => setIsQrOpen(false)}>
          <section className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby="qr-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className={styles.close} type="button" onClick={() => setIsQrOpen(false)} aria-label="Закрыть"><X size={18} /></button>
            <h2 id="qr-title">QR-код визита</h2>
            <p>Покажите QR-код партнёру для отметки визита</p>
            <div className={styles.qr} aria-label={`QR-код ${challenge.qrCodeValue ?? challenge.id}`}>{qrCells.map((filled, index) => <i key={index} className={filled ? styles.qrFilled : ""} />)}</div>
            <small className={styles.qrValue}>{challenge.qrCodeValue ?? `CHALLENGER:${challenge.id}:DEMO`}</small>
          </section>
        </div>
      ) : null}
    </main>
  );
}
