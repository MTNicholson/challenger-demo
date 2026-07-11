import { notFound } from "next/navigation";
import { getChallengeById } from "@/data/challenges";
import { getBrandLocations } from "@/data/locations";
import { ChallengeDetailScreen } from "@/components/user/challenge-detail-screen";
import { getPublishedUserChallengeById } from "@/lib/public-challenges";
import { getPublicBrandById } from "@/lib/public-brands";
import { routes } from "@/lib/routes";

export default async function ChallengeDetailPage({ params, searchParams }: PageProps<"/app/challenges/[id]">) {
  const { id } = await params;
  const { from } = await searchParams;
  const challenge = await getPublishedUserChallengeById(id) ?? getChallengeById(id);
  if (!challenge) notFound();
  const brand = await getPublicBrandById(challenge.brandId);

  return <ChallengeDetailScreen challenge={challenge} locations={getBrandLocations(challenge.brandId).slice(0, 5)} backHref={from === "favorites" ? routes.user.favorites : routes.user.challenges} brandHref={brand ? routes.user.brandDetail(brand.id) : undefined} />;
}
