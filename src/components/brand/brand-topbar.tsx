import { Building2 } from "lucide-react";
import { BrandAccountMenu } from "./brand-account-menu";
import type { BrandIdentity } from "./brand-types";

type BrandTopbarProps = {
  brand: BrandIdentity;
};

export function BrandTopbar({ brand }: BrandTopbarProps) {
  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="hidden text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-400 sm:block">
            Кабинет бренда
          </div>
          <div className="flex min-w-0 items-center gap-2 text-base font-black text-slate-950">
            <Building2 className="h-4 w-4 shrink-0 text-blue-600" />
            <span className="truncate">{brand.name}</span>
          </div>
        </div>

        <BrandAccountMenu brand={brand} />
      </div>
    </header>
  );
}
