import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";
import { getPublicBrandById, getPublicBrandBySlug } from "@/lib/public-brands";
import { routes } from "@/lib/routes";
import { UserBrandDetailClient } from "./user-brand-detail-client";

export const dynamic = "force-dynamic";

export default async function UserBrandPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ from?: string }> }) {
  const { slug: id } = await params;
  const { from } = await searchParams;
  const [brand, user] = await Promise.all([getPublicBrandById(id), getCurrentUser()]);

  if (!brand) {
    const legacyBrand = await getPublicBrandBySlug(id);
    if (legacyBrand) redirect(`${routes.user.brandDetail(legacyBrand.id)}${from === "favorites" ? "?from=favorites" : ""}`);
  }

  if (!brand) notFound();

  return <UserBrandDetailClient brand={brand} userCity={user?.city} backHref={from === "favorites" ? routes.user.favorites : routes.user.brands} />;
}
