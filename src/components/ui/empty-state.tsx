import Link from "next/link";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/cn";
import { buttonClasses } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  className?: string;
};

export function EmptyState({
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cn("p-6 text-center", className)} bordered>
      <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-50 text-slate-400">
        <Inbox className="h-6 w-6" />
      </div>
      <h2 className="mt-4 text-xl font-black">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {description}
      </p>
      {ctaLabel && ctaHref ? (
        <Link
          href={ctaHref}
          className={buttonClasses({
            variant: "dark",
            size: "md",
            className: "mt-5",
          })}
        >
          {ctaLabel}
        </Link>
      ) : null}
    </Card>
  );
}
