import { UserChallengesClient } from "./user-challenges-client";
import { getPublishedUserChallenges } from "@/lib/public-challenges";

export default async function UserChallengesPage() {
  return <UserChallengesClient challenges={await getPublishedUserChallenges()} />;
}
