import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { BrandShell } from "@/components/brand/brand-shell";
import { getCurrentBrand } from "@/lib/auth-server";
import { routes } from "@/lib/routes";

type BrandCabinetLayoutProps = {
  children: ReactNode;
};

export default async function BrandCabinetLayout({ children }: BrandCabinetLayoutProps) {
  const session = await getCurrentBrand();
  if (!session) redirect(routes.brandAuth.login);

  return <BrandShell brand={session.brand}>{children}</BrandShell>;
}
