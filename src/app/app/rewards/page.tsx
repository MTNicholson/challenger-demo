import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { rewards } from "@/data/rewards";
import { getCurrentUser } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { RewardsClient, type UserRewardView } from "./rewards-client";
import styles from "@/components/user/collection-screen.module.css";

export default async function RewardsPage() {
  const user = await getCurrentUser();
  const databaseRewards = user ? await prisma.userReward.findMany({
    where: { userId: user.id },
    include: { participation: { include: { challenge: { include: { brand: true } } } } },
    orderBy: { createdAt: "desc" },
  }) : [];
  const visibleRewards: UserRewardView[] = databaseRewards.length ? databaseRewards.map((reward) => ({
    id: reward.id,
    title: reward.title,
    brandName: reward.participation.challenge.brand.name,
    description: reward.description ?? "Награда за завершённый челлендж.",
    status: reward.status === "available" ? "available" : "used",
    expiresAt: reward.expiresAt ? reward.expiresAt.toLocaleDateString("ru-RU") : "Без срока",
    emoji: "🎃",
  })) : rewards.map((reward) => ({ ...reward, description: reward.description, status: reward.status === "available" ? "available" : "used" }));

  return <main className={styles.page}>
    <header className={styles.header}>
      <Link href={routes.user.profile} aria-label="Назад"><ArrowLeft size={18} /></Link>
      <div><h1>Мои награды</h1></div>
    </header>
    <RewardsClient rewards={visibleRewards} />
  </main>;
}
