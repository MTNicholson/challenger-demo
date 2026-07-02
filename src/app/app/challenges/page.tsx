import { UserChallengesClient } from "./user-challenges-client";
import { getPublicBrands } from "@/lib/public-brands";

export const dynamic = "force-dynamic";

export default async function UserChallengesPage() {
  const brands = await getPublicBrands();

  return <UserChallengesClient brands={brands} />;
}
