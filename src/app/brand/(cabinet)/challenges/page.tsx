import { companyBrand } from "@/data/brands";
import { getBrandChallenges } from "@/data/challenges";
import { getCurrentBrand } from "@/lib/auth-server";
import { BrandChallengesClient } from "./brand-challenges-client";

export default async function BrandChallengesPage() {
  const session = await getCurrentBrand();
  const brandName = session?.brand.name ?? "бренда";
  const challenges = getBrandChallenges(companyBrand.id);

  return <BrandChallengesClient brandName={brandName} challenges={challenges} />;
}
