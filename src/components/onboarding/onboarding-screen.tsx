import { Gift, MapPin, QrCode, Sparkles } from "lucide-react";
import styles from "./onboarding.module.css";

export type OnboardingSlide = {
  title: string;
  description: string;
  visual: "places" | "coins" | "rewards";
};

function SlideVisual({ type }: { type: OnboardingSlide["visual"] }) {
  if (type === "places") {
    return (
      <div className={`${styles.visual} ${styles.places}`} aria-hidden="true">
        <div className={styles.mapLine} />
        <span className={`${styles.pin} ${styles.pinOne}`}><MapPin /></span>
        <span className={`${styles.pin} ${styles.pinTwo}`}><MapPin /></span>
        <div className={styles.miniChallenge}><span>☕</span><div><b>Кофейный маршрут</b><small>Совсем рядом · +200</small></div></div>
      </div>
    );
  }
  if (type === "coins") {
    return (
      <div className={`${styles.visual} ${styles.coins}`} aria-hidden="true">
        <div className={styles.token}><span>Ч</span></div>
        <div className={styles.qrCard}><QrCode /><div><b>Задание выполнено</b><small>Баллы уже ваши</small></div></div>
        <div className={styles.progressCard}><span><b>3 из 5</b><small>До награды</small></span><i><em /></i></div>
        <Sparkles className={styles.sparkle} />
      </div>
    );
  }
  return (
    <div className={`${styles.visual} ${styles.rewards}`} aria-hidden="true">
      <div className={styles.gift}><Gift /></div>
      <div className={styles.rewardCard}><small>ВАША НАГРАДА</small><b>Кофе в подарок</b><span><QrCode /> 450 баллов</span></div>
      <div className={styles.badge}>Доступно</div>
    </div>
  );
}

export function OnboardingScreen({ slide, index }: { slide: OnboardingSlide; index: number }) {
  return (
    <div className={styles.slide} key={index}>
      <SlideVisual type={slide.visual} />
      <div className={styles.copy}>
        <p className={styles.kicker}>Возможность {index + 1}</p>
        <h1>{slide.title}</h1>
        <p>{slide.description}</p>
      </div>
    </div>
  );
}
