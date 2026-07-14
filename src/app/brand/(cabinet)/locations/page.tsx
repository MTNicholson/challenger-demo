import { redirect } from "next/navigation";
import { BrandLocationsClient } from "@/components/brand/brand-locations-client";
import { getCurrentBrand } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";

export default async function BrandLocationsPage() {
  const session = await getCurrentBrand();
  if (!session) redirect(routes.brandAuth.login);
  const locations = await prisma.brandLocation.findMany({ where: { brandId: session.brand.id }, orderBy: [{ isMain: "desc" }, { createdAt: "asc" }], include: { users: { where: { role: "LOCATION_ADMIN", status: "ACTIVE" }, select: { id: true, name: true, email: true, status: true } }, _count: { select: { users: { where: { status: "ACTIVE" } } } } } });
  return <BrandLocationsClient initialLocations={locations.map((location) => ({ id: location.id, name: location.name, city: location.city, address: location.address, fullAddress: location.fullAddress, lat: location.lat, lng: location.lng, geoProvider: location.geoProvider, geoPlaceId: location.geoPlaceId, description: location.description, isMain: location.isMain, mode: location.mode, cabinetEnabled: location.cabinetEnabled, locationAdmin: location.users[0] ?? null, staffCount: location._count.users }))} />;
}
