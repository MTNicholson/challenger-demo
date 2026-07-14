import { getCurrentBrand } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import type { BrandRewardDto, BrandRewardStatus, BrandRewardType } from "@/lib/brand-rewards";
import { BrandRewardsClient } from "./rewards-client";

function serializeReward(reward: {
  id: string;
  title: string;
  type: string;
  description: string;
  status: string;
  limit: number | null;
  points: number;
  expiresInDays: number | null;
  usageTerms: string | null;
  issuedCount: number;
  redeemedCount: number;
  archivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): BrandRewardDto {
  return {
    ...reward,
    type: reward.type as BrandRewardType,
    status: reward.status as BrandRewardStatus,
    archivedAt: reward.archivedAt?.toISOString() ?? null,
    createdAt: reward.createdAt.toISOString(),
    updatedAt: reward.updatedAt.toISOString(),
  };
}

export default async function BrandRewardsPage() {
  const session = await getCurrentBrand();
  const brandName = session?.brand.name ?? "Бренд";
  const [rewards, archivedRewards] = session
    ? await Promise.all([
        prisma.brandReward.findMany({
          where: { brandId: session.brand.id, status: { not: "archived" }, OR: [{ source: { not: "location" } }, { source: "location", status: "active" }] },
          orderBy: [{ updatedAt: "desc" }],
        }),
        prisma.brandReward.findMany({
          where: { brandId: session.brand.id, status: "archived", OR: [{ source: { not: "location" } }, { source: "location", status: "active" }] },
          orderBy: [{ archivedAt: "desc" }, { updatedAt: "desc" }],
        }),
      ])
    : [[], []];

  return (
    <BrandRewardsClient
      archivedRewards={archivedRewards.map(serializeReward)}
      brandName={brandName}
      rewards={rewards.map(serializeReward)}
    />
  );
}
