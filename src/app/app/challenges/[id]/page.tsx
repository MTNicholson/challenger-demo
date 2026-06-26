import { notFound } from "next/navigation";
import { challenges, getChallengeById } from "@/data/challenges";
import { getBrandLocations } from "@/data/locations";
import { ChallengeDetailScreen } from "@/components/user/challenge-detail-screen";

export function generateStaticParams() {
  return challenges.map((challenge) => ({
    id: challenge.id,
  }));
}

export default async function ChallengeDetailPage({
  params,
}: PageProps<"/app/challenges/[id]">) {
  const { id } = await params;
  const challenge = getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  const locations = getBrandLocations(challenge.brandId).slice(0, 5);
  return <ChallengeDetailScreen challenge={challenge} locations={locations} />;
}
