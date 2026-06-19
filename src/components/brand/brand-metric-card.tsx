import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";
import { MetricCard } from "@/components/ui/metric-card";

type BrandMetricCardProps = {
  label: string;
  value: string | number;
  delta?: string;
  icon?: ComponentType<LucideProps>;
  className?: string;
};

export function BrandMetricCard({
  label,
  value,
  delta,
  icon,
  className,
}: BrandMetricCardProps) {
  return (
    <MetricCard
      className={className}
      delta={delta}
      icon={icon}
      label={label}
      value={value}
    />
  );
}
