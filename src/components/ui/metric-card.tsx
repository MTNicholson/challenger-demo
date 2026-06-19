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
      className={cn(
        "p-5",
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
              dark ? "bg-white/10" : "bg-slate-50",
              tone === "amber" && "bg-white/45",
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                dark ? "text-white/70" : "text-slate-600",
                tone === "amber" && "text-amber-800",
              )}
            />
          </div>
        ) : (
          <span />
        )}
        {delta ? (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
            {delta}
          </span>
        ) : null}
      </div>
      <div className="mt-5 text-3xl font-black">{value}</div>
      <div
        className={cn(
          "mt-1 text-sm font-semibold",
          dark ? "text-white/55" : "text-slate-500",
          tone === "amber" && "text-amber-700",
        )}
      >
        {label}
      </div>
    </Card>
  );
}
