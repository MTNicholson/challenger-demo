import { notFound, redirect } from "next/navigation";
import { getCurrentBrand } from "@/lib/auth-server";
import { prisma } from "@/lib/prisma";
import { routes } from "@/lib/routes";
import { LocationSettingsClient } from "./location-settings-client";

export default async function BrandLocationSettingsPage({ params }: PageProps<"/brand/locations/[id]">) {
  const session = await getCurrentBrand(); if (!session) redirect(routes.brandAuth.login);
  const { id } = await params;
  const location = await prisma.brandLocation.findFirst({ where: { id, brandId: session.brand.id }, include: { users: { select: { id:true,name:true,email:true,role:true,status:true,createdAt:true,lastLoginAt:true }, orderBy:{createdAt:"desc"} } } });
  if (!location) notFound();
  return <LocationSettingsClient initialLocation={{ ...location, createdAt: location.createdAt.toISOString(), updatedAt: location.updatedAt.toISOString(), users: location.users.map(user=>({...user,createdAt:user.createdAt.toISOString(),lastLoginAt:user.lastLoginAt?.toISOString()??null})) }} />;
}
