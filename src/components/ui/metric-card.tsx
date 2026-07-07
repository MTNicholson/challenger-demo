import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string | number;
  icon?: ComponentType<LucideProps>;
  delta?: string;
  tone?: "light" | "dark" | "amber";
  className?: string;
};

export function MetricCard({
  label,
  value,
  icon: Icon,
  delta,
  tone = "light",
  className,
}: MetricCardProps) {
  const dark = tone === "dark";

  return (
    <Card
      bordered={!dark}
      className={cn(
        "brand-interactive overflow-hidden p-5 sm:p-6",
        dark && "bg-slate-950 text-white shadow-xl shadow-slate-900/10",
        tone === "amber" && "bg-amber-100 text-amber-950",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-3">
        {Icon ? (
          <div
            className={cn(
              "grid h-11 w-11 place-items-center rounded-2xl",
              dark ? "bg-white/10" : "border border-blue-100 bg-blue-50 text-blue-700 shadow-sm",
              tone === "amber" && "bg-white/45",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                dark ? "text-white/70" : "text-blue-700",
                tone === "amber" && "text-amber-800",
              )}
            />
          </div>
        ) : (
          <span />
        )}
        {delta ? (
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
            {delta}
          </span>
        ) : null}
      </div>
      <div className="mt-5 text-4xl font-extrabold tracking-[-0.04em]">{value}</div>
      <div
        className={cn(
          "mt-1 text-sm font-bold",
          dark ? "text-white/55" : "text-slate-500",
          tone === "amber" && "text-amber-700",
        )}
      >
        {label}
      </div>
    </Card>
  );
}
