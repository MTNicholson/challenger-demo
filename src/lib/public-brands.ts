import "server-only";

import type { Brand, BrandChallenge, BrandLocation } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type PublicBrandSummary = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  city: string | null;
  address: string | null;
  description: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  website: string | null;
  createdAt: string;
  challengesCount: number;
  locations: PublicBrandLocation[];
};

export type PublicBrandLocation = {
  id: string;
  name: string | null;
  city: string;
  address: string;
  fullAddress: string | null;
  lat: number | null;
  lng: number | null;
  description: string | null;
  isMain: boolean;
};

export type PublicBrandChallenge = {
  id: string;
  brandId: string;
  title: string;
  description: string | null;
  status: string;
  type: string | null;
  reward: string | null;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PublicBrandDetail = PublicBrandSummary & {
  challenges: PublicBrandChallenge[];
};

function serializeBrand(
  brand: Brand & { _count?: { challenges: number }; locations?: BrandLocation[] },
): PublicBrandSummary {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    category: brand.category,
    city: brand.city,
    address: brand.address,
    description: brand.description,
    logoUrl: brand.logoUrl,
    coverImageUrl: brand.coverImageUrl,
    website: brand.website,
    createdAt: brand.createdAt.toISOString(),
    challengesCount: brand._count?.challenges ?? 0,
    locations: brand.locations?.map(serializeLocation) ?? [],
  };
}

function serializeLocation(location: BrandLocation): PublicBrandLocation {
  return {
    id: location.id,
    name: location.name,
    city: location.city,
    address: location.address,
    fullAddress: location.fullAddress,
    lat: location.lat,
    lng: location.lng,
    description: location.description,
    isMain: location.isMain,
  };
}

function serializeChallenge(challenge: BrandChallenge): PublicBrandChallenge {
  return {
    id: challenge.id,
    brandId: challenge.brandId,
    title: challenge.title,
    description: challenge.description,
    status: challenge.status,
    type: challenge.type,
    reward: challenge.reward,
    startsAt: challenge.startsAt?.toISOString() ?? null,
    endsAt: challenge.endsAt?.toISOString() ?? null,
    createdAt: challenge.createdAt.toISOString(),
    updatedAt: challenge.updatedAt.toISOString(),
  };
}

export function normalizePublicBrandSlug(slug: string) {
  try {
    return decodeURIComponent(slug).trim().toLocaleLowerCase().normalize("NFC");
  } catch {
    return slug.trim().toLocaleLowerCase().normalize("NFC");
  }
}

export async function getPublicBrands(): Promise<PublicBrandSummary[]> {
  const brands = await prisma.brand.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      locations: {
        orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
      },
      _count: {
        select: { challenges: true },
      },
    },
  });

  return brands.map(serializeBrand);
}

export async function getPublicBrandBySlug(slug: string): Promise<PublicBrandDetail | null> {
  const normalizedSlug = normalizePublicBrandSlug(slug);

  const brand = await prisma.brand.findFirst({
    where: { slug: normalizedSlug },
    include: {
      challenges: {
        orderBy: { createdAt: "desc" },
      },
      locations: {
        orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
      },
      _count: {
        select: { challenges: true },
      },
    },
  });

  if (!brand) return null;

  return {
    ...serializeBrand(brand),
    challenges: brand.challenges.map(serializeChallenge),
  };
}

export async function getPublicBrandById(id: string): Promise<PublicBrandDetail | null> {
  const brand = await prisma.brand.findUnique({
    where: { id },
    include: {
      challenges: { orderBy: { createdAt: "desc" } },
      locations: { orderBy: [{ isMain: "desc" }, { createdAt: "asc" }] },
      _count: { select: { challenges: true } },
    },
  });
  return brand ? { ...serializeBrand(brand), challenges: brand.challenges.map(serializeChallenge) } : null;
}
