"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OnboardingScreen, type OnboardingSlide } from "@/components/onboarding/onboarding-screen";
import { routes } from "@/lib/routes";
import styles from "@/components/onboarding/onboarding.module.css";

const slides: OnboardingSlide[] = [
  { title: "Челленджи рядом с вами", description: "Находите задания от локальных брендов, посещайте места и открывайте награды.", visual: "places" },
  { title: "Баллы за реальные действия", description: "Сканируйте QR, выполняйте задания и копите баллы за активность.", visual: "coins" },
  { title: "Награды у любимых брендов", description: "Обменивайте баллы на призы, скидки и приятные бонусы в городе.", visual: "rewards" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const isLast = index === slides.length - 1;
  const openApp = () => router.push(routes.user.home);

  return (
    <main className={styles.page}>
      <section className={styles.shell}>
        <header className={styles.topbar}>
          <div className={styles.brand}><span>Ч</span><span>Челленджер</span></div>
          <span className={styles.counter}>{index + 1} / {slides.length}</span>
        </header>
        <OnboardingScreen slide={slides[index]} index={index} />
        <footer className={styles.controls}>
          <button className={styles.skip} type="button" onClick={openApp}>Пропустить</button>
          <div className={styles.dots} aria-label={`Экран ${index + 1} из ${slides.length}`}>
            {slides.map((slide, dotIndex) => <span key={slide.title} className={`${styles.dot} ${dotIndex === index ? styles.dotActive : ""}`} />)}
          </div>
          <button className={styles.next} type="button" onClick={() => isLast ? openApp() : setIndex((current) => current + 1)}>{isLast ? "Начать" : "Далее"}<ArrowRight size={16} /></button>
        </footer>
      </section>
    </main>
  );
}
