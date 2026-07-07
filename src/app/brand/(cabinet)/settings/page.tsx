import { redirect } from "next/navigation";
import { BrandSettingsClient } from "@/components/brand/brand-settings-client";
import { getCurrentBrand } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";

export default async function BrandSettingsPage() {
  const session = await getCurrentBrand();
  if (!session) redirect(routes.brandAuth.login);

  const locations = await prisma.brandLocation.findMany({
    where: { brandId: session.brand.id },
    orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
  });

  return (
    <BrandSettingsClient
      brand={{
        id: session.brand.id,
        name: session.brand.name,
        category: session.brand.category,
        city: session.brand.city,
        address: session.brand.address,
        description: session.brand.description,
        website: session.brand.website,
        logoUrl: session.brand.logoUrl,
        coverImageUrl: session.brand.coverImageUrl,
      }}
      locations={locations.map((location) => ({
        id: location.id,
        name: location.name,
        city: location.city,
        address: location.address,
        fullAddress: location.fullAddress,
        lat: location.lat,
        lng: location.lng,
        geoProvider: location.geoProvider,
        geoPlaceId: location.geoPlaceId,
        description: location.description,
        isMain: location.isMain,
      }))}
    />
  );
}
