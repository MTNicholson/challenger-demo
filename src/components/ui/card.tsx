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
        "brand-glass rounded-[var(--brand-radius)] bg-white/75 backdrop-blur-xl",
        shadow && "shadow-[var(--brand-shadow)]",
        bordered && "border border-white/80",
        className,
      )}
      {...props}
    />
  );
}
