import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { BrandShell } from "@/components/brand/brand-shell";
import { getCurrentBrand } from "@/lib/auth-server";
import { routes } from "@/lib/routes";
import { prisma } from "@/lib/prisma";

type BrandCabinetLayoutProps = {
  children: ReactNode;
};

export default async function BrandCabinetLayout({ children }: BrandCabinetLayoutProps) {
  const session = await getCurrentBrand();
  if (!session) redirect(routes.brandAuth.login);
  const pendingLocationRequests = await prisma.locationChallengeRequest.count({ where: { brandId: session.brand.id, status: "submitted" } });

  return <BrandShell brand={session.brand} pendingLocationRequests={pendingLocationRequests}>{children}</BrandShell>;
}
