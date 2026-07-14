import { getCurrentBrand } from "@/lib/auth-server";
import { serializeBrandChallenge } from "@/lib/brand-challenges";
import { prisma } from "@/lib/prisma";
import { BrandChallengesClient } from "./brand-challenges-client";
import { LocationChallengeRequests } from "@/components/brand/location-challenge-requests";
import { LocationLaunchedChallenges } from "@/components/brand/location-launched-challenges";

export default async function BrandChallengesPage() {
  const session = await getCurrentBrand();
  const brandName = session?.brand.name ?? "Бренд";
  const challenges = session
    ? await prisma.brandChallenge.findMany({
        where: { brandId: session.brand.id },
        orderBy: [{ updatedAt: "desc" }],
      })
    : [];

  // The main list contains only campaigns created by the main brand cabinet.
  // Flagship campaigns have their own clear section below.
  const locationLaunched = challenges.filter((challenge) => challenge.source === "location");
  const brandChallenges = challenges.filter((challenge) => challenge.source !== "location");
  const locationIds = [...new Set(locationLaunched.flatMap((challenge) => challenge.locationIds))];
  const locations = session
    ? await prisma.brandLocation.findMany({
        where: { id: { in: locationIds }, brandId: session.brand.id },
        select: { id: true, name: true },
      })
    : [];

  return (
    <>
      <BrandChallengesClient brandName={brandName} challenges={brandChallenges.map(serializeBrandChallenge)} />
      <div className="mx-auto mt-6 grid w-full max-w-[1280px] gap-6 px-6 pb-8">
        <LocationChallengeRequests />
        <LocationLaunchedChallenges
          challenges={locationLaunched}
          locations={Object.fromEntries(locations.map((location) => [location.id, location.name ?? "Точка"]))}
        />
      </div>
    </>
  );
}
