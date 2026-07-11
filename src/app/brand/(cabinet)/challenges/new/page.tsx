import { companyBrand } from "@/data/brands";
import { getBrandLocations } from "@/data/locations";
import { getCurrentBrand } from "@/lib/auth-server";
import { serializeBrandChallenge } from "@/lib/brand-challenges";
import { prisma } from "@/lib/prisma";
import type { BrandRewardDto, BrandRewardStatus, BrandRewardType } from "@/lib/brand-rewards";
import { NewChallengeWizard } from "./new-challenge-wizard";

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

export default async function NewChallengePage({
  searchParams,
}: {
  searchParams?: Promise<{ challengeId?: string; draftId?: string }>;
}) {
  const session = await getCurrentBrand();
  const brandName = session?.brand.name ?? companyBrand.name;
  const params = await searchParams;
  const databaseLocations = session
    ? await prisma.brandLocation.findMany({
        where: { brandId: session.brand.id },
        orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
      })
    : [];
  const rewards = session
    ? await prisma.brandReward.findMany({
        where: { brandId: session.brand.id, status: "active" },
        orderBy: [{ updatedAt: "desc" }],
      })
    : [];
  const initialChallenge = session && params?.challengeId
    ? await prisma.brandChallenge.findFirst({ where: { id: params.challengeId, brandId: session.brand.id } })
    : null;
  const fallbackLocations = getBrandLocations(companyBrand.id);
  const locations = databaseLocations.length
    ? databaseLocations.map((location) => ({
        id: location.id,
        title: location.name || `${brandName}, ${location.address}`,
        address: location.fullAddress || location.address,
        district: location.city,
      }))
    : fallbackLocations.map((location) => ({
        id: location.id,
        title: location.title,
        address: location.address,
        district: location.district,
      }));

  return (
    <NewChallengeWizard
      brandLogo={session?.brand.logoUrl ?? null}
      brandName={brandName}
      initialChallenge={initialChallenge ? serializeBrandChallenge(initialChallenge) : undefined}
      locations={locations}
      rewards={rewards.map(serializeReward)}
    />
  );
}
