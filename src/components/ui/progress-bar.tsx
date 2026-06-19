import { cn } from "@/lib/cn";

type ProgressBarProps = {
  value: number;
  max: number;
  size?: "sm" | "md";
  className?: string;
  indicatorClassName?: string;
};

export function ProgressBar({
  value,
  max,
  size = "md",
  className,
  indicatorClassName,
}: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-full bg-slate-100",
        size === "sm" ? "h-2" : "h-3",
        className,
      )}
      aria-valuemax={max}
      aria-valuemin={0}
      aria-valuenow={value}
      role="progressbar"
    >
      <div
        className={cn(
          "h-full rounded-full bg-emerald-400 transition-[width]",
          indicatorClassName,
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
