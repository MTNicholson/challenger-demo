"use client";

import { Gift, QrCode, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import styles from "@/components/user/collection-screen.module.css";

export type UserRewardView = {
  id: string;
  title: string;
  brandName: string;
  description: string;
  status: "available" | "used";
  expiresAt: string;
  emoji: string;
};

type Filter = "all" | "active" | "received";

function emptyTitle(filter: Filter) {
  if (filter === "active") return "Активных наград пока нет";
  if (filter === "received") return "Полученных наград пока нет";
  return "Наград пока нет";
}

export function RewardsClient({ rewards }: { rewards: UserRewardView[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const visibleRewards = useMemo(() => rewards.filter((reward) => filter === "all" || (filter === "active" ? reward.status === "available" : reward.status === "used")), [filter, rewards]);

  return <>
    <div className={styles.chips} aria-label="Фильтры наград">
      {([ ["all", "Все"], ["active", "Активные"], ["received", "Полученные"] ] as const).map(([value, label]) => <button key={value} type="button" className={filter === value ? styles.chipActive : undefined} onClick={() => setFilter(value)}>{label}</button>)}
    </div>
    {visibleRewards.length ? <section className={styles.list}>
      {visibleRewards.map((reward) => {
        const expiresSoon = reward.status === "available" && reward.expiresAt.includes("Сегодня");
        const status = expiresSoon ? "Истекает скоро" : reward.status === "available" ? "Доступна" : "Получена";
        return <article className={styles.rewardCard} key={reward.id}>
          <span className={styles.rewardVisual}>{reward.emoji}</span>
          <div><small>{reward.brandName}</small><h2>{reward.title}</h2><p>{reward.description}</p><b data-status={expiresSoon ? "soon" : reward.status}>{status}</b></div>
          {reward.status === "available" ? <span className={styles.qrBadge}><QrCode size={17} /></span> : <span className={styles.giftBadge}><Gift size={17} /></span>}
        </article>;
      })}
    </section> : <section className={styles.empty}>
      <span><Sparkles size={25} /></span><h2>{emptyTitle(filter)}</h2><p>Выполняйте челленджи, чтобы получать бонусы</p>
    </section>}
  </>;
}
