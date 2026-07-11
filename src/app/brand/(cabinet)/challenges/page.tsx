import { getCurrentBrand } from "@/lib/auth-server";
import { serializeBrandChallenge } from "@/lib/brand-challenges";
import { prisma } from "@/lib/prisma";
import { BrandChallengesClient } from "./brand-challenges-client";

export default async function BrandChallengesPage() {
  const session = await getCurrentBrand();
  const brandName = session?.brand.name ?? "Бренд";
  const challenges = session
    ? await prisma.brandChallenge.findMany({
        where: { brandId: session.brand.id },
        orderBy: [{ updatedAt: "desc" }],
      })
    : [];

  return <BrandChallengesClient brandName={brandName} challenges={challenges.map(serializeBrandChallenge)} />;
}
