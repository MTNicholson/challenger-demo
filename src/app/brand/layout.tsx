import { ReactNode } from "react";
import { BrandShell } from "@/components/brand/brand-shell";

type BrandLayoutProps = {
  children: ReactNode;
};

export default function BrandLayout({ children }: BrandLayoutProps) {
  return <BrandShell>{children}</BrandShell>;
}
