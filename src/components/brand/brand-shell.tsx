import { ReactNode } from "react";
import type { PublicBrand } from "@/lib/auth-shared";
import { BrandLayoutShell } from "./brand-layout-shell";

type BrandShellProps = {
  children: ReactNode;
  brand: PublicBrand;
};

export function BrandShell({ children, brand }: BrandShellProps) {
  return (
    <BrandLayoutShell brand={{ name: brand.name, logoUrl: brand.logoUrl }}>
      {children}
    </BrandLayoutShell>
  );
}
