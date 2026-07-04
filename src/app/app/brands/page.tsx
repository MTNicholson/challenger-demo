import { getPublicBrands } from "@/lib/public-brands";
import { UserBrandsClient } from "./user-brands-client";

export const dynamic = "force-dynamic";

export default async function UserBrandsPage() {
  const brands = await getPublicBrands();

  return <UserBrandsClient brands={brands} />;
}
