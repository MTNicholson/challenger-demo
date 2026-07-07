import Link from "next/link";
import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { Coffee } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/button";

type BrandPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  brandName?: string;
  actionLabel?: string;
  actionHref?: string;
  actionIcon?: ComponentType<LucideProps>;
  variant?: "light" | "dark";
  className?: string;
};

export function BrandPageHeader({
  eyebrow,
  title,
  description,
  brandName,
  actionLabel,
  actionHref,
  actionIcon: ActionIcon,
  variant = "light",
  className,
}: BrandPageHeaderProps) {
  const dark = variant === "dark";
  const action = actionLabel && actionHref ? (
    <Link
      href={actionHref}
      className={buttonClasses({
        variant: dark ? "secondary" : "dark",
        size: "md",
        className: dark ? "mt-5 md:mt-0" : undefined,
      })}
    >
      {ActionIcon ? <ActionIcon className="h-4 w-4" /> : null}
      {actionLabel}
    </Link>
  ) : null;

  const content = (
    <>
      <div>
        {brandName ? (
          <div className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-sm font-bold text-white/75">
            <Coffee className="h-4 w-4" />
            {brandName}
          </div>
        ) : eyebrow ? (
          <div className="text-sm font-bold text-blue-700">{eyebrow}</div>
        ) : null}
        <h1 className={cn("mt-1 text-3xl font-extrabold leading-tight tracking-[-0.025em]", dark && "mt-5 text-4xl")}> 
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "mt-2 max-w-2xl text-sm leading-6",
              dark ? "text-white/65" : "text-slate-500",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action}
    </>
  );

  if (dark) {
    return (
      <section
        className={cn(
          "brand-glass-dark rounded-2xl p-6 text-white sm:p-7",
          className,
        )}
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          {content}
        </div>
      </section>
    );
  }

  return (
    <section
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      {content}
    </section>
  );
}
