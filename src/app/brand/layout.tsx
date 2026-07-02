import { ReactNode } from "react";
import "./brand.css";

type BrandLayoutProps = {
  children: ReactNode;
};

export default function BrandLayout({ children }: BrandLayoutProps) {
  return children;
}
