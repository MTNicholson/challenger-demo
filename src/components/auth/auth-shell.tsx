import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { routes } from "@/lib/routes";
import styles from "./auth.module.css";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <main className={styles.shell}>
      <div className={styles.glowMint} />
      <div className={styles.glowLilac} />
      <Image className={styles.coin} src="/landing/assets/glass-coin-blue.webp" alt="" width={160} height={160} priority />
      <Image className={styles.star} src="/landing/assets/glass-star-blue.webp" alt="" width={180} height={180} priority />
      <Link className={styles.brand} href={routes.marketing.home} aria-label="На главную">
        <span className={styles.brandMark}>Ч</span>
        <span>Челленджер</span>
      </Link>
      <div className={styles.content}>{children}</div>
      <p className={styles.caption}>Демо-режим · без реальной регистрации</p>
    </main>
  );
}
