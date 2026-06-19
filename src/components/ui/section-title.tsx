import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";

type SectionTitleProps = {
  title: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  titleClassName?: string;
};

export function SectionTitle({
  title,
  actionLabel,
  actionHref,
  className,
  titleClassName,
}: SectionTitleProps) {
  return (
    <div className={cn("flex items-center justify-between gap-4", className)}>
      <h2 className={cn("text-xl font-black", titleClassName)}>{title}</h2>
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1 text-sm font-black"
        >
          {actionLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
