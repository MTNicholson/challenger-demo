"use client";

import Link from "next/link";
import { BadgePercent, Coins, Gift, MapPinned, Sparkles } from "lucide-react";
import { CoinOperationList } from "@/components/user/coin-operation-list";
import { coinOperations } from "@/data/coin-operations";
import { useCurrentDemoUser } from "@/lib/demo-auth";
import { routes } from "@/lib/routes";
import styles from "@/components/user/coins-screen.module.css";

const earnWays = [
  {
    title: "Выполнять челленджи",
    reward: "до +200 🪙",
    icon: Gift,
    href: routes.user.challenges,
    tone: styles.iconMint,
  },
  {
    title: "Заходить каждый день",
    reward: "+10 🪙",
    icon: Sparkles,
    href: routes.user.home,
    tone: styles.iconLilac,
  },
  {
    title: "Посещать новые места",
    reward: "+30 🪙",
    icon: MapPinned,
    href: routes.user.map,
    tone: styles.iconBlue,
  },
  {
    title: "Получать бонусы от брендов",
    reward: "+100 🪙",
    icon: BadgePercent,
    href: routes.user.challenges,
    tone: styles.iconPeach,
  },
];

export default function UserCoinsPage() {
  const { user } = useCurrentDemoUser();
  const balance = user?.coinsBalance ?? 1250;

  return (
    <main className={styles.coinsPage}>
      <section className={styles.balanceCard} aria-label="Баланс баллов">
        <div className={styles.balanceIcon}>
          <Coins aria-hidden size={21} />
        </div>
        <div className={styles.balanceValue}>
          <strong>{balance.toLocaleString("ru-RU")}</strong>
          <span>баллов</span>
        </div>
      </section>

      <section>
        <div className={styles.sectionHeading}>
          <h1>История операций</h1>
          <Link href={routes.user.coinsHistory}>Смотреть все</Link>
        </div>
        <div className={styles.operationPanel}>
          <CoinOperationList operations={coinOperations.slice(0, 5)} />
        </div>
      </section>

      <section>
        <div className={styles.sectionHeading}>
          <h2>Как заработать баллы</h2>
        </div>
        <div className={styles.earnList}>
          {earnWays.map((way) => {
            const Icon = way.icon;

            return (
              <Link key={way.title} href={way.href} className={styles.earnCard}>
                <span className={`${styles.earnIcon} ${way.tone}`}>
                  <Icon aria-hidden size={19} />
                </span>
                <strong>{way.title}</strong>
                <b>{way.reward}</b>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
