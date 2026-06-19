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
        "rounded-[28px] bg-white",
        shadow && "shadow-sm shadow-slate-900/5",
        bordered && "border border-slate-200/70",
        className,
      )}
      {...props}
    />
  );
}
