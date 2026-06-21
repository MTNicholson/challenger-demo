import type { ReactNode } from "react";
import styles from "./auth.module.css";

export function AuthCard({ icon, title, subtitle, children }: { icon: ReactNode; title: string; subtitle: string; children: ReactNode }) {
  return (
    <section className={styles.card}>
      <div className={styles.cardShine} />
      <div className={styles.icon}>{icon}</div>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
      {children}
    </section>
  );
}
