"use client";

import { ReactNode, useState } from "react";
import { cn } from "@/lib/cn";
import { BrandSidebar } from "./brand-sidebar";
import { BrandTopbar } from "./brand-topbar";
import type { BrandIdentity } from "./brand-types";

type BrandLayoutShellProps = {
  children: ReactNode;
  brand: BrandIdentity;
};

export function BrandLayoutShell({ children, brand }: BrandLayoutShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="brand-shell min-h-screen text-slate-950">
      <div className="flex min-h-screen">
        <BrandSidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
        />

        <div className="min-w-0 flex-1">
          <BrandTopbar brand={brand} />

          <main
            className={cn(
              "mx-auto w-full max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8",
              "transition-[padding] duration-200",
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
