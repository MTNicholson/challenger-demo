import { ReactNode } from "react";
import type { PublicBrand } from "@/lib/auth-shared";
import { BrandLayoutShell } from "./brand-layout-shell";

type BrandShellProps = {
  children: ReactNode;
  brand: PublicBrand;
  pendingLocationRequests: number;
};

export function BrandShell({ children, brand, pendingLocationRequests }: BrandShellProps) {
  return (
    <BrandLayoutShell brand={{ name: brand.name, logoUrl: brand.logoUrl }} pendingLocationRequests={pendingLocationRequests}>
      {children}
    </BrandLayoutShell>
  );
}
