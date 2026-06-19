import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarketingSectionProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function MarketingSection({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: MarketingSectionProps) {
  return (
    <section id={id} className={cn("py-14 sm:py-18", className)}>
      <div className="mb-8 max-w-3xl">
        {eyebrow ? (
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-3 text-3xl font-black leading-tight text-slate-950 sm:text-4xl">
          {title}
        </h2>
        {description ? (
          <p className="mt-4 text-lg leading-8 text-slate-600">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
