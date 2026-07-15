import { RewardQrScreen } from "@/components/user/reward-qr-screen";

export default async function ChallengeRewardPage({ params }: PageProps<"/app/challenges/[id]/reward">) {
  const { id } = await params;
  return <RewardQrScreen challengeId={id} />;
}
