import Link from "next/link";
import { ArrowLeft, Gift, QrCode, Sparkles } from "lucide-react";
import { rewards } from "@/data/rewards";
import { routes } from "@/lib/routes";
import styles from "@/components/user/collection-screen.module.css";

const statusLabels = {
  available: "Доступна",
  used: "Использована",
  expired: "Истекла",
} as const;

export default function RewardsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <Link href={routes.user.profile} aria-label="Назад"><ArrowLeft size={18} /></Link>
        <div><small>Ваши бонусы</small><h1>Мои награды</h1></div>
      </header>

      {rewards.length ? (
        <section className={styles.list}>
          {rewards.map((reward) => {
            const expiresSoon = reward.status === "available" && reward.expiresAt.includes("Сегодня");
            const status = expiresSoon ? "Истекает скоро" : statusLabels[reward.status];
            return (
              <article className={styles.rewardCard} key={reward.id}>
                <span className={styles.rewardVisual}>{reward.emoji}</span>
                <div>
                  <small>{reward.brandName}</small>
                  <h2>{reward.title}</h2>
                  <p>{reward.description}</p>
                  <b data-status={expiresSoon ? "soon" : reward.status}>{status}</b>
                </div>
                {reward.status === "available" ? <span className={styles.qrBadge}><QrCode size={17} /></span> : <span className={styles.giftBadge}><Gift size={17} /></span>}
              </article>
            );
          })}
        </section>
      ) : (
        <section className={styles.empty}>
          <span><Sparkles size={25} /></span>
          <h2>Пока нет наград</h2>
          <p>Выполняйте челленджи, чтобы получать бонусы</p>
          <Link href={routes.user.challenges}>Найти челленджи</Link>
        </section>
      )}
    </main>
  );
}
