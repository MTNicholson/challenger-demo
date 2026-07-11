import { redirect } from "next/navigation";
import { BrandSettingsClient } from "@/components/brand/brand-settings-client";
import { getCurrentBrand } from "@/lib/auth-server";
import { routes } from "@/lib/routes";

export default async function BrandSettingsPage() {
  const session = await getCurrentBrand();
  if (!session) redirect(routes.brandAuth.login);

  return (
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
  );
}
