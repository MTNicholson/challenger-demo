import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  bordered?: boolean;
  shadow?: boolean;
};

export function Card({
  className,
  bordered = true,
  shadow = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "brand-glass rounded-[var(--brand-radius)] bg-white",
        shadow && "shadow-[var(--brand-shadow)]",
        bordered && "border border-slate-200",
        className,
      )}
      {...props}
    />
  );
}
