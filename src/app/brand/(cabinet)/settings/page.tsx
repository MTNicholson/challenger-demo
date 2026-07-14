import { redirect } from "next/navigation";
import { BrandSettingsClient } from "@/components/brand/brand-settings-client";
import { BrandPublicStatusSettings } from "@/components/brand/brand-public-status-settings";
import { getCurrentBrand } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";

export default async function BrandSettingsPage() {
  const session = await getCurrentBrand();
  if (!session) redirect(routes.brandAuth.login);
  const [locations, challenges, rewards] = await Promise.all([
    prisma.brandLocation.count({ where: { brandId: session.brand.id } }),
    prisma.brandChallenge.count({ where: { brandId: session.brand.id, status: "active" } }),
    prisma.brandReward.count({ where: { brandId: session.brand.id, status: "active", archivedAt: null } }),
  ]);

  return (
    <>
      <BrandPublicStatusSettings
        moderationStatus={session.brand.status}
        initialPublicStatus={session.brand.publicStatus}
        readiness={{ profile: Boolean(session.brand.name && session.brand.category && session.brand.description), logo: Boolean(session.brand.logoUrl), cover: Boolean(session.brand.coverImageUrl), location: locations > 0, challenge: challenges > 0, reward: rewards > 0 }}
      />
      <BrandSettingsClient
      memberEmail={session.member.email}
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
      />
    </>
  );
}
