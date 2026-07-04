import { getPublicBrands } from "@/lib/public-brands";
import { FavoritesClient } from "./favorites-client";

export const dynamic = "force-dynamic";

export default async function FavoritesPage() {
  const brands = await getPublicBrands();

  return <FavoritesClient brands={brands} />;
}
