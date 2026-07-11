import { getPublishedUserChallenges } from "@/lib/public-challenges";
import { UserHomeClient } from "./user-home-client";

export default async function UserHomePage() {
  return <UserHomeClient challenges={await getPublishedUserChallenges()} />;
}
