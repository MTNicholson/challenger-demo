import { getCurrentBrand } from "@/lib/auth-server";
import { serializeBrandChallenge } from "@/lib/brand-challenges";
import { prisma } from "@/lib/prisma";
import { BrandChallengesClient } from "./brand-challenges-client";

export default async function BrandChallengesPage() {
  const session = await getCurrentBrand();
  if (!session) return null;
  const [challenges, requests, locations, authors] = await Promise.all([
    prisma.brandChallenge.findMany({ where: { brandId: session.brand.id }, orderBy: { updatedAt: "desc" } }),
    prisma.locationChallengeRequest.findMany({ where: { brandId: session.brand.id }, orderBy: { updatedAt: "desc" } }),
    prisma.brandLocation.findMany({ where: { brandId: session.brand.id }, select: { id: true, name: true } }),
    prisma.locationUser.findMany({ where: { brandId: session.brand.id }, select: { id: true, name: true, email: true } }),
  ]);
  const locationNames = Object.fromEntries(locations.map((item) => [item.id, item.name ?? "Точка"]));
  const authorNames = Object.fromEntries(authors.map((item) => [item.id, item.name ?? item.email]));
  return <BrandChallengesClient brandName={session.brand.name} challenges={challenges.map(serializeBrandChallenge)} locationNames={locationNames} requests={requests.map((item) => ({ ...item, createdAt: item.createdAt.toISOString(), updatedAt: item.updatedAt.toISOString(), startsAt: item.startsAt?.toISOString() ?? null, endsAt: item.endsAt?.toISOString() ?? null, locationName: locationNames[item.locationId] ?? "Точка", authorName: authorNames[item.createdByLocationUserId] ?? "Администратор точки" }))}/>;
}
