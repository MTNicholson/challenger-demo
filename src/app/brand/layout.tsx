import { ReactNode } from "react";
import { BrandShell } from "@/components/brand/brand-shell";
import "./brand.css";

type BrandLayoutProps = {
  children: ReactNode;
};

export default function BrandLayout({ children }: BrandLayoutProps) {
  return <BrandShell>{children}</BrandShell>;
}
