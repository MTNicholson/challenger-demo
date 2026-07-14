import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "coin"
  | "dark"
  | "default";

const variantClasses: Record<BadgeVariant, string> = {
  neutral: "border border-slate-200/70 bg-white/70 text-slate-600",
  success: "border border-emerald-200/70 bg-emerald-50/90 text-emerald-700",
  warning: "border border-amber-200/70 bg-amber-50/90 text-amber-800",
  danger: "border border-rose-200/70 bg-rose-50/90 text-rose-600",
  coin: "bg-amber-100 text-amber-950",
  dark: "bg-slate-950 text-white",
  default: "border border-slate-200/70 bg-white/70 text-slate-600",
};

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-extrabold leading-5 shadow-sm shadow-slate-900/[0.03]",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
