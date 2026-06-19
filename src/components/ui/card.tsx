import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  bordered?: boolean;
  shadow?: boolean;
};

export function Card({
  className,
  bordered = false,
  shadow = true,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-[30px] bg-white",
        shadow && "shadow-sm",
        bordered && "border border-slate-100",
        className,
      )}
      {...props}
    />
  );
}
