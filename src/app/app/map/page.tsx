import "leaflet/dist/leaflet.css";
import { prisma } from "@/lib/prisma";
import { ChallengeMapScreen } from "./map-screen";

type UserMapPageProps = {
  searchParams?: Promise<{ locationId?: string | string[] }>;
};

export default async function UserMapPage({ searchParams }: UserMapPageProps) {
  const params = await searchParams;
  const rawLocationId = params?.locationId;
  const locationId = Array.isArray(rawLocationId) ? rawLocationId[0] : rawLocationId;
  const mapLocations = await prisma.brandLocation.findMany({
    where: {
      lat: { not: null },
      lng: { not: null },
    },
    orderBy: [{ isMain: "desc" }, { createdAt: "desc" }],
    select: {
      id: true,
      name: true,
      city: true,
      address: true,
      fullAddress: true,
      lat: true,
      lng: true,
      description: true,
      isMain: true,
      brand: {
        select: {
          id: true,
          name: true,
          category: true,
          logoUrl: true,
          coverImageUrl: true,
        },
      },
    },
  });
  const selectedLocation = locationId
    ? await prisma.brandLocation.findUnique({
        where: { id: locationId },
        select: {
          id: true,
          name: true,
          city: true,
          address: true,
          fullAddress: true,
          lat: true,
          lng: true,
          description: true,
          isMain: true,
          brand: {
            select: {
              id: true,
              name: true,
              category: true,
              logoUrl: true,
              coverImageUrl: true,
            },
          },
        },
      })
    : null;

  return (
    <ChallengeMapScreen
      initialSelectedLocation={selectedLocation}
      locations={mapLocations}
      requestedLocationId={locationId ?? null}
    />
  );
}
